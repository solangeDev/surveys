import Vue from 'vue'
import api from '@/controllers/survey'
import {
  stat
} from 'fs';
import {
  S_IFREG
} from 'constants';
import dataJson from '../../components/data.json';
import EventBus from "../../bus";
import {
  type
} from 'os';

const state = {
  error: false,
  error_msj: "",
  loaded: false,
  // data-header progressbar
  cantQuestion: 0,
  progressQuestion: 0,
  sectionName: null,
  //data-container
  numPag: 0,
  template: null,
  clienData: null,
  survey_id: null,
  form_id: null,
  participant_token: null,
  participant_id: null,
  access_code: null,
  pag_survey: null,
  arrNextQuestions: [],
  //idQuestion : 0,
  idOption: 0,
  // copy of the previous question for compare
  copy_pag_survey: [],
  copy_template: null,
  // values ​​for secondary questions
  arrQuestDynamicSecon: [],
  variablesTag: [],
  arrnext: []
}

const cleanAddQuestionSecundary = (state) => {
  let compare = state.copy_pag_survey.filter((a) => {
    if (a.id == state.template[state.numPag].id) {
      return a;
    }
  })
  if (compare.length > 0) {
    let del_questions = false;
    state.pag_survey[0].question_options.forEach((a) => {
      if (a.next_question_secundary !== undefined && a.next_question_secundary == true) {
        if (a.value !== true) {
          del_questions = true;
        }
      }
    })
    let all_questions = [...state.template];
    let remove_quest = [];
    if (del_questions) {
      all_questions.forEach((a, index) => {
        if (typeof a.id == "string") {
          remove_quest.push(a.id);

        }
      })
      remove_quest.forEach((a) => {
        all_questions.forEach((b, index) => {
          if (a == b.id) {
            all_questions.splice(index, 1);
          }
        })
      })
      state.template = all_questions;
    }
  }
}

const getInitialsRelationShip = (data_indice, valueBack) => {
  const data_dynamic = filterValueClient(data_indice);
  let relationship = null;
  data_dynamic.forEach((a) => {
    if (a.client_details[1] !== undefined) {
      const id = a.client_details[1].person_details[0].id;
      if (id == valueBack) {
        relationship = a.relationship
      }
    }
  })
  return relationship;
}

const arrDiff = (a, b) => {
  Array.prototype.diff = function (arr) {
    var mergedArr = this.concat(arr);
    return mergedArr.filter(function (e) {
      return mergedArr.indexOf(e) === mergedArr.lastIndexOf(e);
    });
  };
  return a.diff(b);
}

const valuesChangedIdentifier = (arrObj1, arrObj2, val) => {
  let idsWhoseValuesHasChanged = []
  arrObj1.forEach(obj1 => {
    arrObj2.forEach(obj2 => {
      if ((obj1.id === obj2.id) && (obj1.value !== obj2.value))
        idsWhoseValuesHasChanged.push(obj2[val])
    })
  })
  return idsWhoseValuesHasChanged
}

const adjustTemplateQuestionDynamicSecundary = (state, dataTemplate) => {
  //data question 
  const question = state.template[state.numPag];

  // copy list of questions
  const allQuestion = [...state.template];

  // copy original template
  const template = dataTemplate[0].template;

  // id of original template
  const template_id = dataTemplate[0].template.id;

  const parent_id = dataTemplate[0].id;

  // answers to generate
  const responses = state.pag_survey[0].question_options.filter((a) => {
    if (a.value === true) {
      return a;
    }
  }).map((c) => {
    let obj = {};
    obj.id = `DYNAMIC-${template_id}-${c.valueBack}`
    obj.data = c;
    return obj
  })

  // delete questions with options in false
  const responses_false = state.pag_survey[0].question_options.filter((a) => {
    if (a.value === null || a.value === a.valueBack) {
      return a;
    }
  }).map((c) => {
    return `DYNAMIC-${template_id}-${c.valueBack}`
  })
  if (responses_false.length > 0) {
    allQuestion.forEach((c, index) => {
      if (responses_false.indexOf(c.id) !== -1) {
        allQuestion.splice(index, 1);
      }
    })
  }


  // filter the ones that are already generated
  // a copy of the form that is already generated is made, it is deleted and it is added again
  let addQuestion = [];
  let idsAddQuestion = [];
  let arrAddQuestion = [];
  let cantAdd = 0;
  const generated = responses.filter((a) => {
    const quest = state.template.filter((c) => {
      if (c.id == a.id) {
        addQuestion.push(c);
        return c;
      }
    })
    if (quest.length > 0) {
      return a;
    }
  })

  if (generated.length > 0) {
    generated.forEach((a) => {
      idsAddQuestion.push(a.id)
    })
    allQuestion.forEach((c, index) => {
      generated.forEach((a) => {
        if (idsAddQuestion.indexOf(c.id) !== -1) {
          allQuestion.splice(index, 1);
          cantAdd = cantAdd + 1;
        };
      });
    })

    let indexPag = state.numPag;
    addQuestion.forEach((a) => {
      indexPag = indexPag + 1;
      allQuestion.splice(indexPag, 0, a);
    })

  }
  // create template copy with the selected options
  const newQuestionsTemplate = responses.filter((i) => {
    if (idsAddQuestion.indexOf(i.id) === -1) {
      return i;
    }
  }).map((c) => {
    let b = {
      ...template
    }
    const data = c.data;
    const name = data.option_text;
    const value = data.valueBack;
    const dataMapping = getDataClient(state, value, question.client_section_data);
    let a = {
      ...b,
      question_options: b.question_options.map((a) => {
        let c = {
          ...a,
          value: mappingDynamic(dataMapping, a.key_name) //mapping values question-dynamic-secundary
        }
        return c;
      })
    }
    /***** set relationship initials for dynamic options *****/
    if (question.is_dynamic && question.type == "form-dynamic-options") {
      if (question.client_section_data == "['relationships']") {
        a.relationship = getInitialsRelationShip(question.client_section_data, value)
      }
    }
    a.id = `DYNAMIC-${a.id}-${value}`
    arrAddQuestion.push(a.id)
    a.type = "static-form";
    a.question_text = a.question_text.replace("['name']", name);
    return a;
  })

  if (newQuestionsTemplate.length > 0) {
    // Add the replicas in the Survey   
    let templates_generated = [];
    let indexAct = state.numPag + cantAdd;
    newQuestionsTemplate.forEach((a) => {
      indexAct = indexAct + 1;
      templates_generated.push(a.id);
      allQuestion.splice(indexAct, 0, a);
    })
  }

  // update record by relation between the deleted templates and the raised questions
  state.arrQuestDynamicSecon.forEach((a, index) => {
    if (a.id == parent_id) {
      let a = {
        ...state.arrQuestDynamicSecon[index]
      };
      a.responses = state.pag_survey[0].question_options;
      a.templates_generated = arrAddQuestion;
      state.arrQuestDynamicSecon[index] = a;
    }
  })

  // remove template
  allQuestion.forEach((a, index) => {
    if (a.id == template.id) {
      allQuestion.splice(index, 1);
    }
  })

  state.template = [...allQuestion];
  state.cantQuestion = state.template.length;

}

