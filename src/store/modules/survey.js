import Vue from 'vue'
import api from '@/controllers/survey'
import survey from '@/controllers/survey-store'
import fnRelationships from '@/controllers/survey-add-relationship'
import fnPoa from '@/controllers/survey-poa';
import templateInsider from '../../components/insider.json';
import EventBus from "../../bus";
import moment from 'moment'

const state = {
  type_survey: null,
  numPag: 0,
  template: null,
  copy_template: null,
  clienData: null,
  survey_id: null,
  form_id: null,
  participant_token: null,
  participant_id: null,
  access_code: null,
  cantQuestion: 0,
  pag_survey: null,
  loaded: false,
  variablesTag: [],
  error: false,
  error_msj: "",
  sectionName: "",
  status: null,
  calc_progress: 0,
  data_preload: [],
  tags: null,
  points: null,
  data_relationship_pep: [],
  client_pep: null,
  status_request: false,
  loading: false,
  list_insider: [],
  list_poa: [],
  data_spouse: null,
  marital_acronym: null,
  modal_confirmation: null,
  ok_confirmation: null
}

const actions = {
  async removeRelationShip({
    commit
  }, data) {
    await commit('REMOVE_RELATIONSHIP')
  },
  okModalConfirmation({
    commit
  }, data) {
    commit('OK_MODAL_CONFIRMATION', data)
  },
  updateRelationShip({
    commit
  }, data) {
    commit('UPDATE_RELATIONSHIP', data)
  },
  setStatusRequest({
    commit
  }, data) {
    commit('SET_STATUS_REQUEST', data)
  },
  async addRelationShip({
    commit
  }, data) {
    await commit('ADD_RELATIONSHIP', data)
    if (state.status_request === true) {
      return new Promise((resolve) => {
        resolve(true)
      });
    }
  },
  cleanInputsForm({
    commit
  }) {
    commit('CLEAN_INPUTS_FORM')
  },
  setDataRelationshipPep({
    commit
  }, data) {
    commit('SET_DATA_RELATIONSHIP_PEP', data)
  },
  cleanResponses({
    commit
  }, data) {
    commit('CLEAN_RESPONSES', data)
  },
  actTags({
    commit
  }, data) {
    commit('ACT_TAGS', data)
  },
  setPoints({
    commit
  }, data) {
    commit('SET_POINTS', data)
  },
  initTags({
    commit
  }, data) {
    commit('INIT_TAGS', data)
  },
  setOptionsDrag({
    commit
  }, data) {
    commit('SET_OPTIONS_DRAG', data)
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
    const resp = survey.getTemplate(state, data).then(value => {
      commit('SET_DATA_TEMPLATE', {
        data: value,
        //data: dataJson,
        payload: data
      })
    });
  },
  nextQuestionMultiple: ({
    commit
  }, data) => commit('NEXT_QUESTION_MULTIPLE', data),
  nextQuestionSingle({
    commit
  }, data) {
    commit('NEXT_QUESTION_SINGLE', data)
  },
  addTag({
    commit
  }, data) {
    commit('ADD_TAG', data)
  },
  nextQuestion: ({
    commit
  }) => commit('NEXT_QUESTION'),
  setPagSurvey: ({
    commit
  }, data) => commit('SET_PAG_SURVEY', data),
  setPagSurvey2: ({
    commit
  }, data) => commit('SET_PAG_SURVEY2', data),
  goPrevPag: ({
    commit
  }) => commit('GO_PREV_SECTION'),
}

