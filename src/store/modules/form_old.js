import api from '@/controllers/form'
import store from '@/store'
import Vue from 'vue';
import { exists } from 'fs';
const state = {
  surveys: [],
  sections: null,
  currentSection: null,
  currentIndex: 0,
  done: false,
  token: 11111,
  direction: true,
  template: null
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

const getters = {
  done: state => state.done,
  surveys: state => state.surveys,
  sections: state => state.sections,
  currentSection: state => state.currentSection,
  currentIndex: state => state.currentIndex,
  token: state => state.token,
  direction: state => state.direction,
  template: state => state.template,
  filerValueClient: state => (filter) => {
    if (filter) {
      const dataClient = state.template.clientInfo;
      let cleanString = filter.replace(/\['/g, '');
      cleanString = cleanString.replace(/'\]/g, '.');
      let arrIndex = cleanString.split(".");
      arrIndex.pop();
      return searchMapValue(dataClient, arrIndex)
    }
  }, searchDataFormDynamic: state => (mapping) => {
     if (mapping == "['form_relationships']"){
      let participantResp = null;
      state.sections.forEach((index) => {
         index.question.forEach(element => {
            element.question_options.forEach((i)=>{
              if (i.column_value_option.value == "['relationships']") {
                participantResp = i.participant_response;
              }
            })
         });
      })
      let dataClient = [];
      participantResp.forEach((i) => {
          state.template.clientInfo.relationships.forEach((a) => {
              if (a.client_details[0].id === i.option_id) {
                dataClient = [...dataClient, a]
              }
          });
      });
      return dataClient;
     }
  }
}

const actions = {
  clearCurrentSection: ({
    commit
  }) => commit('clearCurrentSection'),
  changeDirection: ({
    commit
  }, payload) => commit('changeDirection', payload),
  goNextSection: ({
    commit
  }) => commit('goNextSection'),
  goPrevSection: ({
    commit
  }) => commit('goPrevSection'),
  setSectionIndex: ({
    commit
  }, payload) => commit('setSectionIndex', payload),
  initSurveys({
    commit
  }, payload) {
    state.surveys = []
    commit('STORE_TOKEN', payload.participant_token)
    return api.getSurveys(payload)
      .then(response => {
        commit('SURVEY_DATA', response.data.payload)
        return new Promise(resolve => {
          resolve(response.data.payload)
        })
      })
  },
  initSections({
    commit
  }, payload) {
    return api.getSections(payload)
      .then(response => {
        commit('SECTION_DATA', response.data.payload.sections)
        commit('setCurrentSection', 0)
      })
  },
  initReset({
    commit
  }, payload) {
    return api.resetForm(payload)
      .then(response => {
        return new Promise(resolve => {
          resolve(response)
        })
      })
  },
  clearSurveys({
    commit
  }) {
    commit('clearSurveys')
  },
  clearToken({
    commit
  }) {
    commit('clearToken')
  },
  setFormTemplate({
    commit
  }, payload) {
    return api.getDataNewJson(payload).then(response => {
      commit('SET_DATA_TEMPLATE', response.data.payload.form_template[0])
    })
  }
}

const mutations = {
  clearSurveys() {
    state.surveys = []
  },
  clearToken() {
    state.token = ''
  },
  setCurrentSection(state, payload) {
    state.currentSection = payload
  },
  changeDirection(state, payload) {
    state.direction = payload
  },
  goNextSection(state) {
    let found = false
    for (let i = state.currentSection + 1; i < state.sections.length; i++) {
      let question = state.sections[i].question[0]
      if (question.is_hidden === 1) { // if is_hidden is 1, go on
        if (question.rules.length > 0) { // if there's rules, go on
          const localRules = question.rules.map(a => {
            let newObj = {}
            newObj['id'] = a.question_option_id
            newObj['ruleType'] = a.rule_type
            return newObj
          })
          const stateRules = store.getters.rules.map(a => a.option_id)
          let ruleFound = localRules.some(x => {
            if (stateRules.includes(x.id)) {
              if (x.ruleType === 'show') return true
            } else return false
          })
          if (!ruleFound && store.getters.revRules) {
            const stateRevRules = store.getters.revRules.map(a => a.option_id)
            ruleFound = localRules.some(x => {
              if (stateRevRules.includes(x.id)) {
                if (x.ruleType === 'not_show') return true
              } else return false
            })
          }
          if (ruleFound) {
            state.currentSection = i
            found = true
            break
          }
        } else {
          state.currentSection = i
          found = true
          break
        }
      } else {
        state.currentSection = i
        found = true
        break
      }
    }
    if (!found) {
      state.done = true
      state.currentSection = state.sections.length
    }
  },
  goPrevSection(state) {
    if (state.currentSection > 0) {
      for (let i = state.currentSection - 1; i >= 0; i--) {
        let question = state.sections[i].question[0]
        if (question.is_hidden === 1) { // if is_hidden is 1, go on
          if (question.rules.length > 0) { // if there's rules, go on
            const localRules = question.rules.map(a => {
              let newObj = {}
              newObj['id'] = a.question_option_id
              newObj['ruleType'] = a.rule_type
              return newObj
            })
            const stateRules = store.getters.rules.map(a => a.option_id)
            let ruleFound = localRules.some(x => {
              if (stateRules.includes(x.id)) {
                if (x.ruleType === 'show') return true
              } else return false
            })
            if (!ruleFound && store.getters.revRules) {
              const stateRevRules = store.getters.revRules.map(a => a.option_id)
              ruleFound = localRules.some(x => {
                if (stateRevRules.includes(x.id)) {
                  if (x.ruleType === 'not_show') return true
                } else return false
              })
            }
            if (ruleFound) {
              state.currentSection = i
              break
            }
          } else {
            state.currentSection = i
            break
          }
        } else {
          state.currentSection = i
          break
        }
      }
    }
    let newRules = store.getters.rules.filter(x => {
      return x.id !== state.sections[state.currentSection].question[0].id
    })
    let newRevRules = store.getters.revRules.filter(x => {
      return x.id !== state.sections[state.currentSection].question[0].id
    })
    store.commit('setRules', newRules)
    store.commit('setRevRules', newRevRules)
  },
  setSectionIndex(state, payload) {
    state.sections[payload.index] = payload.section
  },
  clearCurrentSection(state) {
    state.currentSection = null
  },
  SURVEY_DATA(state, payload) {
    state.surveys = payload
  },
  SET_DATA_TEMPLATE(state, data) {
    let dataTemplate = JSON.parse(data)
    dataTemplate.form.section.forEach(element => {
      if(element.question){
        element.question.forEach(i => {
          i.options = i.question_options
        })
      }
    });
    state.template = dataTemplate
    state.sections = dataTemplate.form.section
  },
  SECTION_DATA(state, payload) {
    state.done = false
    state.sections = payload
  },
  STORE_TOKEN(state, payload) {
    state.token = payload
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