const getDataClient = (state, idClient, client_data) => {
  switch (client_data) {
    case "['relationships']":
      let data = filterValueClient(client_data);
      const test = data.map((a) => {
        let data = null;
        let obj = null;
        if (a.client_details[0].id == parseInt(idClient)) {
          if (a.client_details[1] !== undefined) {
            data = a.client_details[1].person_details[0];
          } else {
            data = a.client_details[0];
          }
        }
        if (data !== null) {
          obj = {};
          obj.first_name = data.first_name;
          obj.last_name = data.last_name;
          obj.middle_name = data.middle_name;
          obj.sin_number = data.SIN;
          obj.date_of_birth = data.date_of_birth;
        }
        if (obj != null) {
          return obj;
        }
      }).filter((c) => {
        if (c !== null) {
          return c;
        }
      })
      return test;
      break;
  }
}

const createTemplateQuestionDynamicSecundary = (state) => {
  //data question 
  const question = state.template[state.numPag];

  // copy list of questions
  const allQuestion = [...state.template];

  // copy template
  const template = state.template[state.numPag + 1];

  // get selected options
  const responses = [...state.template[state.numPag].question_options]
  const id_responses = [];
  responses.forEach((z) => {
    if (z.value === true) {
      id_responses.push(`${z.valueBack}_${z.option_text}`);
    }
  })

  // create template copy with the selected options
  const newQuestionsTemplate = id_responses.map((i) => {
    let b = {
      ...template
    }
    const name = i.split("_")[1];
    const value = i.split("_")[0];
    const dataMapping = getDataClient(state, value, question.client_section_data);

    //const dataRelationship = 
    const id_temp = `DYNAMIC-${template.id}-${value}`;
    let a = {
      ...b,
      question_options: b.question_options.map((a) => {
        // preload answers already saved
        let option_resp = [];
        if (template.responses.length > 0) {
          option_resp = template.responses.filter((z) => {
            if (z.id === id_temp) {
              let copy = [...z.responses];
              return copy;
            }
          })
        }
        if (option_resp.length > 0) {
          option_resp = option_resp[0].responses;
        }
        //mapping values question-dynamic-secundary
        let c = {
          ...a,
          value: (option_resp.length > 0) ? preloadOption(i.id, i.type, option_resp, a.type, a.key_name, a.option_text, a.value) : mappingDynamic(dataMapping, a.key_name)
        }
        return c;
      })
    }
    /***** set relationship initials for dynamic options *****/
    if (question.is_dynamic && question.type == "form-dynamic-options") {
      if (question.client_section_data == "['relationships']") {
        a.relationship = getInitialsRelationShip(question.client_section_data, value)
      }
    }
    a.id = id_temp;
    a.type = "static-form";
    a.question_text = a.question_text.replace("['name']", name);
    return a;
  })

  // remove template
  allQuestion.forEach((a, index) => {
    if (a.id == template.id) {
      allQuestion.splice(index, 1);
    }
  })

  // Add the replicas in the Survey   
  let templates_generated = [];
  let indexAct = state.numPag;
  newQuestionsTemplate.forEach((a) => {
    indexAct = indexAct + 1;
    templates_generated.push(a.id);
    allQuestion.splice(indexAct, 0, a);
  })

  // add record by relation between the deleted templates and the generated questions
  let obj = {};
  obj.id = state.template[state.numPag].id;
  obj.template = template;
  obj.responses = responses;
  obj.templates_generated = templates_generated;
  state.arrQuestDynamicSecon = [...state.arrQuestDynamicSecon, obj];
  state.template = [...allQuestion];
  state.cantQuestion = state.template.length;

}

