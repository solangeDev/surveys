import store from '@/store'

export default {
  store,
  default_theme: 'fwp',
  endpoint: 'https://dev.survey-api.purposeadvisor.com',
  availableThemes: [
    'fwp',
    'har',
    'mil'
  ],
  pub: {
    'Content-Type': 'application/json'
  },
  priv: {
    'app-id': '2nGnyUBEWMpYgho9CS54cCrO9AuFJq6c',
    'app-secret': '2nGnyUBEWMpYgho9CS54cCrO9AuFJq6cZysO1cAd29fsL6Pe6N'
  }
}
