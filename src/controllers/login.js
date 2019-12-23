import axios from 'axios'
import api from '@/env'

export default {
  login (payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/participant/login`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'firm': payload.firm
      },
      data: {
        phone: payload.phone.replace('-', '').replace('-', ''),
        location_id: 4,
        reference_id: payload.reference_id
      }
    })
  },
  details (payload) {
    return axios({
      method: 'POST',
      url: `${api.endpoint}/survey/get_details`,
      headers: {
        'app-id': api.priv['app-id'],
        'app-secret': api.priv['app-secret'],
        'participant-token': payload.token,
        'access-code': payload.access_code,
        'firm': payload.firm
      },
      data: {
        unique_code: payload.unique_code,
        survey_id: payload.survey_id
      }
    })
  }
}
