import axios from 'axios'
import api from '@/env'
import store from '../store/index'

export default {

  getSaveSurvey(payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/form/submitForm`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
        'firm': store.getters.firm
      },
      data: {
        client_id: payload.client_id,
        sections: payload.data,
        survey_id: payload.survey_id,
      }
    })
  },

  getDataNewJson(payload) {
    return axios({
      method: 'GET',
      url: `${api.endpoint}/form/getFormTemplate`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
        'firm': store.getters.firm
      },
      params: {
        form_id: payload.form_id,
        participant_id: payload.participant_id,
        survey_id: payload.survey_id,
      }
    })
  },

  createNewJson(payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/form/createFormTemplateWithResponses`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
        'firm': store.getters.firm
      },
      params: {
        form_id: payload.form_id,
        participant_id: payload.participant_id,
      }
    })
  },

  addRelationShip(payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/form/surveyRelationships`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
        'firm': store.getters.firm
      },
      data: {
        first_name: payload.first_name,
        last_name: payload.last_name,
        relationship: payload.relationship,
        client_id: payload.client_id,
        firm_id: payload.firm_id
      }
    })
  },

  saveResponses(payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/form/updateFormTemplateWithResponses`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
        'firm': store.getters.firm
      },
      data: {
        form_id: payload.form_id,
        participant_id: payload.participant_id,
        survey_id: payload.survey_id,
        form_responses: {
          sections: payload.copy_template,
          progress: payload.calc_progress,
          type: payload.type_survey,
          modal_confirmation: (payload.modal_confirmation !== undefined) ? payload.modal_confirmation : null
        },
      }
    })
  },

  getDataToken(payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/form/getAccessToken`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': payload.access_code,
        'participant-token': payload.participant_token,
        'firm': store.getters.firm
      },
      data: {}
    })
  },

  getDataAutocomplete(data) {
    return axios({
      method: data.method,
      url: data.source,
      headers: {
        'Authorization': `Bearer ${data.token}`
      },
      data: data.parameters ? data.parameters : null
    })
  },

  getDataDropdown(data) {
    return axios({
      method: data.method,
      url: data.source,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'access-code': data.access_code,
        'participant-token': data.participant_token,
        'firm': data.firm
      },
      data: data.parameters ? data.parameters : null
    })
  }
}
