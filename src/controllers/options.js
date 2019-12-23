import axios from 'axios'
import api from '@/env'
import store from '../store';

export default {
  putAnswer (payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/participant/section/response`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.token,
        'firm': store.getters.firm
      },
      data: {
        'unique_code': payload.unique_code,
        'survey_id': payload.survey_id,
        'section_id': payload.section_id,
        'questions': payload.questions
      }
    })
  },
  getResponse (payload) {
    return axios({
      method: 'GET',
      url: `${api.endpoint}/survey/${payload.survey_id}/response`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.token,
        'firm': store.getters.firm
      },
      data: {
        'unique_code': payload.unique_code,
        'survey_id': payload.survey_id,
        'section_id': payload.section_id,
        'questions': payload.questions
      }
    })
  },
  submitSurvey (payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/participant/submit`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.token,
        'firm': store.getters.firm
      },
      data: {
        'unique_code': payload.unique_code,
        'survey_id': payload.survey_id
      }
    })
  }
}
