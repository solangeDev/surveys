import axios from 'axios'
import api from '@/env'
import store from '../store/index'

export default {

  //getDataNewJson (payload) {
    /*return axios({
      method: 'GET',
      url: `${api.endpoint}/form/getFormTemplate`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
      },
      params: {
        form_id: payload.form_id,
        participant_id: payload.participant_id,
        survey_id: payload.survey_id,
        data : 1
      }
    })*/
  //},

  getSurveys (payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/participants/list_survey`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'firm': store.getters.firm
      },
      data: {
        unique_code: payload.unique_code.toString(),
        participant_token: payload.participant_token.toString()
      }
    })
  },
  getSections (payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/section/access_code`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
        'firm': store.getters.firm
      },
      data: {
        form_id: payload.form_id,
        with_all_details: 1
      }
    })
  },
  resetForm (payload) {
    return axios({
      method: 'PUT',
      url: `${api.endpoint}/participant/survey/redo`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token.toString(),
        'firm': store.getters.firm
      },
      data: {
        unique_code: payload.unique_code.toString(),
        form_access_code: payload.access_code
      }
    })
  }
}
