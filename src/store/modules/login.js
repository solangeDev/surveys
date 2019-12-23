import api from '@/controllers/login'

const state = {
  isLoggedIn: false,
  unique_code: null,
  logger_payload: null,
  progress: {},
  firm: null,
  firm_template:null
}

const getters = {
  unique_code: state => state.unique_code,
  logger_payload: state => state.logger_payload,
  progress: state => state.progress,
  //token: state => state.token
  firm: state => state.firm
}

const actions = {
  setFirmTemplate({
    commit
  }, firm) {
    commit('SET_FIRM_TEMPLATE', firm)
  },
  initLogin({
    commit
  }, payload) {
    return api.login(payload)
      .then(response => {
        // Set the firm name
        response.firm = payload.firm
        commit('LOGIN_DATA', response)
        return new Promise(resolve => {
          resolve(response.data)
        })
      })
  },
  initDetails({
    commit
  }, payload) {
    return api.details(payload)
      .then(response => {
        commit('SURVEY_DETAILS', response)
        return new Promise(resolve => {
          resolve(response.data)
        })
      })
  }
}

const mutations = {
  SET_FIRM_TEMPLATE(state, payload) {
    state.firm_template = payload;
    state.firm = payload;
  },
  LOGIN_DATA(state, payload) {
    state.logger_payload = payload.data.payload
    state.unique_code = payload.data.payload.unique_code
    state.firm = payload.firm
  },
  SURVEY_DETAILS(state, payload) {
    state.progress = payload.data.payload.survey.completed_summary
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
