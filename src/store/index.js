import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import form from './modules/form'
import section from './modules/section'
import questionList from './modules/question-list'
import options from './modules/options'
import survey from './modules/survey'
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

/* eslint-disable no-unused-vars */
const store = new Vuex.Store({
  modules: {
    login,
    form,
    section,
    questionList,
    options,
    survey
  }
})

export default store
