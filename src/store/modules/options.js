import api from '@/controllers/options'
import moment from 'moment'

const state = {
  last_answer: null,
  to_submit: 0,
  submitted_num: 0,
  total_submitted: 0,
  currentOption: 0,
  points: null,
  rules: [],
  revRules: [],
  merge_fields: {}
}

const actions = {
  initAnswer ({ commit }, payload) {
    commit('STORE_ANSWER', payload)
    commit('STORE_FIELD', payload)
    let cleanQs = payload.questions.filter((q, index) => {
      if (q !== undefined) {
        if (q.type === 'date') {
          commit('STORE_RULES', q)
          return q
        } else if (q.type === 'single-choice' || q.type === 'multiple-choice') {
          if (q.option_value !== 'false' && q.option_value !== false) {
            commit('STORE_RULES', q)
          } else {
            commit('STORE_REVRULES', q)
          }
          return q
        } else if (q.type === 'sort-input') {
          let newObj = {
            value: q.option_value.value,
            sort_order: index
          }
          q.option_value = JSON.stringify(newObj)
          commit('STORE_RULES', q)
          return q
        } else {
          commit('STORE_RULES', q)
          return q
        }
      }
    })
    payload.questions = cleanQs
    return api.putAnswer(payload)
      .then(response => {
        return new Promise(resolve => {
          resolve(response.data.success)
        })
      })
  },
  clearFields ({commit}) {
    commit('clear_fields')
  },
  storeTotal ({commit}) {
    commit('STORE_TOTAL')
  },
  clearTotal ({commit}) {
    commit('CLEAR_TOTAL')
  },
  initResults ({ commit }, payload) {
    return api.submitSurvey(payload)
      .then(response => {
        commit('STORE_RESULTS', response)
        return new Promise(resolve => {
          resolve(response.data.success)
        })
      })
  },
  populateField ({commit}, payload) {
    commit('POPULATE_FIELD', payload)
  },
  storeRules ({commit}, payload) {
    commit('STORE_RULES', payload)
  },
  clearRules: ({commit}) => commit('clearRules'),
  rmRule ({commit}, payload) {
    commit('REMOVE_RULE', payload)
  },
  clearCount ({ commit }) {
    commit('CLEAR_COUNT')
  },
  storeSubmit ({ commit }) {
    commit('STORE_SUBMIT')
  },
  getDataAutocomplete({
    commit
  }, data) {
    return api.getDataAutocomplete(data)
      .then(response => {
        return new Promise(resolve => {
          resolve(response)
        })
      })
  },
}

const mutations = {
  setRules (state, payload) {
    state.rules = payload
  },
  setRevRules (state, payload) {
    state.revRules = payload
  },
  clearRules (state) {
    state.rules = []
    state.revRules = []
  },
  clear_fields (state) {
    state.merge_fields = {}
  },
  STORE_ANSWER (state, payload) {
    state.last_answer = payload
  },
  STORE_RULES (state, payload) {
    state.rules.push(payload)
  },
  STORE_REVRULES (state, payload) {
    state.revRules.push(payload)
  },
  REMOVE_RULE (state, payload) {
    state.rules.splice(payload, 1)
  },
  STORE_RESULTS (state, payload) {
    state.points = payload.data.payload
  },
  STORE_FIELD (state, payload) {
    var fields = payload.merge_fields
    payload.questions.forEach((q, index) => {
      if (q !== undefined) {
        if (fields[index] === '{{DOB}}') {
          let date = q.option_value
          state.merge_fields['{{DOB}}'] = date
          let dob = moment(date).toDate()
          let age = moment().diff(dob, 'years')
          state.merge_fields['{{AGE}}'] = age
        } else if (fields[index] === '{{SPOUSE_DOB}}') {
          state.merge_fields[fields[index]] = q.option_value
        } else if (fields[index] === '{{CONSUMER_DEBT}}') {
          state.merge_fields[fields[index]] = q.option_value
          let liquid = state.merge_fields['{{LIQUID_ASSETS}}']
          let fixed = state.merge_fields['{{FIXED_ASSETS}}']
          let consumer = state.merge_fields['{{CONSUMER_DEBT}}']
          let mortgage = state.merge_fields['{{MORTGAGE_DEBT}}']
          // eslint-disable-next-line
          state.merge_fields['{{NET_ASSETS}}'] = eval(parseInt(liquid) + parseInt(fixed) - parseInt(consumer) - parseInt(mortgage))
          // eslint-disable-next-line
          state.merge_fields['{{GROSS_ASSETS}}'] = eval(parseInt(liquid) + parseInt(fixed))
        } else if (q.option_value) {
          if (q.type === 'single-choice') {
            if (q.option_value !== 'false') {
              state.merge_fields[fields[index]] = q.option_value.toLowerCase()
            }
          } else if (q.type === 'phone-number') {
            state.merge_fields[fields[index]] = q.option_value.number
          } else {
            state.merge_fields[fields[index]] = q.option_value
          }
        }
      }
    })
  },
  POPULATE_FIELD (state, payload) {
    var fields = payload
    for (var property in fields) {
      if (property === '{{DEPENDENTS}}') {
        if (fields[property] === '0') {
          state.merge_fields[property] = 0
        } else {
          state.merge_fields[property] = fields[property]
        }
      } else {
        state.merge_fields[property] = fields[property]
      }
    }
  },
  SUBMIT_NUM (state, payload) {
    state.to_submit = payload
  },
  STORE_TOTAL (state) {
    state.total_submitted++
  },
  STORE_SUBMIT (state) {
    state.submitted_num++
  },
  CLEAR_COUNT (state) {
    state.submitted_num = 0
  },
  CLEAR_TOTAL (state) {
    state.total_submitted = 0
  }
}

const getters = {
  getCurrentOption: state => state.currentOption,
  last_answer: state => state.last_answer,
  points: state => state.points,
  to_submit: state => state.to_submit,
  submitted_num: state => state.submitted_num,
  total_submitted: state => state.total_submitted,
  merge_fields: state => state.merge_fields,
  rules: state => state.rules,
  revRules: state => state.revRules
}

export default {
  getters,
  state,
  actions,
  mutations
}
