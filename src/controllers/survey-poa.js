import api from '@/controllers/survey'
import EventBus from "../bus";
var functions = require("../controllers/question-list");
import surveyStore from '@/controllers/survey-store'
import templatePoa from '../components/poa.json';

export default {
  preloadQuestionsPoa(state, question) {
    let list_poa = question.responses.map((a) => {
      return a.filter((c) => {
        if (Object.keys(c.value[0]) == "client_id") {
          return c;
        }
      }).map((d) => {
        return `${question.id}_${d.value[0].client_id}`
      })[0]
    })
    state.list_poa = list_poa;
  },
  createTemplatePoa(state) {
    const options = state.pag_survey[0].question_options;
    const template = [
      ...templatePoa
    ];
    const type_option = state.pag_survey[0].dynamic_option_types;
    let question_id = state.pag_survey[0].id;
    let newQuestions = [];
    let list_relations = options.filter((a) => {
      if (a.type == type_option && a.value === true) {
        return a;
      }
    })
    let list_selected = [];
    template.forEach((c) => {
      options.filter((a) => {
        if (a.type == type_option && a.value === true) {
          return a;
        }
      }).forEach((e) => {
        list_selected.push(`${c.id}_${e.valueBack}`)
      })
    })
    if (state.list_poa.length > 0) {
      //remove questions 
      let remover = [];
      template.forEach((c) => {
        options.filter((a) => {
          if (a.type == type_option && a.value !== true) {
            return a;
          }
        }).forEach((e) => {
          remover.push(`${c.id}_${e.valueBack}`)
        })
      })
      state.cantQuestion = state.cantQuestion - remover.length;
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
      // add options that are not in list_poa
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
      let listReladd = agregar.map((e) => {
        let id = e.split('_');
        id = id[1];
        return id;
      }).filter((valor, indice, self) => {
        return self.indexOf(valor) === indice;
      });
      listReladd = list_relations.filter((a) => {
        if (listReladd.indexOf(a.id.toString()) !== -1) {
          return a;
        }
      })
      this.addQuestionsPoa(state, template, listReladd, question_id)
    } else {
      state.list_poa = list_selected;
      this.addQuestionsPoa(state, template, list_relations, question_id)
    }
  },

  addQuestionsPoa(state, template, list_relations, question_id) {
    let count = 0;
    let index_act = null;
    let questions_add = [];
    let copy_question = [...state.template];
    const cantQuestion = template.length;
    let template_arr = [];
    list_relations.map((a) => {
      let client_id = a.valueBack;
      let client_name = a.option_text;
      let question_template = template.map((b) => {
        let c = {
          ...b
        };
        const data_rel = state.clienData.relationships.filter((a) => {
          if (a.client_details[0].id == client_id) {
            return a;
          }
        }).map((a) => {
          let c = {};
          c.preferred_number = a.client_details[0].preferred_number
          c.email = a.client_details[0].email
          c.mobile_number = a.client_details[0].mobile_number
          c.office_number = a.client_details[0].office_number
          c.home_number = a.client_details[0].home_number
          return c;
        })
        if (c.type == "static-form") {
          // preload data relationship selected
          c.question_options = b.question_options.map((z) => {
            let a = {
              ...z
            };
            if (a.key_name == "client_id" && a.type == "hidden") {
              a.value = client_id;
            } else {
              if (data_rel.length > 0) {
                if (a.key_name == "preferred_number"){
                  if (a.value == data_rel[0].preferred_number){
                    if (a.value == "H" && data_rel[0].home_number !== "" && data_rel[0].home_number !== null){
                      a.value = true;
                    } else if (a.value == "O" && data_rel[0].office_number !== "" && data_rel[0].office_number !== null) {
                      a.value = true;
                    } else if (a.value == "M" && data_rel[0].mobile_number !== "" && data_rel[0].mobile_number !== null) {
                       a.value = true;
                    }
                  }
                }else{
                  a.value = data_rel[0][a.key_name];
                }
              }
            }
            a.valueBack = z.value;
            return a;
          })
        } else {
          c.question_options = b.question_options.map((z) => {
            let a = {
              ...z
            };
            if (a.key_name == "client_id" && a.type == "hidden") {
              a.value = client_id;
            }
            a.valueBack = z.value;
            return a;
          })
        }
        c.id = `${c.id}_${client_id}`;
        c.client_id = client_id;
        c.relationship = surveyStore.getInitialsRelationShip(state, "['relationships']", client_id)
        let relationship = state.clienData.relationships.filter((a) => {
          if (a.client_details[0].id == client_id) {
            return a;
          }
        }).map((c) => {
          return c.relationship;
        })
        c.question_text = c.question_text.replace("{{RELATIONSHIP}}", client_name);
        return c;
      }).map((z) => {
        copy_question.forEach((a, index) => {
          if (a.id == question_id) {
            count++;
            index_act = index;
            questions_add.push(z);
            copy_question.splice(index + count, 0, z);
          }
        });
      })
      state.template = copy_question;
    });
    state.cantQuestion = state.cantQuestion + (list_relations.length) * cantQuestion;
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

  removeQuestionsPoa(state) {
    const validRemove = state.pag_survey[0].question_options.filter((a) => {
      if (a.value == true && a.valueBack === "false") {
        return a;
      }
    })
    if (validRemove.length > 0) {
      // remove questions that are in survey-engine 
      let copy_survey = [...state.copy_template];
      copy_survey.forEach((a) => {
        a.questions.forEach((c, index) => {
          let d = {
            ...c
          };
          if (c.is_poa !== undefined && c.is_poa == true) {
            a.questions.splice(index, 1);
          }
        })
      });
      state.copy_template = copy_survey;
    }
  }
}