const mutations = {
  OK_MODAL_CONFIRMATION(state, value) {
    state.ok_confirmation = value;
  },
  REMOVE_RELATIONSHIP(state) {
    fnRelationships.removeItemRelationship(state)
  },
  UPDATE_RELATIONSHIP(state, value) {
    const validMarital = ["SP", "CL"]
    let filterMarital = state.clienData.relationships.filter((a) => {
      if (validMarital.indexOf(a.relationship) !== -1) {
        return a;
      }
    })
    if (filterMarital.length === 0) {
      state.data_spouse = value;
      survey.updateListRelationships(state, [], value).then((a) => {
        if (a === true) {
          state.status_request = true;
        }
      });
    }
  },
  SET_STATUS_REQUEST(state, value) {
    state.status_request = value;
  },
  async ADD_RELATIONSHIP(state, value) {
    let objResp = value;
    objResp.access_code = state.access_code;
    objResp.participant_token = state.participant_token;
    await api.addRelationShip(objResp).then(value => {
      if (value.data.status == "success") {
        const relationships = value.data.relationships;
        const new_client_id = value.data.new_client_id;
        state.clienData.relationships = relationships;
        let relaFilter = relationships.filter((a) => {
          let id = a.client_details[0].id;
          if (id == new_client_id) {
            return a;
          }
        })
        survey.updateListRelationships(state, relaFilter, objResp.option_detail).then((a) => {
          if (a === true) {
            state.status_request = true;
          }
        });
      }
    }).catch(function (e) {
      state.error = true;
      state.error_msj = "Error save Response"
      EventBus.$emit("set-submited", false);
    })
  },
  CLEAN_INPUTS_FORM(state) {
    const data = state.pag_survey[0].question_options.map((a) => {
      let z = a;
      if (a.type == "modal_form") {
        let newOptions = a.form_options.map((c) => {
          let d = c;
          d.value = "";
          return d;
        })
        z.form_options = newOptions;
      }
      return z;
    })
    state.pag_survey[0].question_options = data;
  },
  SET_DATA_RELATIONSHIP_PEP(state, value) {
    if (state.data_relationship_pep.length > 0) {
      state.client_pep = state.data_relationship_pep[0].client_id
    }
    state.data_relationship_pep = [];
    let data = state.clienData.relationships.filter((a) => {
      if (a.client_details[0].id == value) {
        return a;
      }
    })
    if (data.length > 0) {
      data = data.map((a) => {
        let obj = {};
        if (a.client_details[1] !== undefined) {
          obj.relationship = a.relationship;
          obj.first_name = a.client_details[1].person_details[0].first_name;
          obj.middle_name = a.client_details[1].person_details[0].middle_name;
          obj.last_name = a.client_details[1].person_details[0].last_name;
          obj.client_id = value;
        } else if (a.client_details[0]) {
          obj.relationship = a.relationship;
          obj.first_name = a.client_details[0].display_name;
          obj.middle_name = null;
          obj.middle_name = null;
          obj.client_id = value;
        }
        return obj;
      });
      let obj = {};
      obj.client_id = value;
      obj.value = data;
      state.data_relationship_pep = [...state.data_relationship_pep, obj];
    } else if (data.length == 0 && state.data_spouse !== null) {
      let obj = {};
      obj.client_id = value;
      let arr = [];
      arr.push(state.data_spouse);
      obj.value = arr;
      state.data_relationship_pep = [...state.data_relationship_pep, obj];
    }

  },
  SET_POINTS(state, value) {
    state.points = value.payload;
  },
  // update risk tags
  ACT_TAGS(state, value) {
    let copy = {
      ...state.tags
    };
    copy[value.tag] = value.value;
    if (value.tag == "{{DOB}}") {
      let age = (this.getters.getdataTags['{{DOB}}'] !== undefined) ? this.getters.getdataTags['{{DOB}}'] : null;
      age = moment().diff(moment(value.value, "YYYY-MM-DD"), 'years', false);
      if (age !== null && !Number.isNaN(age)) {
        copy['{{AGE}}'] = age
        copy['{{CALCULATE_65}}'] = 65 - age;
        copy['{{CALCULATE_85}}'] = 85 - age;
      }
    } else if (value.tag == "{{LIQUID_ASSETS}}") {
      const total_liquid = parseFloat(value.value) + parseFloat(state.tags['{{FIXED_ASSETS}}']) -
        (parseFloat(state.tags['{{MORTGAGE_DEBT}}']) + parseFloat(state.tags['{{CONSUMER_DEBT}}']));
      copy['{{NET_ASSETS}}'] = total_liquid;
    } else if (value.tag == "{{FIXED_ASSETS}}") {
      const total_fixed = parseFloat(state.tags['{{LIQUID_ASSETS}}']) + parseFloat(value.value) -
        (parseFloat(state.tags['{{MORTGAGE_DEBT}}']) + parseFloat(state.tags['{{CONSUMER_DEBT}}']));
      copy['{{NET_ASSETS}}'] = total_fixed;
    } else if (value.tag == "{{MORTGAGE_DEBT}}") {
      const total_mortage = parseFloat(state.tags['{{LIQUID_ASSETS}}']) + parseFloat(state.tags['{{FIXED_ASSETS}}']) -
        (parseFloat(value.value) + parseFloat(state.tags['{{CONSUMER_DEBT}}']));
      copy['{{NET_ASSETS}}'] = total_mortage;
    } else if (value.tag == "{{CONSUMER_DEBT}}") {
      const consumer_debt = parseFloat(state.tags['{{LIQUID_ASSETS}}']) + parseFloat(state.tags['{{FIXED_ASSETS}}']) -
        (parseFloat(state.tags['{{MORTGAGE_DEBT}}']) + parseFloat(value.value));
      copy['{{NET_ASSETS}}'] = consumer_debt;
    } else if (value.tag == "{{AGE}}") {
      copy['{{AGE}}'] = value.value;
    }
    state.tags = copy;
  },
  INIT_TAGS(state, data) {
    state.tags = data;
    let copy = {
      ...state.tags
    };
    copy['{{CALCULATE_65}}'] = 0;
    copy['{{CALCULATE_85}}'] = 0;
    if (data['{{LIQUID_ASSETS}}'] !== undefined && data['{{LIQUID_ASSETS}}'] !== null && data['{{FIXED_ASSETS}}'] !== undefined &&
      data['{{MORTGAGE_DEBT}}'] !== undefined && data['{{CONSUMER_DEBT}}'] !== undefined) {
      const net_assets = (
        (parseFloat(data['{{LIQUID_ASSETS}}']) + parseFloat(data['{{FIXED_ASSETS}}'])) -
        (parseFloat(data['{{MORTGAGE_DEBT}}']) + parseFloat(data['{{CONSUMER_DEBT}}']))
      );
      let age = (data['{{DOB}}'] !== undefined) ? data['{{DOB}}'] : null;
      age = moment().diff(moment(data['{{DOB}}'], "YYYY-MM-DD"), 'years', false);;
      if (age !== null && !Number.isNaN(age)) {
        copy['{{AGE}}'] = age
        copy['{{CALCULATE_65}}'] = 65 - age;
        copy['{{CALCULATE_85}}'] = 85 - age;
      }
      copy['{{NET_ASSETS}}'] = net_assets
    }
    state.tags = copy;
  },
  CLEAN_RESPONSES(state, data) {
    survey.cleanResponses(state, state.pag_survey)
  },
  SET_OPTIONS_DRAG(state, data) {
    let copy_order = data.map((a) => {
      let b = {
        ...a
      }
      return b;
    })
    let new_data = copy_order.map((c, index) => {
      let d = {
        ...c
      };
      d.value = {
        value: c.value,
        sort_order: index
      }
      return d;
    })
    const option = state.pag_survey[0].question_options[0];
    option.optionsFront = new_data;
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
  INIT_SURVEY(state) {
    state.numPag = 0;
    state.template = null;
    state.clienData = null;
    state.survey_id = null,
      state.form_id = null;
    state.participant_token = null;
    state.participant_id = null;
    state.access_code = null;
    state.cantQuestion = 0;
    state.pag_survey = null;
    state.loaded = false;
    state.variablesTag = [{
        tag: "{{is_mailing}}",
        value: "false",
      },
      {
        tag: "{{relationship_pep}}",
        value: "false",
      }
    ];
    state.error = false;
    state.error_msj = "";
    state.sectionName = "";
    state.type_survey = null;
    state.client_pep = null;
    state.data_relationship_pep = [];
    state.list_insider = [];
  },
  SET_ERROR(state, data) {
    state.error_msj = data.msj;
    state.error = data.status;
  },
  SET_DATA_TEMPLATE(state, data) {
    state.form_id = data.payload.form_id
    state.access_code = data.payload.access_code
    state.participant_id = data.payload.participant_id
    state.participant_token = data.payload.participant_token
    state.survey_id = data.payload.survey_id
    state.clienData = data.data.clientInfo
    const json_sections = [...data.data.form_template.sections];
    state.type_survey = data.data.form_template.type;
    state.copy_template = [...data.data.form_template.sections];
    state.status = data.data.form_template.status;
    state.modal_confirmation = (data.data.form_template.modal_confirmation !== undefined) ? data.data.form_template.modal_confirmation : null;
    let arr = [];
    let sections = json_sections.map((z) => {
      let dataSection = {
        section_text: z.section_text,
        description: z.description
      }
      let questions = z.questions;
      let question = questions.map((c) => {
        let options_items = c.question_options;
        let preload_data = [];

        //preload spouse data
        if (c.add_list_relationship !== undefined && c.add_list_relationship === true) {
          fnRelationships.loadDataSpouse(state, c.responses, this.state.login.firm);
        }

        // preload in vuex the list de questions by relationship (list insiders)
        if (c.form_insider !== undefined && c.form_insider === true && c.responses.length > 0) {
          fnRelationships.preloadQuestionsInsiders(state, c);
        }

        // preload in vuex the list de questions by relationship (list poa)
        if (c.form_poa !== undefined && c.form_poa === true && c.responses.length > 0) {
          fnPoa.preloadQuestionsPoa(state, c);
        }

        if (typeof c.preload_data !== 'undefined') {

          //Preloaded (question) data ClientAddresses
          if (c.preload_data.indice == "['ClientAddresses']") {
            let data_rel = survey.filterValueClient(state, c.preload_data.indice);
            data_rel = data_rel.filter((a) => {
              if (c.preload_data.value.includes("mailing")){
                if (a.is_mailing == true) {
                  return a;
                }
              } else if (c.preload_data.value.includes(a.client_address_type)) {
                if (a.client_address_type == "P" && a.is_residential == true) {
                  return a;
                } else if (a.client_address_type == "E") {
                  return a;
                }
              }
            })
            if (data_rel.length > 0) {
              preload_data = options_items.map((v) => {
                let obj = {};
                if (v.key_name == "cod_province") {
                  obj[v.key_name] = data_rel[0]["province"];
                } else if (v.key_name == "is_mailing" && data_rel[0][v.key_name] == true) {
                  obj.is_mailing = "is_mailing";
                } else {
                  obj[v.key_name] = data_rel[0][v.key_name];
                }
                return obj;
              });
            }
          }
          //Preloaded (question) data marital status
          if (c.preload_data.indice == "['relationships']") {
            const data_rel = survey.filterValueClient(state, c.preload_data.indice);
            const data_rel_filter = data_rel.filter((a) => {
              if (c.preload_data.value.includes(a.relationship) && a.client_details[1] !== undefined) {
                return a;
              }
            }).map((b) => {
              if (b.client_details[1].person_details !== undefined) {
                return b.client_details[1].person_details[0];
              }
            })
            if (data_rel_filter.length > 0) {
              preload_data = options_items.map((v) => {
                return data_rel_filter.map((a) => {
                  let arr = Object.keys(a);
                  return arr.filter((c) => {
                    if (c == v.key_name) {
                      return c;
                    }
                  }).map((d) => {
                    let obj = {};
                    obj[d] = a[d]
                    return obj;
                  })[0]
                })[0]
              })
            }
          }
          //Spouse's (question) employment address
          if (c.preload_data.indice == "['address_details']") {
            const data_rel = survey.filterValueClient(state, "['relationships']");
            let data_rel_filter = data_rel.filter((a) => {
              if (c.preload_data.value.includes(a.relationship) && a.client_details[1] !== undefined) {
                return a;
              }
            })
            if (data_rel_filter.length > 0 && data_rel_filter[0].client_details[3].address_details !== undefined && data_rel_filter[0].client_details[3].address_details.length > 0) {
              const data_address = data_rel_filter[0].client_details[3].address_details.filter((a) => {
                if (a.client_address_type == "E") {
                  return a;
                }
              })
              if (data_address.length > 0) {
                preload_data = options_items.map((v) => {
                  let obj = {};
                  if (v.key_name == "cod_province") {
                    obj[v.key_name] = data_address[0]["province"];
                  } else {
                    obj[v.key_name] = data_address[0][v.key_name];
                  }
                  return obj;
                });
              }
            }
          }
          //Spouse's (question) employment status
          if (c.preload_data.indice == "['employment_details']" || c.preload_data.indice == "['data_employment']") {
            const data_rel = survey.filterValueClient(state, "['relationships']");
            let data_rel_filter = data_rel.filter((a) => {
              if (c.preload_data.value.includes(a.relationship) && a.client_details[1] !== undefined) {
                return a;
              }
            })
            if (data_rel_filter.length > 0) {
              if (data_rel_filter[0].client_details[2] !== undefined) {
                if (data_rel_filter[0].client_details[2].employment_details !== undefined && data_rel_filter[0].client_details[2].employment_details.length > 0) {
                  data_rel_filter = data_rel_filter.map((b) => {
                    if (b.client_details[2] !== undefined) {
                      return b.client_details[2].employment_details[0];
                    }
                  })
                  if (c.preload_data.indice == "['data_employment']") {
                    preload_data = options_items.map((v) => {
                      return data_rel_filter.map((a) => {
                        let arr = Object.keys(a);
                        return arr.filter((c) => {
                          if (c == v.key_name) {
                            return c;
                          }
                        }).map((d) => {
                          let obj = {};
                          obj[d] = a[d]
                          return obj;
                        })[0]
                      })[0]
                    })
                  } else {
                    preload_data = options_items.map((v) => {
                      let c = {};
                      c[v.key_name] = data_rel_filter[0]["employment_status"];
                      return c;
                    });
                  }
                }
              }
            }
          }
        }
        /************** ***************/
        if (c.is_dynamic && (c.type == "form-dynamic-options" || c.type == "multiple-dynamic-options")) {
          const data_dynamic = survey.filterValueClient(state, c.client_section_data);
          const options_dynamic = survey.getOptionsDynamic(c, state, c.dynamic_option_types, c.type, data_dynamic, c.client_section_data)
          if (options_dynamic !== undefined) {
            let a = {
              ...c,
              question_options: [...c.question_options, ...options_dynamic]
            }
            c = a;
          }
          // filter empty values
          c.question_options = c.question_options.filter((i) => {
            if (i.option_text !== null && i.option_text !== "") {
              return i;
            }
          })
        }
        // variable to preload data from the data center in hidden fields
        const arr_key_hidden = ["cod_province", "client_id"]
        let options = c.question_options;
        let option = options.map((a) => {
          let value_preload = null;

          //Preloaded data 
          if (preload_data.length > 0) {
            let val = null;
            preload_data.forEach((b) => {
              // condition only to preload the address loaded from the advisor center
              if (arr_key_hidden.indexOf(a.key_name) !== -1 && Object.keys(b)[0] == a.key_name && a.type == "hidden") {
                value_preload = String(b[a.key_name])
                // preload of the rest of the values​​ loaded from the advisor center
              } else if (Object.keys(b)[0] == a.key_name) {
                val = b[a.key_name];
                let new_response = survey.preloadDatahub(state, c, a, val);
                value_preload = survey.preloadOption(c.id, c.type, new_response, a.type, a.key_name, a.option_text, a.value);
              }
            })
          }
          // preload (option) risk ClientFinancials
          if (a.preload_data !== undefined && a.preload_data.indice == "['ClientFinancials']") {
            let data_preload = survey.filterValueClient(state, a.preload_data.indice);
            if (data_preload.length > 0) {
              let data = data_preload[data_preload.length - 1];
              if (data !== "" && data !== null) {
                if (a.preload_data.initial_value !== undefined && a.preload_data.initial_value == true) {
                  a.initial_value = "['ClientFinancials']['" + parseInt(data_preload.length - 1) + "']['" + a.preload_data.value + "']";
                } else {
                  value_preload = parseFloat(data[a.preload_data.value]);
                  state.tags[a.key_tag] = value_preload;
                }
              }
            }
          }
          if (a.initial_value !== undefined && a.initial_value !== "" && value_preload == null) {
            let val_pre = survey.filterValueClient(state, a.initial_value);
            if (val_pre !== "unknown" && val_pre !== "" && typeof val_pre !== "object") {
              let new_response = survey.preloadDatahub(state, c, a, val_pre);
              value_preload = survey.preloadOption(c.id, c.type, new_response, a.type, a.key_name, a.option_text, a.value);
            }
          }
          if (c.responses.length > 0) {
            // function to set the answers in the relationships multiple options
            let responsePreload = c.responses;
            if (c.set_data_response !== undefined) {
              responsePreload = fnRelationships.setResponseAddRelationship(state, c.set_data_response, "load", c.responses);
            }
            //preload preferred_number in poa section
            if (a.key_name == "preferred_number" && c.is_poa == true) {
              responsePreload.forEach((c) => {
                if (c.value[0][a.key_name] == a.valueBack) {
                  value_preload = true;
                }
              })
              a.value = a.valueBack
            } else {
              value_preload = survey.preloadOption(c.id, c.type, responsePreload, a.type, a.key_name, a.option_text, a.value);
            }
          }
          if (a.type == "hidden") {
            value_preload = (value_preload !== "" && value_preload !== null) ? value_preload : a.value;
          }
          //update tag age
          if (a.key_tag == "{{DOB}}" && value_preload !== "") {
            let val_dob = moment().diff(moment(value_preload, "YYYY-MM-DD"), 'years', false);
            let copy_tags = {
              ...state.tags
            };
            copy_tags['{{AGE}}'] = Number.isNaN(val_dob) ? 0 : val_dob;
            state.tags = copy_tags;
          }
          let newOption = {
            ...a,
            valueSource: null,
            valueBack: a.value,
            value: value_preload
          }
          if (a.type == "sort-input") {
            let list_options = newOption.options.map((c) => {
              let d = {
                ...c
              };
              return d;
            })
            newOption.options = [...list_options];
            newOption.optionsFront = [
              ...list_options
            ]
            if (c.responses[0] !== undefined) {
              newOption.optionsFront = c.responses[0].options;
            }
          }
          if (a.type == "dropdown") {
            let list_options = newOption.options.map((c) => {
              let d = {
                ...c
              };
              return d;
            })
            newOption.options = [...list_options];
            newOption.optionsFront = [
              ...list_options
            ]
            if (a.endpoint !== undefined) {
              survey.getDataDropdown(this.state, a.endpoint).then((a) => {
                newOption.optionsFront = a
              })
            }
          }
          return newOption;
        })
        let newQuestion = {
          ...c,
          question_options: option,
          section: dataSection,
        }
        return newQuestion;
      })
      arr.push(...question);
    });
    /******* Show questions according to customer attributes *****/
    arr = survey.showQuestionSetTemplate(state, arr);
    /********** **********/
    state.numPag = 0;
    state.cantQuestion = arr.length;
    state.template = arr;
    const pag = state.template.filter((i, key) => {
      if (state.numPag == key)
        return i;
    })
    state.pag_survey = pag;
    state.sectionName = state.pag_survey[0].section.section_text;
    state.loaded = true;
  },
  NEXT_QUESTION_MULTIPLE(state) {
    if (state.pag_survey[0].form_insider !== undefined && state.pag_survey[0].form_insider == true) {
      let copy_template = {
        ...templateInsider
      };
      fnRelationships.createTemplateInsider(state, copy_template)
    }
    if (state.pag_survey[0].form_poa !== undefined && state.pag_survey[0].form_poa == true) {
      fnPoa.createTemplatePoa(state)
    }
    survey.NextPagina(state);


  },
  NEXT_QUESTION_SINGLE(state, data) {
    const condition = (state.pag_survey[0].client_section_data !== undefined && state.pag_survey[0].client_section_data === "['relationships']") ? {
      element: "valueBack",
      i: "id"
    } : {
      element: "option_text",
      i: "name"
    }
    let copy_set = [...state.pag_survey[0].question_options]
    data.forEach((i) => {
      copy_set.forEach((element, index) => {
        if (element[condition.element] === i[condition.i]) {
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
    //condition for set data your partner in state (survey account opening)
    state.pag_survey[0].question_options = [...copy_set]
    if (state.pag_survey[0].set_status_marital !== undefined && state.pag_survey[0].set_status_marital === true) {
      fnRelationships.updateDataStatusMarital(state);
    }
    survey.NextPagina(state);
  },
  NEXT_QUESTION(state, data) {
    //next page
    let nextPag = survey.NextPagina(state);
  },
  ADD_TAG(state, data) {
    data.forEach((d) => {
      state.variablesTag.forEach((a, index) => {
        if (d.tag === a.tag) {
          state.variablesTag.splice(index, 1);
        }
      });
    });
    data.forEach((d) => {
      state.variablesTag.push(d)
    })
  },
  SET_PAG_SURVEY(state, data) {
    const copy_options = [...state.pag_survey[0].question_options]
    data.forEach((i) => {
      copy_options.forEach((element, index) => {
        if (element.option_text === i.name) {
          //if (i.value != null) {
          copy_options[index] = {
            ...copy_options[index],
            value: i.value
          };
          //}
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
  },
  SET_PAG_SURVEY2(state, data) {
    const copy_options = [...state.pag_survey[0].question_options]
    data.forEach((i) => {
      copy_options.forEach((element, index) => {
        if (element.id === i.id) {
          copy_options[index] = {
            ...copy_options[index],
            value: i.value
          };
        }
      })
    })
    state.pag_survey[0].question_options = [...copy_options];
  },
  GO_PREV_SECTION(state, data) {
    survey.prevQuestion(state);

  }

}

const getters = {
  getClientData: state => state.clienData,
  getSectionName: state => state.sectionName,
  getPagAct: state => (state.pag_survey) ? state.pag_survey[0] : null,
  getNumPag: state => state.numPag,
  getProgress: state => {
    return {
      progress: state.numPag,
      "cant": state.cantQuestion
    }
  },
  getvariablesTag: state => state.variablesTag,
  getdataTags: state => state.tags,
  getPoints: state => state.points,
  getRelationshipPep: state => state.data_relationship_pep,
  getStatusRequest: state => state.status_request,
  getModalConfirmation: state => state.modal_confirmation,
  getOkConfirmation: state => state.ok_confirmation,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
