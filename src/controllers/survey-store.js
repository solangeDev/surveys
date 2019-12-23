import api from '@/controllers/survey'
import addRelationship from '@/controllers/survey-add-relationship'
import fnPoa from '@/controllers/survey-poa'
import EventBus from "../bus";
import env from "@/env";

export default {

  async getDataDropdown(state, endpoint) {
    let payload = {};
    payload.access_code = state.survey.access_code;
    payload.participant_token = state.survey.participant_token;
    payload.method = endpoint.method;
    payload.source = `${env.endpoint}/${endpoint.source}`;
    payload.firm = state.login.firm;

    return await api
      .getDataDropdown(payload)
      .then(value => {
        return new Promise(resolve => {
          const data = value.data[endpoint.data];
          let resp = data.map(a => {
            let b = {};
            b.id = a.id;
            b.text = a[endpoint.indice];
            b.value = a.id;
            return b;
          });
          resolve(resp);
        });
      })
  },

  async updateListRelationships(state, data, option_detail) {
    return await new Promise(resolve => {
      let obj_option = {
        attributes: {},
        key_name: "client_id",
        value_type: "string",
        valueSource: null,
        value: null,
        validation: {},
        id: null,
      }
      const add_tags = state.pag_survey[0].add_relationship;
      const question_pep = state.pag_survey[0].question_pep;
      if (add_tags !== undefined && add_tags.length > 0) {
        obj_option.tag = add_tags.filter((a) => {
          if (a.value_key !== undefined) {
            return a;
          }
        }).map((z) => {
          let b = {};
          b.tag = z.key;
          b.value = z.value_key;
          return b;
        })
      }
      if (question_pep !== undefined && question_pep === true) {
        obj_option.relationship_pep = true;
      }
      let copy_option = {
        ...obj_option
      };

      if (data.length > 0) {
        copy_option.option_text = data[0].client_details[0].display_name;
        copy_option.id = data[0].client_details[0].id;
        copy_option.valueBack = data[0].client_details[0].id;
      } else {
        copy_option.option_text = option_detail.first_name + ' ' + option_detail.last_name;
        copy_option.id = option_detail.client_id;
        copy_option.valueBack = option_detail.client_id;
      }
      copy_option.type = (state.pag_survey[0].dynamic_option_types === undefined || state.pag_survey[0].dynamic_option_types == "") ? "multiple-choice-checkbox" : state.pag_survey[0].dynamic_option_types;
      state.status_request = true;
      // update template
      if (state.pag_survey[0].update_relationship === true) {

        let copy_template = [...state.template];
        let copy = [...state.pag_survey[0].question_options, copy_option]
        if (state.pag_survey[0].update_list_relationship !== undefined) {
          state.pag_survey[0].question_options = copy;
        }

        if (state.pag_survey[0].update_questions.length > 0) {
          state.pag_survey[0].update_questions.forEach((c) => {
            let template = copy_template.map((a) => {
              let b = a;
              if (c.id_question == b.id) {

                let option_update = {
                  ...copy_option
                }

                //add checked option with match in responses
                //partner added for survey
                if (a.responses.length > 0) {
                  let format = addRelationship.setResponseAddRelationship(state, a.set_data_response, "load", a.responses)
                  if (format.length > 0) {
                    let listClients = format.map((z) => {
                      return z.value.filter((t) => {
                        if (Object.keys(t).indexOf("client_id") !== -1) {
                          return t;
                        }
                      }).map((x) => {
                        if (x.client_id !== undefined) {
                          return x.client_id;
                        }
                      })[0]
                    }).filter((a) => {
                      if (a !== undefined) {
                        return a;
                      }
                    })

                    if (listClients.length > 0) {
                      if (listClients.indexOf(copy_option.id) !== -1) {
                        option_update.value = true;
                      }
                    }
                  }
                }

                if (c.section_pep != undefined && c.section_pep === true) {
                  option_update.relationship_pep = true
                  option_update.tag = [{
                    "key": "{{add_relationship_pep}}",
                    "value": true
                  }];
                }
                option_update.type = c.option;
                option_update.key_name = "client_id";
                let new_options = [...a.question_options, option_update];
                b.question_options = new_options;
              }
              return b;
            })
            state.template = template;
          })
        }
      }
      resolve(true);
    });
  },

  cleanResponsesRules(state, options, id_question, responses) {
    let arrQuestions = []
    let templateQuestionDel = [];
    const questionsDel = options.filter((c) => {
      if (c.reset_responses !== undefined) {
        if (c.type == "single-choice-checkbox" && c.value === true) {
          return c;
        } else if (c.type != "single-choice-checkbox") {
          return c;
        }
      }
    })
    if (questionsDel.length > 0) {
      questionsDel.forEach((c) => {
        if (c.reset_responses !== undefined) {
          c.reset_responses.forEach((a) => {
            let val_response = c.value;
            if (typeof val_response == "boolean") {
              val_response = val_response.toString();
              if (c.type == "single-choice-checkbox" && c.value === true) {
                val_response = c.valueBack.toString();
              }
            }
            if (a.and !== undefined) {
              const operator = a.operator !== undefined ? a.operator : "===";
              const value_and = a.and[0];
              let question_or = state.template.filter((a) => {
                if (a.id == value_and.id) {
                  return a;
                }
              }).map((b) => {
                const options = b.question_options.filter((c) => {
                  if (c.key_name === value_and.key_name) {
                    return c;
                  }
                })
                let c = {};
                c.key_name = value_and.key_name;
                c.value = options[0].value;
                c.operator = value_and.operator !== undefined ? value_and.operator : "===";
                return c;
              })
              if ((val_response + question_or[0].operator + question_or[0].value) && (val_response === a.value)) {
                a.questions.forEach((z) => {
                  arrQuestions.push(z);
                })
              }
            } else {
              const operator = a.operator !== undefined ? a.operator : "===";
              val_response = (typeof val_response == "string") ? new String(val_response) : val_response;
              a.value = (typeof a.value == "string") ? new String(a.value) : a.value;
              if (val_response + operator + a.value) {
                a.questions.forEach((z) => {
                  arrQuestions.push(z);
                })
              }
            }
          })
        }
      });
      templateQuestionDel = state.copy_template.map((a) => {
        let questions = a.questions.map((b) => {
          if (arrQuestions.indexOf(b.id) !== -1) {
            let copy = {
              ...b,
              responses: []
            }
            return copy;
          } else {
            let copy1 = {
              ...b,
            }
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
    if (templateQuestionDel.length > 0) {
      templateQuestionDel = templateQuestionDel.map((a) => {
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
    return templateQuestionDel;
  },

  // validate if an option is not shown, place it in false
  validOption(state, c) {
    let valid = true;
    if (c.dependencies !== undefined) {
      const dependencies = c.dependencies;
      dependencies.forEach(a => {
        state.variablesTag.forEach(d => {
          let val_dep = Object.keys(a);
          if (d.tag !== undefined) {
            if (d.tag.search(val_dep[0]) !== -1) {
              if (a[val_dep].indexOf(d.value) == -1) {
                valid = false;
              }
            }
          }
        });
      });
    }
    return valid;
  },

  cleanResponses(state, pag_actual) {
    const data = {};
    data.access_code = state.access_code;
    data.form_id = state.form_id;
    data.survey_id = state.survey_id;
    data.participant_token = state.participant_token;
    data.participant_id = state.participant_id;
    let setTemplate = state.copy_template.map((a) => {
      let questions = a.questions.map((b) => {
        if (b.id == pag_actual[0].id) {
          let copy = {
            ...b,
            responses: []
          }
          return copy;
        } else {
          let copy1 = {
            ...b,
          }
          return copy1;
        }
      })
      let copy_tem = {
        ...a,
        questions: questions,
      }
      return copy_tem;
    })
    if (setTemplate.length > 0) {
      state.copy_template = setTemplate;
    }
    api.saveResponses(state).then(function (value) {
      if (value.data.status == "success") {
        state.error = false;
        state.error_msj = ""
      }
    }).catch(function (e) {
      state.error = true;
      state.error_msj = "Error save Response"
      console.error(e);
      EventBus.$emit("set-submited", false);
    })
  },

  preloadOption(id, questionType, responses, optionType, keyName, optionTex, optionValue) {
    let value = null;
    if (questionType !== "question-dynamic-secundary") {
      switch (optionType) {
        case "hidden":
          value = optionValue;
          if (responses.length > 0) {
            responses.map((a) => {
              a.value.map((c) => {
                if (Object.keys(c)[0] == keyName) {
                  value = c[keyName];
                }
              })
            });
          }
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
        case "porcentaje":
        case "button_bool":
          if (Array.isArray(responses)) {
            const respText = responses.map((a) => {
              a.value.map((c) => {
                if (Object.keys(c)[0] == keyName) {
                  value = c[keyName];
                }
              })
            })
          }
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
  },

  preloadDatahub(state, question, option, value) {
    let val_response = [];
    switch (option.type) {
      case "autocomplete":
      case "text":
      case "hidden":
      case "number":
      case "date":
      case "text-mask":
      case "address":
      case "porcentaje":
      case "dropdown":
        value = (state.tags[option.key_tag] !== undefined) ? state.tags[option.key_tag] : value;
        let obj = {};
        obj.value = [{
          [option.key_name]: value
        }]
        obj.relationship = "";
        val_response.push(obj);
        break;
      case "multiple-choice-checkbox":
      case "simple-checkbox":
        let obj8 = {};
        obj8.value = [{
          [option.key_name]: value
        }]
        obj8.relationship = "";
        val_response.push(obj8);
        break;
      case "single-choice-checkbox":
        let obj1 = {};
        obj1.value = [{
          [option.key_name]: (option.key_name == "income_source") ? value : value.toLowerCase()
        }]
        obj1.relationship = "";
        val_response.push(obj1);
        break;
      case "range-slider":
        value = (state.tags[option.key_tag] !== undefined) ? state.tags[option.key_tag] : value;
        let obj9 = {};
        obj9.value = [{
          [option.key_name]: value
        }]
        obj9.relationship = "";
        val_response.push(obj9);
        break;
      default:
        break;
    }
    return val_response;
  },

  validRuleDataClient(state, rulesDataClient, arr) {
    let cant_value = rulesDataClient.length;
    let arrValid = [];
    let valid = false;
    rulesDataClient.forEach((a) => {
      switch (a.operator) {
        case "==":
          const val = this.filterValueClient(state, a.param);
          if (Array.isArray(a.value)) {
            valid = false;
            if (val.indexOf(a.value) !== -1) {
              valid = true;
            }
            arrValid.push(valid);
          } else {
            valid = false;
            if (val === a.value) {
              valid = true;
            }
            arrValid.push(valid);
          }
          break;
      }
    })
    if (arrValid.length > 0) {
      if (cant_value == arrValid.length) {
        valid = true;
        arrValid.forEach((a) => {
          if (a == false) {
            valid = false;
          }
        })
      }
    }
    return valid;
  },

  validRuleDataTag(state, rulesDataTag, arr) {
    let arrValid = [];
    let valid = false;
    let cant_value = arr.length;
    rulesDataTag.forEach((a) => {
      switch (a.operator) {
        case "<=":
          const value = (state.tags[a.param] !== undefined) ? state.tags[a.param] : "";
          valid = false;
          if (parseInt(value) <= parseInt(a.value)) {
            valid = true;
          }
          arrValid.push(valid);
          break;
        case ">=":
          const value1 = (state.tags[a.param] !== undefined) ? state.tags[a.param] : "";
          valid = false;
          if (parseInt(value1) >= parseInt(a.value)) {
            valid = true;
          }
          arrValid.push(valid);
          break;
        case "==":
          const val = (state.tags[a.param] !== undefined) ? state.tags[a.param].toLowerCase() : "";
          if (Array.isArray(a.value.toLowerCase())) {
            valid = false;
            if (val.indexOf(a.value.toLowerCase()) !== -1) {
              valid = true;
            }
            arrValid.push(valid);
          } else {
            valid = false;
            if (val === a.value.toLowerCase()) {
              valid = true;
            }
            arrValid.push(valid);
          }
          break;
      }
    })
    if (arrValid.length > 0) {
      if (cant_value == arrValid.length) {
        valid = true;
        arrValid.forEach((a) => {
          if (a == false) {
            valid = false;
          }
        })
      }
    }
    return valid;
  },

  showQuestionSetTemplate(state, arr) {
    arr.forEach((a, index) => {
      if (a.rules.length > 0) {
        const rulesDataClient = a.rules.filter((a) => {
          if (a.rule_type == "data-client") {
            return a;
          }
        });
        const rulesDataTag = a.rules.filter((a) => {
          if (a.rule_type == "data-tag") {
            return a;
          }
        });
        let rule_tag = true;
        let rule_client = true;
        if (rulesDataTag.length > 0) {
          rule_tag = this.validRuleDataTag(state, rulesDataTag, arr);
        }
        if (rulesDataClient.length > 0) {
          rule_client = this.validRuleDataClient(state, rulesDataClient, arr)
        }
        if (!rule_tag || !rule_client) {
          arr.splice(index, 1);
        }
      }
    })
    return arr;
  },

  getInitialsRelationShip(state, data_indice, valueBack) {
    const data_dynamic = this.filterValueClient(state, data_indice);
    let relationship = null;
    data_dynamic.forEach((a) => {
      if (a.client_details[1] !== undefined) {
        const id = a.client_details[1].person_details[0].id;
        if (id == valueBack) {
          relationship = a.relationship
        }
      }
    })
    if (relationship == null && state.data_spouse !== null) {
      relationship = state.data_spouse.relationship;
    }
    return relationship;
  },

  getHiddenOptionValueFromResponses(question, keyName) {
    let responses = question.responses;
    if (question.set_data_response === undefined) {
      let value = responses.filter((item) => {
        return Object.keys(item.value[0])[0] === keyName
      }).map(item => {
        return item.value[0][keyName]
      });
      return value ? value[0] : '';
    } else {
      // condition to load the hidden field in the modal relation to add (multiple choices)
      let val = '';
      responses.forEach((a) => {
        a.forEach((b) => {
          b.value.forEach((c) => {
            if (Object.keys(c)[0] === keyName) {
              val = c[Object.keys(c)[0]];
            }
          });
        });
      })
      return val;
    }
  },

  async saveQuestion(state) {
    const question = {
      ...state.pag_survey[0]
    };
    const id_question = question.id;
    const columns = question.columns;
    const options = question.question_options;
    const progress = state.numPag;
    const cant_questions = state.cantQuestion;
    const total = progress * 100 / cant_questions;
    state.calc_progress = total;
    let responses = options.map((c) => {
      // update option value when hidden from view
      if (this.validOption(state, c) == false) {
        c.value = c.valueBack;
      }
      let value = ''
      switch (c.type) {
        case "sort-input":
          let obj7 = {};
          obj7.question_id = id_question;
          if (c.risk_option_id !== undefined) {
            obj7.risk_option_id = c.risk_option_id;
          }
          let copy = [...c.optionsFront];
          copy = copy.map((c, index) => {
            let b = c;
            if (typeof c.value !== "object") {
              b.value = {
                value: c.value,
                sort_order: index
              }
            }
            return b;
          })
          obj7.options = copy;
          return obj7;
          break;
        case "range-slider":
        case "amount":
        case "hidden":
          if (question.responses.length > 0) {
            value = this.getHiddenOptionValueFromResponses(question, c.key_name)
          } else if (c.key_name == "client_id" && question.client_id !== undefined && question.client_id !== null && question.client_id !== "") {
            // condition for option hidden client_id when perteneced an relationship question "form dynamic add relationship"
            value = question.client_id;
          } else {
            value = c.value;
          }
          case "autocomplete":
          case "text":
          case "number":
          case "date":
          case "text-mask":
          case "address":
          case "button_bool":
            let obj = {};
            obj.question_id = id_question;
            if (c.risk_option_id !== undefined) {
              obj.risk_option_id = c.risk_option_id;
            }
            obj.value = [{
              [c.key_name]: c.value !== '' ? c.value : value
            }]
            obj.relationship = question.relationship;
            if (state.pag_survey[0].type == "form-dynamic-options" || state.pag_survey[0].type == "multiple-dynamic-options") {
              const client_id = c.key_name.split("-")[1];
              const siglaRela = this.getInitialsRelationShip(state, question.client_section_data, client_id)
              obj.relationship = siglaRela;
              if (obj.value[0][c.key_name] == null) {
                obj.value[0][c.key_name] = 0;
              }
            }
            if (state.pag_survey[0].form_partner !== undefined && state.pag_survey[0].form_partner == true) {
              obj.relationship = state.marital_acronym;
            }
            obj.name = c.option_text;
            return obj;
            break;
          case "dropdown":
            let obj1 = {};
            obj1.question_id = id_question;
            obj1.value = [{
              [c.key_name]: c.value
            }]
            if (c.risk_option_id !== undefined) {
              obj1.risk_option_id = c.risk_option_id;
            }
            obj1.relationship = question.relationship;
            obj1.name = c.option_text;
            return obj1;
            break;
          case "single-choice-checkbox":
          case "multiple-choice-checkbox":
            if (c.value === true) {
              let obj2 = {};
              obj2.question_id = id_question;
              if (c.risk_option_id !== undefined) {
                obj2.risk_option_id = c.risk_option_id;
              }
              obj2.relationship = question.relationship;
              /***** set relationship initials for dynamic options *****/
              if (question.is_dynamic && (question.type == "form-dynamic-options" || question.type == "multiple-dynamic-options")) {
                const data_indice = question.client_section_data;
                if (data_indice == "['relationships']") {
                  const relationship = this.getInitialsRelationShip(state, data_indice, c.valueBack);
                  if (relationship !== null) {
                    obj2.relationship = relationship;
                  }
                }
              }
              if (state.pag_survey[0].form_partner !== undefined && state.pag_survey[0].form_partner == true) {
                obj2.relationship = state.marital_acronym;
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
              obj9.question_id = id_question;
              if (c.risk_option_id !== undefined) {
                obj9.risk_option_id = c.risk_option_id;
              }
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
      // condition for the form add_relationship the attribute relationship in all options
      if (question.form_add_relationship !== undefined && question.form_add_relationship == true) {
        let rel1 = null;
        responses.forEach((a) => {
          a.value.forEach((c) => {
            if (Object.keys(c)[0] == "relationship") {
              rel1 = c.relationship;
            }
          })
        });
        if (rel1 !== null) {
          responses = responses.map((a) => {
            let c = {
              ...a
            }
            if (a.relationship == null || a.relationship == "") {
              c.relationship = rel1;
            }
            return c;
          });
        }
      }

      // function to set the answers in the relationships multiple options
      if (question.set_data_response !== undefined) {
        responses = addRelationship.setResponseAddRelationship(state, question.set_data_response, "save", responses);
      }

      // condition form-dynamic-options for relationship in the options hidden
      if (question.type == "form-dynamic-options" || question.type == "multiple-dynamic-options") {
        let rel = null;
        responses.forEach((a) => {
          if (a.relationship !== null) {
            rel = a.relationship;
          }
        });
        responses = responses.map((a) => {
          let c = {
            ...a
          }
          if (a.relationship == null || a.relationship == "") {
            c.relationship = rel;
          }
          return c;
        });
      }
    }

    let setTemplate = state.copy_template.map((a) => {
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
          return copy1;
        }
      })
      let copy_tem = {
        ...a,
        questions: questions,
      }
      return copy_tem;
    })

    if (setTemplate.length > 0) {
      state.copy_template = setTemplate;
    }

    /*** delete responses with rules ***/
    if (question.reset_response !== undefined && question.reset_response == true) {
      const templateQuestionDel = this.cleanResponsesRules(state, options, id_question, responses);
      if (templateQuestionDel.length > 0) {
        state.copy_template = templateQuestionDel;
      }
    }
    /******* *******/

    /*** delete questions with rules ***/
    if (state.pag_survey[0].delete_insiders !== undefined && state.pag_survey[0].delete_insiders == true) {
      addRelationship.removeQuestionsInsiders(state);
    }

    if (state.pag_survey[0].delete_poa !== undefined && state.pag_survey[0].delete_poa == true) {
      fnPoa.removeQuestionsPoa(state);
    }
    /******* *******/

    /** save json by response  */
    const saveResp = await api.saveResponses(state).then(function (value) {
      if (value.data.status == "success") {
        state.status_request = true;
        state.error = false;
        state.error_msj = ""
        return new Promise(resolve => {
          resolve(true);
        });
      }
    }).catch(function (e) {
      state.status_request = false;
      state.error = true;
      state.error_msj = "Error save Response"
      console.error(e);
      EventBus.$emit("set-submited", false);
      return new Promise(resolve => {
        resolve(false);
      });
    })
    return saveResp;
  },

  filterValueClient(state, filter) {
    if (filter) {
      const dataClient = state.clienData;
      let cleanString = filter.replace(/\['/g, '');
      cleanString = cleanString.replace(/'\]/g, '.');
      let arrIndex = cleanString.split(".");
      arrIndex.pop();
      if (arrIndex.length == 1 && typeof dataClient[arrIndex[0]] === "string") {
        return dataClient[arrIndex[0]];
      } else {
        return this.searchMapValue(dataClient, arrIndex);
      }
    }
  },

  searchMapValue(obj, props) {
    if (props.length == 0) {
      return obj
    } else {
      if (obj.hasOwnProperty(props[0])) {
        return this.searchMapValue(obj[props.shift()], props)
      } else {
        return obj;
      }
    }
  },

  getOptionsDynamic(dataQuestion, state, type_option, type_question, data, client_section_data) {
    if ((type_question == "form-dynamic-options" || type_question == "multiple-dynamic-options") && data.length > 0) {
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
                regex: /^([0-9]+(.{0,1})[0-9]*)$/
              };
            }
            // detail of the relationship for the pep section
            if (dataQuestion.question_pep !== undefined && dataQuestion.question_pep == true) {
              obj_option.relationship_pep = true;
            }
            obj_option.id = id;
            obj_option.option_text = name;
            obj_option.value = id;
            obj_option.value_type = "string";
            obj_option.attributes = {};
            obj_option.type = type_option;
            if (dataQuestion.add_relationship !== undefined) {
              obj_option.tag = dataQuestion.add_relationship;
            }
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
            return obj_option;
          }
        });
        return options_dynamic;
      }
    }
  },

  validRuleResponse(state, rules_response, condition_or) {
    let arrValid = [];
    let cant_value = rules_response.length;
    let valid = false;
    rules_response.forEach(element => {
      state.variablesTag.forEach((a) => {
        if (a.tag == element.param) {
          switch (element.operator) {
            case "==":
              if (Array.isArray(element.value)) {
                valid = false;
                if (element.value.indexOf(a.value) !== -1) {
                  valid = true;
                }
                arrValid.push(valid);
              } else {
                valid = false;
                if (element.value === a.value) {
                  valid = true;
                }
                arrValid.push(valid);
              }
              break;
            case ">":
              valid = false;
              if (element.value > a.value) {
                valid = true;
              }
              arrValid.push(valid);
              break;
            case "<":
              valid = false;
              if (element.value < a.value) {
                valid = true;
              }
              arrValid.push(valid);
              break;
          }
        }
      })
    });
    if (condition_or) {
      if (arrValid.length > 0) {
        valid = false;
        arrValid.forEach((a) => {
          if (a == true) {
            valid = true;
          }
        })
      }
    } else {
      if (arrValid.length > 0) {
        valid = true;
        arrValid.forEach((a) => {
          if (a == false) {
            valid = false;
          }
        })
      }
    }
    return valid;
  },

  getNextQuestion(state) {
    let pag_anterior = state.template[state.numPag];
    let section_name = "";
    let pag_actual = state.template.filter((i, key) => {
      if (state.numPag + 1 == key) {
        section_name = i.section.section_text;
        return i;
      }
    });
    state.sectionName = section_name;
    return pag_actual;
  },

  evNextQuestion(state, nextPag) {
    let rules = nextPag[0].rules;
    let rules_or = false;
    if (nextPag[0].rules_or !== undefined && nextPag[0].rules_or == true) {
      rules_or = true;
    }
    //rules response of client
    const rules_response = rules.filter(element => {
      if (element.rule_type == "response") {
        return element;
      }
    });
    // if it is true, the question is already filtered
    const rules_data_tag = rules.filter(element => {
      if (element.rule_type == "data-tag") {
        return element;
      }
    });

    //rules data-client default
    const rulesDataClient = rules.filter((a) => {
      if (a.rule_type == "data-client") {
        return a;
      }
    });
    let rule_client = false;
    if (rulesDataClient.length > 0) {
      rule_client = this.validRuleDataClient(state, rulesDataClient, [])
    }
    const validRuleTag = this.validRuleDataTag(state, rules_data_tag, state.template);
    const validRuleResponse = this.validRuleResponse(state, rules_response, rules_or);

    if (rule_client) {
      state.pag_survey = nextPag;
      state.numPag = state.numPag + 1;
    } else {
      if (validRuleResponse && rules_data_tag.length == 0) {
        state.pag_survey = nextPag;
        state.numPag = state.numPag + 1;
      } else if (validRuleResponse && rules_data_tag.length > 0) {
        if (validRuleResponse && validRuleTag) {
          state.pag_survey = nextPag;
          state.numPag = state.numPag + 1;
        } else {
          state.numPag = state.numPag + 1;
          this.NextPagina(state);
        }
      } else {
        state.numPag = state.numPag + 1;
        this.NextPagina(state);
      }
    }
  },

  loadRelationshipPep(state, nextPag) {
    const data_rel = state.data_relationship_pep[0].value[0];
    let questions = nextPag[0].question_options;
    const keys = Object.keys(data_rel);
    let arr = [];
    questions.map((a) => {
      keys.forEach((b) => {
        if (a.key_name == b) {
          a.value = data_rel[a.key_name];
        }
      });
    })

    let arrClean = ["position", "type_of_pep"];
    questions.map((a) => {
      arrClean.forEach((b) => {
        if (a.key_name == b) {
          a.value = null;
        }
      });
    })
    nextPag[0].question_options = questions;
  },

  NextPagina(state) {
    state.status_request = false;
    const pag_actual = state.pag_survey;
    const result = this.saveQuestion(state);
    this.nextPaginaProcess(state);
  },

  evPrevQuestion(state, nextPag) {
    let rules = nextPag[0].rules;
    let rules_or = false;
    if (nextPag[0].rules_or !== undefined && nextPag[0].rules_or == true) {
      rules_or = true;
    }
    //rules response of client
    const rules_response = rules.filter(element => {
      if (element.rule_type == "response") {
        return element;
      }
    });
    //rules data-client default
    const rulesDataClient = rules.filter((a) => {
      if (a.rule_type == "data-client") {
        return a;
      }
    });
    let rule_client = false;
    if (rulesDataClient.length > 0) {
      rule_client = this.validRuleDataClient(state, rulesDataClient, [])
    }
    const validRuleResponse = this.validRuleResponse(state, rules_response, rules_or);
    if ((!validRuleResponse && rule_client) || (validRuleResponse && !rule_client) ||
      (validRuleResponse && rule_client)) {
      state.pag_survey = nextPag;
      state.numPag = state.numPag - 1;
    } else {
      state.numPag = state.numPag - 1;
      this.prevQuestion(state);
    }
  },

  getPrevQuestion(state) {
    state.sectionName = "";
    const pag_ant = state.template.filter((i, key) => {
      if (state.numPag - 1 == key) {
        state.sectionName = i.section.section_text;
        return i;
      }
    })
    return pag_ant;
  },

  async prevQuestion(state) {
    state.error = false;
    state.error_msj = "";
    let pag_ant = this.getPrevQuestion(state);
    if (pag_ant.length > 0) {
      if (pag_ant[0].rules.length > 0) {
        this.evPrevQuestion(state, pag_ant);
      } else {
        //show question
        state.pag_survey = pag_ant;
        state.numPag = state.numPag - 1;
      }
    }
  },

  async getTemplate(state, data) {
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
          return this.createTemplate(state, data)
        } else {
          console.error(error.response.data);
        }
      }
    })
    return resp;
  },

  async createTemplate(state, data) {
    const resp = await api.createNewJson(data).then(response => {
      if (response.status == 200) {
        return this.getTemplate(state, data);
      }
    }).catch(error => {
      console.error(error.response.data);
    })
    return resp;
  },

  nextPaginaProcess(state) {
    let nextPag = this.getNextQuestion(state);
    if (nextPag.length > 0) {
      // detail of the relationship for the pep section
      if (nextPag[0].get_relationship_pep !== undefined && nextPag[0].get_relationship_pep == true && state.data_relationship_pep.length > 0) {
        if (state.client_pep !== null) {
          if (state.client_pep !== state.data_relationship_pep[0].client_id) {
            this.loadRelationshipPep(state, nextPag);
          }
        } else {
          this.loadRelationshipPep(state, nextPag);
        }
      }
      if (nextPag[0].rules.length > 0) {
        this.evNextQuestion(state, nextPag);
      } else {
        state.error_msj = "";
        state.error = false;
        state.pag_survey = nextPag;
        state.numPag = state.numPag + 1;
      }
    } else {
      //survey end
      state.pag_survey = nextPag;
      state.numPag = state.numPag + 1;
      state.cantQuestion = state.numPag; //progress bar
    }
  }
}