//mapping values question-dynamic-secundary
const mappingDynamic = (data, key_name) => {
  if (Object.keys(data[0]).indexOf(key_name) !== -1) {
    return data[0][key_name];
  }
}

const goclone = (source) => {
  if (Object.prototype.toString.call(source) === '[object Array]') {
    var clone = [];
    for (var i = 0; i < source.length; i++) {
      clone[i] = goclone(source[i]);
    }
    return clone;
  } else if (typeof (source) == "object") {
    var clone = {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        clone[prop] = goclone(source[prop]);
      }
    }
    return clone;
  } else {
    return source;
  }
}

const searchMapValue = (obj, props) => {
  if (props.length == 0) {
    return obj
  } else {
    if (obj.hasOwnProperty(props[0])) {
      return searchMapValue(obj[props.shift()], props)
    } else {
      return obj;
    }
  }
}

const filterValueClient = (state, filter) => {
  if (filter) {
    const dataClient = state.clienData;
    let cleanString = filter.replace(/\['/g, '');
    cleanString = cleanString.replace(/'\]/g, '.');
    let arrIndex = cleanString.split(".");
    arrIndex.pop();
    return searchMapValue(dataClient, arrIndex);
  }
}

const nextQuestionForm = async (state) => {
  /***** Save Response by option *****/
  await saveJsonResponses(state)
}

/**** Next Question *****/
const nextPagina = async (state) => {
  if (!state.error) {
    Vue.set(state, 'sectionName', null)
    let section_name = null;
    let pag_anterior = state.template[state.numPag];
    let pag_actual = state.template.filter((i, key) => {
      if (state.numPag + 1 == key) {
        section_name = i.section.section_text;
        return i;
      }
    });
    // hide the type question template  form  relationships dynamic resp
    let val = 1;
    if (pag_actual.type == "question-dynamic-secundary") {
      val = 2;
    }
    Vue.set(state, 'numPag', state.numPag + val)
    if (section_name != null) {
      Vue.set(state, 'sectionName', section_name)
    }
    Vue.set(state, 'pag_survey', pag_actual)
    // end condition for progress bar
    if (state.progressQuestion + 1 == state.cantQuestion) {
      Vue.set(state, 'progressQuestion', state.progressQuestion + val)
      Vue.set(state, 'sectionName', null)
    }
  }
}

// delete additional questions added delete everything that does not have to do in addArrNextQuestion
const cleanNextQuestion = (data) => {
  let arrRemove = [];
  let allQuestion = [...state.template]
  data.forEach((a) => {
    state.arrNextQuestions.forEach((b) => {
      if (b.question_id == state.pag_survey[0].id) {
        b.questions.forEach((c) => {
          if (c.option_id !== a.id) {
            arrRemove = [...arrRemove, c.question_id]
          }
        })
      }
    })
  })

  // Add children of the parent question in arrRemove
  arrRemove.forEach((c) => {
    state.arrNextQuestions.forEach((b) => {
      if (b.question_id == c) {
        b.questions.forEach((c) => {
          arrRemove = [...arrRemove, c.question_id]
        })
      }
    })
  })

  if (arrRemove.length > 0) {
    arrRemove.forEach((c) => {
      allQuestion.forEach((d, index) => {
        if (c === d.id) {
          allQuestion.splice(index, 1);
        }
      })
    })

    arrRemove.forEach((c) => {
      allQuestion.forEach((d, index) => {
        if (c === d.parentid) {
          allQuestion.splice(index, 1);
        }
      })
    })

    let copyNextQuestions = [...state.arrNextQuestions];
    arrRemove.forEach((d) => {
      copyNextQuestions.forEach((z, index) => {
        if (d === z.question_id) {
          copyNextQuestions.splice(index, 1);
        }
      })
    })
    state.arrNextQuestions = [...copyNextQuestions]
    state.template = [...allQuestion];
    state.cantQuestion = state.template.length;
  }
}

const addQuestion = (state) => {

  // add mapQuestions the values ​​of the questions added allQuestion
  let mapQuestions = [];
  let allQuestion = [...state.template];

  let indexAct = state.numPag;
  state.pag_survey[0].question_options.forEach((i) => {
    if (i.valid_next_question == undefined || i.valid_next_question == false) {
      if ((i.value == true && i.next_questions.length > 0)) {
        i.next_questions.forEach((a, index) => {
          indexAct = indexAct + 1;
          allQuestion.splice(indexAct, 0, a);
          mapQuestions = [...mapQuestions, {
            option_id: i.id,
            question_id: a.id
          }]
        })
      }
    } else if (i.valid_next_question == true) { //fn next question different of true
      if ((i.value == i.valueBack || i.value == null) && i.next_questions.length > 0) {
        i.next_questions.forEach((a, index) => {
          indexAct = indexAct + 1;
          allQuestion.splice(indexAct, 0, a);
          mapQuestions = [...mapQuestions, {
            option_id: i.id,
            question_id: a.id
          }]
        })
      }
    }
  })
  return {
    allQuestion: allQuestion,
    mapQuestions: mapQuestions
  }
}

const addNextQuestion = (state, data) => {
  let objAddQuestion = null;

  //search in the current question in the copy 
  let compare = state.copy_pag_survey.filter((a) => {
    if (a.id == state.template[state.numPag].id) {
      return a;
    }
  })
  if (compare.length > 0) {
    // check difference to add a new question or delete a new question
    let diff = valuesChangedIdentifier(compare[0].question_options, state.pag_survey[0].question_options, "id")
    if (diff.length > 0) {
      //eliminate questions added
      cleanNextQuestion(data);
      //add new questions
      objAddQuestion = addQuestion(state);
      //actualize value copy state.template
      let key = null
      let compare = state.copy_pag_survey.filter((a, indice) => {
        if (a.id == state.template[state.numPag].id) {
          key = indice
          return a;
        }
      })
      let b = {
        ...state.copy_pag_survey[key],
        question_options: state.template[state.numPag].question_options
      }
      state.copy_pag_survey[key] = b

    }
  } else {
    //add into copy state.template
    let a = {
      ...state.template[state.numPag]
    }
    state.copy_pag_survey = [...state.copy_pag_survey, a];
    //add new questions
    objAddQuestion = addQuestion(state);
  }

  if (objAddQuestion != null) {
    let addArrNextQuestion = {
      question_id: state.pag_survey[0].id,
      questions: objAddQuestion.mapQuestions,
    }

    let copyNextQuestions = [...state.arrNextQuestions];

    // eliminate in arrNextQuestions the questions selected in the previous question
    if (state.arrNextQuestions.length > 0) {
      copyNextQuestions.forEach((i, index) => {
        if (i.question_id == state.pag_survey[0].id) {
          copyNextQuestions.splice(index, 1);
        }
      })
    }
    state.arrNextQuestions = [...copyNextQuestions]
    if (addArrNextQuestion.questions.length > 0) {
      state.arrNextQuestions = [...state.arrNextQuestions, addArrNextQuestion];
    }
    state.template = [...objAddQuestion.allQuestion];
    state.cantQuestion = state.template.length; // amount to calculate the progress bar
  }
}

const getOptionsDynamic = (type_option, type_question, data, client_section_data, columns) => {
  if (type_question == "form-dynamic-options" && data.length > 0) {
    if (client_section_data == "['relationships']") {
      let options_dynamic = [];
      options_dynamic = data.map((i) => {
        let name = null;
        let id = null;
        if (i.client_details[1] != undefined) {
          name = `${i.client_details[1].person_details[0].first_name} ${i.client_details[1].person_details[0].last_name}`
          id = i.client_details[1].person_details[0].id
        } else if (i.client_details[0] != undefined) {
          name = i.client_details[0].display_name;
          id = i.client_details[0].id;
        }
        if (name != null && id != null) {
          let obj_option = {};
          if ((type_option == "single-choice-checkbox" || type_option == "multiple-choice-checkbox")) {
            obj_option.key_name = "client_id"
            obj_option.validation = {};
          } else if ((type_option == "number")) {
            obj_option.key_name = `percentage-${id}`
            obj_option.validation = {
              //required: true,
              regex: /^([0-9]+(.{0,1})[0-9]*)$/
            };
          }
          obj_option.id = state.idOption;
          obj_option.option_text = name;
          obj_option.value = id;
          obj_option.value_type = "string";
          obj_option.attributes = {};
          obj_option.type = type_option;
          obj_option.next_questions = []
          return obj_option;
        }
      })
      return options_dynamic;
    } else if (client_section_data == "['Client_Banking_Info']") {
      let options_dynamic = data.map((i) => {
        let account = null;
        let id = null;
        if (i.description != null && i.description != undefined) {
          account = i.description;
        }
        if (i.id != null && i.id != undefined) {
          id = i.id;
        }
        if (account !== null && id != null) {
          let obj_option = {};
          obj_option.key_name = "account";
          obj_option.id = state.idOption;
          obj_option.option_text = account.charAt(0).toUpperCase() + account.slice(1);
          obj_option.value = id;
          obj_option.value_type = "string";
          obj_option.validation = {};
          obj_option.attributes = {};
          obj_option.type = type_option;
          obj_option.next_questions = [];
          return obj_option;
        }
      });
      return options_dynamic;
    }
  }
}

const recursiveArrnext = (nextquestions) => {
  nextquestions.forEach(element => {
    state.arrnext = [...state.arrnext, element.id]
    element.question_options.forEach((z) => {
      if (z.next_questions.length > 0) {
        recursiveArrnext(z.next_questions)
      }
    })
  });
}


const saveJsonResponses = (state) => {
  const question = {
    ...state.pag_survey[0]
  };
  const id_question = question.id;
  const columns = question.columns;
  const options = question.question_options;

  let responses = options.map((c) => {
    switch (c.type) {
      case "sort-input":
        return c.options;
        break;
      case "range-slider":
      case "amount":
      case "hidden":
      case "autocomplete":
      case "text":
      case "number":
      case "date":
      case "text-mask":
      case "address":
        let obj = {};
        obj.value = [{
          [c.key_name]: c.value
        }]
        obj.relationship = question.relationship;
        if (c.key_name.search("percentage") !== -1 && state.pag_survey[0].type == "form-dynamic-options") {
          const client_id = c.key_name.split("-")[1];
          const siglaRela = getInitialsRelationShip(question.client_section_data, client_id)
          obj.relationship = siglaRela;
          if (obj.value[0][c.key_name] == null) {
            obj.value[0][c.key_name] = 0;
          }
        }
        obj.name = c.option_text;
        return obj;
        break;
      case "dropdown":
        let obj1 = {};
        obj1.value = [{
          [c.key_name]: c.value
        }]
        obj1.relationship = question.relationship;
        obj1.name = c.option_text;
        return obj1;
        break;
      case "single-choice-checkbox":
      case "multiple-choice-checkbox":
        if (c.value === true) {
          let obj2 = {};
          obj2.relationship = question.relationship;
          /***** set relationship initials for dynamic options *****/
          if (question.is_dynamic && question.type == "form-dynamic-options") {
            const data_indice = question.client_section_data;
            if (data_indice == "['relationships']") {
              const relationship = getInitialsRelationShip(data_indice, c.valueBack);
              if (relationship !== null) {
                obj2.relationship = relationship;
              }
            }
          }
          obj2.value = [{
            [c.key_name]: c.valueBack
          }]
          obj2.name = c.option_text;
          return obj2;
        }
        break;
      case "simple-checkbox":
        if (c.value == true) {
          let obj9 = {};
          obj9.relationship = question.relationship;
          obj9.value = [{
            [c.key_name]: c.valueBack
          }]
          obj9.name = c.option_text;
          return obj9;
        }
        break;
    }
  })


  if (question.type !== "draw-form") {
    responses = responses.filter((a) => {
      if (a && a.hasOwnProperty("value")) {
        return a;
      }
    })
  }

  let setTemplate = [];
  if (typeof question.id == "string") {
    //question-dynamic-secundary
    const parent_responses = question.parent_responses;
    const id_dynamic = parseInt(id_question.split("-")[1]);
    const client_id = parseInt(question.id.split("-")[2]);
    let resp = [...responses, {
      "name": "client_id",
      "relationship": getInitialsRelationShip("['relationships']", client_id),
      "value": [{
        client_id: client_id
      }]
    }]
    const response_template = {
      id: id_question,
      responses: resp
    }
    setTemplate = state.copy_template.map((a) => {
      let questions = a.questions.map((b) => {
        if (b.id == id_dynamic) {
          let copy = {
            ...b
          };
          // eliminate unused options
          copy.responses.forEach((a, index) => {
            if (a.id == id_question) {
              copy.responses.splice(index, 1);
            }
          })
          const template_question = state.template.filter((a) => {
            if (a.id == question.parent_responses) {
              return a;
            }
          })
          let arrDelete = [];
          const responses_parent = template_question[0].question_options;
          responses_parent.forEach((a) => {
            if (a.value !== true) {
              arrDelete.push(`DYNAMIC-${id_dynamic}-${a.valueBack}`)
            }
          })
          copy.responses.forEach((a, index) => {
            if (arrDelete.indexOf(a.id) !== -1) {
              copy.responses.splice(index, 1);
            }
          })
          // add
          copy.responses = [...copy.responses, response_template];
          return copy;
        } else {
          let copy1 = {
            ...b,
          }
          let options = b.question_options;
          let newOptions = options.map((a) => {
            let copy2 = {
              ...a,
              next_questions: responseJsonDynamicSecunday(a.next_questions, id_dynamic, response_template, question)
            }
            return copy2;
          })
          copy1.question_options = newOptions;
          return copy1;
        }
      });
      let copy_tem = {
        ...a,
        questions: questions,
      }
      return copy_tem;
    });
  } else {
    setTemplate = state.copy_template.map((a) => {
      let questions = a.questions.map((b) => {
        if (b.id == id_question) {
          let copy = {
            ...b,
            responses: responses
          }
          return copy;
        } else {
          let copy1 = {
            ...b,
          }
          let options = b.question_options;
          let newOptions = options.map((a) => {
            let copy2 = {
              ...a,
              next_questions: responseJsonRecursive(a.next_questions, id_question, responses)
            }
            return copy2;
          })
          copy1.question_options = newOptions;
          return copy1;
        }
      })
      let copy_tem = {
        ...a,
        questions: questions,
      }
      return copy_tem;
    })
  }

  /***** clean values ​​of false options *****/
  let arr = [];
  state.arrnext = [];
  options.forEach((a) => {
    if ((a.value !== true && a.next_questions.length > 0) && a.type == "single-choice-checkbox" ||
      a.type == "multiple-choice-checkbox") {
      a.next_questions.forEach(element => {
        state.arrnext = [...state.arrnext, element.id]
        element.question_options.forEach((z) => {
          if (z.next_questions.length > 0) {
            recursiveArrnext(z.next_questions)
          }
        })
      });
    }
  })
  state.arrnext.forEach((q) => {
    setTemplate = setTemplate.map((a) => {
      let questions = a.questions.map((b) => {
        if (b.id == q) {
          let copy = {
            ...b,
            responses: []
          }
          return copy;
        } else {
          let copy1 = {
            ...b,
          }
          let options = b.question_options;
          let newOptions = options.map((a) => {
            let copy2 = {
              ...a,
              next_questions: recursiveCleanAswers(a.next_questions, q, [])
            }
            return copy2;
          })
          copy1.question_options = newOptions;
          return copy1;
        }
      })
      let copy_tem = {
        ...a,
        questions: questions,
      }
      return copy_tem;
    })
  })
  /************   ****************/

  if (setTemplate.length > 0) {
    Vue.set(state, 'copy_template', setTemplate)
  }

  /** save json by response  */
  api.saveResponses(state).then(function (value) {
    if (value.data.status == "success") {
      state.error = false;
      state.error_msj = ""
      nextPagina(state);
    }
  }).catch(function (e) {
    state.error = true;
    state.error_msj = "Error save Response"
    console.error(e);
    EventBus.$emit("set-submited", false);
  })

  if (responses.length > 0) {

    /****** Add Relationship *****/
    if (state.template[state.numPag].add_relationship !== undefined && state.template[state.numPag].add_relationship) {
      let rel = null;
      responses.forEach((a) => {
        a.value.forEach((b) => {
          if (Object.keys(b) == "relationship") {
            rel = b.relationship;
          }
        })
      })
      if (rel !== null) {
        responses.forEach((a) => {
          a.relationship = rel;
        })
        state.template[state.numPag].relationship = rel;
      }
    }
    Vue.set(state.template[state.numPag], 'responses', responses)
  }
}

const recursiveCleanAswers = (next_questions, id_question, responses) => {
  let next = next_questions.map((c) => {
    if (c.id == id_question) {
      let copy = {
        ...c,
        responses: responses
      }
      return copy;
    } else {
      let copy1 = {
        ...c,
      }
      let options = c.question_options;
      let newOptions = options.map((a) => {
        let copy2 = {
          ...a,
          next_questions: recursiveCleanAswers(a.next_questions, id_question, responses)
        }
        return copy2;
      })
      copy1.question_options = newOptions;
      return copy1;
    }
  })
  return next;
}

const responseJsonRecursive = (next_questions, id_question, responses) => {
  let next = next_questions.map((c) => {
    if (c.id == id_question) {
      let copy = {
        ...c,
        responses: responses
      }
      /****** Add Relationship *****/
      if (c.add_relationship !== undefined && c.add_relationship) {
        let rel = null;
        responses.forEach((a) => {
          a.value.forEach((b) => {
            if (Object.keys(b) == "relationship") {
              rel = b.relationship;
            }
          })
        })
        if (rel !== null) {
          copy.relationship = rel;
        }
      }
      return copy;
    } else {
      let copy1 = {
        ...c,
      }
      let options = c.question_options;
      let newOptions = options.map((a) => {
        let copy2 = {
          ...a,
          next_questions: responseJsonRecursive(a.next_questions, id_question, responses)
        }
        return copy2;
      })
      copy1.question_options = newOptions;
      return copy1;
    }
  })
  return next;
}

/****** question-dynamic-secundary ******/
const responseJsonDynamicSecunday = (next_questions, id_question, responses, dataQuestion) => {
  let next = next_questions.map((c) => {
    if (c.id == id_question) {
      let copy = {
        ...c
      };

      // eliminate unused options
      copy.responses.forEach((a, index) => {
        if (a.id == dataQuestion.id) {
          copy.responses.splice(index, 1);
        }
      })
      const template_question = state.template.filter((a) => {
        if (a.id == dataQuestion.parent_responses) {
          return a;
        }
      })
      let arrDelete = [];
      const responses_parent = template_question[0].question_options;
      responses_parent.forEach((a) => {
        if (a.value !== true) {
          arrDelete.push(`DYNAMIC-${id_question}-${a.valueBack}`)
        }
      })
      copy.responses.forEach((a, index) => {
        if (arrDelete.indexOf(a.id) !== -1) {
          copy.responses.splice(index, 1);
        }
      })
      //add
      copy.responses = [...copy.responses, responses];
      return copy;
    } else {
      let copy1 = {
        ...c,
      }
      let options = c.question_options;
      let newOptions = options.map((a) => {
        let copy2 = {
          ...a,
          next_questions: responseJsonDynamicSecunday(a.next_questions, id_question, responses, dataQuestion)
        }
        return copy2;
      })
      copy1.question_options = newOptions;
      return copy1;
    }
  })
  return next;
}


const recurNextQuestion = (state, data, parent, dataSection) => {
  let questionRecursive = data.map((d) => {
    if (d.is_dynamic && d.type == "form-dynamic-options") {
      const data_dynamic = filterValueClient(d.client_section_data);
      const options_dynamic = getOptionsDynamic(d.dynamic_option_types, d.type, data_dynamic, d.client_section_data, d.columns)
      if (options_dynamic !== undefined) {
        let a = {
          ...d,
          question_options: [...d.question_options, ...options_dynamic]
        }
        d = a;
      }
    }
    let optionRecursive = d.question_options.map((x) => {
      state.idOption++;
      let b = {
        ...x,
        id: state.idOption,
        valueSource: null,
        valueBack: x.value,
        value: preloadOption(d.id, d.type, d.responses, x.type, x.key_name, x.option_text, x.value),
        next_questions: recurNextQuestion(state, x.next_questions, d.id, dataSection)
      }
      return b;
    })
    let a = {
      ...d,
      section: dataSection,
      parentid: parent,
      question_options: optionRecursive
    }
    return a;
  });
  return questionRecursive;
}

const preloadOption = (id, questionType, responses, optionType, keyName, optionTex, optionValue) => {
  let value = null;
  if (questionType !== "question-dynamic-secundary") {
    switch (optionType) {
      case "hidden":
        value = optionValue;
        break;
      case "range-slider":
      case "amount":
      case "autocomplete":
      case "text":
      case "num":
      case "date":
      case "number":
      case "text-mask":
      case "address":
      case "dropdown":
        const respText = responses.map((a) => {
          a.value.map((c) => {
            if (Object.keys(c)[0] == keyName) {
              value = c[keyName];
            }
          })
        })
        break;
      case "simple-checkbox":
        const respSimCheck = responses.map((a) => {
          a.value.map((c) => {
            if ((Object.keys(c)[0] == keyName && Object.values(c)[0] == optionValue) ||
              Object.keys(c)[0] == keyName && Object.values(c)[0] == "true"
            ) {
              value = true;
            }
          })
        });
        break;
      case "single-choice-checkbox":
      case "multiple-choice-checkbox":
        responses.map((a) => {
          a.value.map((c) => {
            if (optionValue === c[Object.keys(c)[0]] && Object.keys(c)[0] == keyName) {
              value = true;
            }
          })
        });
        break;
    }
  }
  return value;
}

const createTemplate = async (state, data) => {
  const resp = await api.createNewJson(data).then(response => {
    if (response.status == 200) {
      return getTemplate(state, data);
    }
  }).catch(error => {
    console.error(error.response.data);
  })
  return resp;
}


const getTemplate = async (state, data) => {
  const resp = await api.getDataNewJson(data).then(value => {
    return new Promise(resolve => {
      resolve(value.data.payload)
    })
  }).then(function (value) {
    return value;
  }).catch(error => {
    if (error.response) {
      const error_txt = error.response.data.declaration;
      if (error_txt == "data_not_found") {
        return createTemplate(state, data)
      } else {
        console.error(error.response.data);
      }
    }
  })
  return resp;
}

const actions = {
  setOptionsDrag({
    commit
  }, data) {
    commit('SET_OPTIONS_DRAG', data)
  },
  addTag({
    commit
  }, data) {
    commit('ADD_TAG', data)
  },
  setSingleChoice({
    commit
  }, data) {
    commit('SET_SINGLE_CHOICE', data)
  },
  setError({
    commit
  }, data) {
    commit('SET_ERROR', data)
  },
  initSurvey({
    commit
  }) {
    commit('INIT_SURVEY')
  },
  setFormTemplate({
    commit
  }, data) {
    const resp = getTemplate(state, data).then(value => {
      commit('SET_DATA_TEMPLATE', {
        data: value,
        payload: data
      })
    });
  },
  nextQuestionSingle({
    commit
  }, data) {
    commit('NEXT_QUESTION_SINGLE', data)
  },
  goPrevPag: ({
    commit
  }) => commit('GO_PREV_SECTION'),
  setShowError: ({
    commit
  }) => commit('SET_SHOW_ERROR'),
  nextQuestion: ({
    commit
  }) => commit('NEXT_QUESTION'),
  nextQuestionMultiple: ({
    commit
  }, data) => commit('NEXT_QUESTION_MULTIPLE', data),
  setPagSurvey: ({
    commit
  }, data) => commit('SET_PAG_SURVEY', data),
}

const mutations = {
  SET_OPTIONS_DRAG(state, data) {
    const option = state.pag_survey[0].question_options[0];
    option.options = data;
  },
  ADD_TAG(state, data) {
    if (state.variablesTag.length > 0) {
      state.variablesTag.forEach((a, index) => {
        if (data.tag == a.tag) {
          state.variablesTag.splice(index, 1);
        }
      })
    }
    state.variablesTag.push(data)
  },
  SET_SINGLE_CHOICE(state, data) {
    let copy = {
      ...state.pag_survey[0]
    }
    const options = copy.question_options.map((a) => {
      let c = {
        ...a
      }
      if (a.valueBack == data.val) {
        c.value = data.value;
      }
      return c;
    })
    state.pag_survey[0].question_options = options;
  },
  SET_ERROR(state, data) {
    state.error_msj = data.msj;
    state.error = data.status;
  },
  INIT_SURVEY(state) {
    state.cantQuestion = 0;
    state.progressQuestion = 0;
    state.numPag = 0;
    state.template = null;
    state.clienData = null;
    state.survey_id = null,
      state.form_id = null;
    state.pag_survey = null;
    state.arrNextQuestions = [];
    state.idOption = 0;
    state.sectionName = null;
    state.copy_pag_survey = [];
    state.arrQuestDynamicSecon = [];
  },

  SET_DATA_TEMPLATE(state, data) {
    let arr = []
    state.participant_id = data.payload.participant_id;
    state.participant_token = data.payload.participant_token
    state.form_id = data.payload.form_id;
    state.survey_id = data.payload.survey_id;
    state.access_code = data.payload.access_code;
    state.clienData = data.data.clientInfo;
    const json_sections = [...data.data.form_template.sections];
    state.copy_template = [...data.data.form_template.sections];
    let sections = json_sections.map((z) => {
      let dataSection = {
        section_text: z.section_text,
        description: z.description
      }
      let questions = z.questions
      let question = questions.map((c) => {
        if (c.is_dynamic && c.type == "form-dynamic-options") {
          const data_dynamic = filterValueClient(c.client_section_data);
          const options_dynamic = getOptionsDynamic(c.dynamic_option_types, c.type, data_dynamic, c.client_section_data, c.columns)
          if (options_dynamic !== undefined) {
            let a = {
              ...c,
              question_options: [...c.question_options, ...options_dynamic]
            }
            c = a;
          }
        }
        let options = c.question_options;
        let option = options.map((a) => {
          state.idOption++;
          let newOption = {
            ...a,
            id: state.idOption,
            valueSource: null,
            valueBack: a.value,
            value: preloadOption(c.id, c.type, c.responses, a.type, a.key_name, a.option_text, a.value),
            next_questions: recurNextQuestion(state, a.next_questions, c.id, dataSection)
          }
          if (a.type == "sort-input") {
            newOption.options = c.responses[0];
          }
          return newOption;
        })
        let newQuestion = {
          ...c,
          question_options: option,
          section: dataSection,
          parentid: null
        }
        return newQuestion;
      })
      arr.push(...question)
    });
    state.numPag = 0;
    state.cantQuestion = arr.length;
    state.progressQuestion = state.numPag + 1
    state.template = arr;
    state.pag_survey = arr.filter((i, key) => {
      if (state.numPag == key)
        return i;
    })
    state.sectionName = state.pag_survey[0].section.section_text;
    state.loaded = true;
  },

  GO_PREV_SECTION(state) {
    state.error = false;
    state.error_msj = "";
    state.numPag = state.numPag - 1;
    if (state.numPag == -1) {
      state.numPag = 0;
    }
    state.sectionName = null;
    state.pag_survey = state.template.filter((i, key) => {
      if (state.numPag == key) {
        state.sectionName = i.section.section_text;
        return i;
      }
    })
  },

  NEXT_QUESTION(state) {
    if (state.copy_pag_survey.hasOwnProperty(state.numPag)) {
      // update value to compare
      let key = null
      let compare = state.copy_pag_survey.filter((a, indice) => {
        if (a.id == state.template[state.numPag].id) {
          key = indice
          return a;
        }
      })
      let b = {
        ...state.copy_pag_survey[key],
        question_options: state.template[state.numPag].question_options
      }
      state.copy_pag_survey[key] = b

    } else {
      let a = {
        ...state.template[state.numPag]
      }
      state.copy_pag_survey = [...state.copy_pag_survey, a];
    }

    /**** next page *****/
    nextQuestionForm(state);
  },

  async NEXT_QUESTION_MULTIPLE(state) {
    let data = state.pag_survey[0].question_options.map((a) => {
      let obj = {};
      obj.id = a.id;
      obj.name = a.option_text;
      if (a.value === true) {
        obj.value = true;
      } else {
        obj.value = a.valueBack;
      }
      return obj;
    })
    let test = 0;
    /******************** question-dynamic-secundary ***********************/
    await cleanAddQuestionSecundary(state);
    if (state.pag_survey[0].is_add_question_secundary !== undefined && state.pag_survey[0].is_add_question_secundary === true) {
      const validTemplateDyn = state.arrQuestDynamicSecon.filter((i) => {
        if (i.id == state.pag_survey[0].id) {
          return i;
        }
      })
      if (validTemplateDyn.length > 0) {
        test = 1;
        // delete and add questions replicated in the template
        await adjustTemplateQuestionDynamicSecundary(state, validTemplateDyn)
      } else {
        // create the questions for the first time
        await createTemplateQuestionDynamicSecundary(state);
      }
    }
    /********************  ***********************/

    /***** add and remove Question *****/
    await addNextQuestion(state, data);

    /******** Next Question ********/
    await nextQuestionForm(state);
  },

  async NEXT_QUESTION_SINGLE(state, data) {
    let copy_set = [...state.pag_survey[0].question_options]
    data.forEach((i) => {
      copy_set.forEach((element, index) => {
        if (element.option_text === i.name) {
          copy_set[index] = {
            ...copy_set[index],
            value: i.value
          };
        } else {
          copy_set[index] = {
            ...copy_set[index],
            value: element.valueBack
          }
        }
      })
    })
    state.pag_survey[0].question_options = [...copy_set]

    /***** add and remove Question *****/
    await addNextQuestion(state, data);

    /******** Next Question ********/
    await nextQuestionForm(state);
  },

  SET_PAG_SURVEY(state, data) {
    const copy_options = [...state.pag_survey[0].question_options]
    data.forEach((i) => {
      copy_options.forEach((element, index) => {
        if (element.option_text === i.name) {
          if (i.value != null) {
            copy_options[index] = {
              ...copy_options[index],
              value: i.value
            };
          }
          if (i.source != null) {
            copy_options[index] = {
              ...copy_options[index],
              valueSource: i.source
            };
          }
        }
      })
    })
    state.pag_survey[0].question_options = [...copy_options];
  }
}

const getters = {
  getPagAct: state => (state.pag_survey) ? state.pag_survey[0] : null,
  getNumPag: state => state.numPag,
  getInputSource: state => state.inputSource,
  getSectionName: state => state.sectionName,
  getvariablesTag: state => state.variablesTag,
  getProgress: state => {
    return {
      progress: state.numPag,
      "cant": state.cantQuestion
    }
  }
  //getResponseData: state => state.pag_survey[0].responses,
}

export default {
  state,
  mutations,
  actions,
  getters
}
