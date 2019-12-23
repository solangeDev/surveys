import api from '@/controllers/survey'
import EventBus from "../bus";
var functions = require("../controllers/question-list");

export default {

  updateDataStatusMarital(state) {
    const status = ["married", "common-law"];
    const optionValue = state.pag_survey[0].question_options.filter(z => {
      if (z.value === true) {
        return z;
      }
    });
    const valid = state.pag_survey[0].question_options.filter(z => {
      if (status.indexOf(z.valueBack) === -1 && z.value === true) {
        return z;
      }
    });
    if (optionValue.length > 0 && optionValue[0].valueBack == "married") {
      state.marital_acronym = "SP";
    } else {
      state.marital_acronym = "CL";
    }
    if (valid.length > 0) {
      this.removeItemRelationship(state);
    }
  },

  removeItemRelationship(state) {
    let copy_template = [...state.template];
    let data = state.data_spouse;
    if (data !== null) {
      let client_id = data.client_id;
      state.template = copy_template.map((c) => {
        let d = {
          ...c
        };
        d.question_options = d.question_options.map((d) => {
          let c = {
            ...d
          };
          return c;
        })
        if (c.update_list_relationship !== undefined && c.update_list_relationship === true) {
          d.question_options = d.question_options.filter((c) => {
            if (c.valueBack !== client_id) {
              return c;
            }
          })
        }
        return d;
      })
      state.data_spouse = null;
    }
  },

  loadDataSpouse(state, response, firm) {
    let b = {};
    b.relationship = "SP"
    b.firm_id = firm;
    b.first_name = response.filter((a) => {
      let resp2 = null;
      a.value.forEach((a) => {
        if (a.first_name !== undefined && a.first_name !== null != a.first_name !== "") {
          resp2 = a.first_name;
        }
      })
      if (resp2 !== null) {
        return a;
      }
    }).map((d) => {
      return d.value[0].first_name;
    })[0];
    b.last_name = response.filter((a) => {
      let resp2 = null;
      a.value.forEach((a) => {
        if (a.last_name !== undefined && a.last_name !== null != a.last_name !== "") {
          resp2 = a.last_name;
        }
      })
      if (resp2 !== null) {
        return a;
      }
    }).map((d) => {
      return d.value[0].last_name;
    })[0];
    b.client_id = functions.encrypMd5(`${b.first_name}${b.last_name}_spouse`);
    state.data_spouse = b;
  },

  preloadQuestionsInsiders(state, question) {
    let list_insiders = question.responses.map((a) => {
      return a.filter((c) => {
        if (Object.keys(c.value[0]) == "client_id") {
          return c;
        }
      }).map((d) => {
        return `${question.id}_${d.value[0].client_id}`
      })[0]
    })
    state.list_insider = list_insiders;
  },

  addQuestionsInsiders(state, template, list_relations, question_id) {
    let count = 0;
    let index_act = null;
    let questions_add = [];
    list_relations.map((a) => {
      let client_id = a.valueBack;
      let client_name = a.option_text;
      let question_template = {
        ...template
      };
      question_template.question_options = template.question_options.map((a) => {
        let b = {
          ...a
        };
        if (b.key_name == "client_id" && b.type == "hidden") {
          b.value = client_id;
        }
        return b;
      });
      question_template.id = `${state.pag_survey[0].id}_${client_id}`;
      let relationship = state.clienData.relationships.filter((a) => {
        if (a.client_details[0].id == client_id) {
          return a;
        }
      }).map((c) => {
        return c.relationship;
      })
      question_template.relationship = (relationship.length > 0) ? relationship[0] : "";
      question_template.client_id = client_id;
      question_template.question_text = question_template.question_text.replace("{{RELATIONSHIP}}", client_name);
      // add to the copy for the survey-engine
      let copy_question = [...state.template];
      copy_question.forEach((a, index) => {
        if (a.id == question_id) {
          count++;
          index_act = index;
          questions_add.push(question_template);
          copy_question.splice(index + count, 0, question_template);
        }
      })
      state.template = copy_question;
    });
    state.cantQuestion = state.cantQuestion + list_relations.length;
    // added in the template grouped by sections of the survey-engine
    let copy_survey = [...state.copy_template];
    let secc = copy_survey.filter((a) => {
      if (a.section_text == state.pag_survey[0].section.section_text) {
        return a;
      }
    })
    let count_tem = 0;
    questions_add.forEach(element => {
      secc[0].questions.map((a, index) => {
        if (a.id == question_id) {
          count_tem++;
          secc[0].questions.splice(index + count_tem, 0, element);
        }
      })
    });
    copy_survey.map((a) => {
      let b = a;
      if (secc[0].section_text == a.section_text) {
        b.questions = secc[0].questions;
      }
      return b;
    })
    state.copy_template = copy_survey;
  },

  createTemplateInsider(state, template) {
    //let list_selected = [];
    const options = state.pag_survey[0].question_options;
    const type_option = state.pag_survey[0].dynamic_option_types;
    let question_id = state.pag_survey[0].id;
    let newQuestions = [];
    let list_relations = options.filter((a) => {
      if (a.type == type_option && a.value === true) {
        return a;
      }
    })
    let list_selected = list_relations.map((a) => {
      return `${state.pag_survey[0].id}_${a.valueBack}`;
    })

    if (state.list_insider.length > 0) {
      // remove the questions that are not in list_insider
      // remove template 
      let remover = options.filter((a) => {
        if (a.type == type_option && (a.value === a.valueBack || a.value == null)) {
          return a;
        }
      }).map((c) => {
        return `${state.pag_survey[0].id}_${c.valueBack}`
      })

      let subCantQ = 0;
      let copy = [...state.template];
      remover.forEach((a) => {
        copy.forEach((b, index) => {
          if (a === b.id) {
            copy.splice(index, 1);
            subCantQ++;
          }
        })
      })
      state.template = copy;

      // removed in the template grouped by sections of the survey-engine
      let copy_survey = [...state.copy_template];
      let secc = copy_survey.filter((a) => {
        if (a.section_text == state.pag_survey[0].section.section_text) {
          return a;
        }
      })
      remover.forEach(element => {
        secc[0].questions.map((a, index) => {
          if (a.id == element) {
            secc[0].questions.splice(index, 1);
          }
        })
      });
      copy_survey.map((a) => {
        let b = a;
        if (secc[0].section_text == a.section_text) {
          b.questions = secc[0].questions;
        }
        return b;
      })
      state.copy_template = copy_survey;

      /******** ********/

      // add options that are not in list_insider
      let ids_questions = [];
      state.template.forEach((c) => {
        ids_questions.push(c.id)
      });
      let agregar = [];
      list_selected.forEach((a) => {
        if (ids_questions.indexOf(a) === -1) {
          agregar.push(a);
        }
      })
      agregar = agregar.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
      let listReladd = agregar.map((a) => {
        let data = options.filter((b) => {
          let id = a.split('_');
          id = id[1];
          if (b.valueBack == id) {
            return b;
          }
        });
        return data[0];
      })
      this.addQuestionsInsiders(state, template, listReladd, question_id)
    } else {
      state.list_insider = list_selected;
      this.addQuestionsInsiders(state, template, list_relations, question_id)
    }
  },

  removeQuestionsInsiders(state, type) {
    let options = state.pag_survey[0].question_options;
    let removeInsiders = [];

    switch (state.pag_survey[0].type_insider) {
      case "question_a":
        removeInsiders = options.filter((a) => {
          if (a.key_name == "someone_else_is_regulated" && a.value !== true) {
            return a;
          }
        })
        break;
      case "question_b":
        removeInsiders = options.filter((a) => {
          if (a.key_name == "question_28" && (a.value == "false" || a.value == null || a.value == "")) {
            return a;
          }
        })
        break;
    }
    if (removeInsiders.length > 0) {
      // remove questions that are in survey-engine 
      let copy_survey_2 = [...state.copy_template];
      copy_survey_2.forEach((a) => {
        a.questions.forEach((c, index) => {
          let d = {
            ...c
          };
          if (c.is_insider !== undefined && c.is_insider == true) {
            a.questions.splice(index, 1);
          }
        })
      });
      state.copy_template = copy_survey_2;
    }
  },

  setResponseAddRelationship(state, set_data_response, oper, responses) {
    let newResponses = responses;
    switch (set_data_response) {
      case "modal_add_relationship":
        switch (oper) {
          case "load":
            let listrelationship = [];
            let typeCta = [];
            responses.forEach((a) => {
              if (Array.isArray(a)) {
                a.filter((c) => {
                  if (Object.keys(c.value[0])[0] === "client_id") {
                    listrelationship.push(c)
                  } else {
                    typeCta.push(c);
                  }
                })
              } else {
                typeCta.push(a);
              }
            })
            typeCta = typeCta[0];
            listrelationship.push(typeCta)
            newResponses = listrelationship;
            break;
          case "save":
            let type_cta = responses.filter((a) => {
              if (Object.keys(a.value[0])[0] !== "client_id") {
                return a;
              }
            })
            let relationships = responses.filter((a) => {
              if (Object.keys(a.value[0])[0] === "client_id") {
                return a;
              }
            });
            let list_inputs = [];
            let resp = relationships.map((a) => {
              let b = {
                ...a
              }
              let arr = [];
              if (type_cta.length > 0) {
                let list_inputs = type_cta.map((c) => {
                  let z = {
                    ...c
                  };
                  z.relationship = b.relationship
                  return z;
                }).forEach((a) => {
                  arr.push(a);
                })
                arr.push(b);
              }
              return arr;
            })
            return resp;
            break;
        }
        break;
    }
    return newResponses;
  }
}
