import api from '@/controllers/question-list'
const state = {
  questionList: null
}
const getters = {
  getQuestionList: () => state.questionList
}
const actions = {
  initQuestions ({ commit }, questions) {
    //lo nuevo por implementar
    commit('setQuestionList', questions)
    /*return api.getQuestions(payload)
      .then(response => {
        commit('setQuestionList', response.data.payload.questions)
        return response.data.payload.questions
      })*/
  }
}

const mutations = {
  setQuestionList (state, payload) {
    state.questionList = payload
  }
}
export default {
  actions,
  getters,
  state,
  mutations
}
