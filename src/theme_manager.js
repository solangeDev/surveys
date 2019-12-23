import env from '@/env'
import {
  getParametersUrl
} from './controllers/question-list'

export class ThemeManager {
  theme = null
  availableThemes = env.availableThemes
  constructor() {
    this.theme = this.getThemeByUrl()
    if (this.availableThemes.indexOf(this.theme) === -1){
      this.theme = env.default_theme;
    }
  }

  getThemeByUrl() {
    this.params = getParametersUrl()
    return this.params.firm && this.params.firm !== 'undefined' ? this.params.firm : null
  }

  loadTheme() {
     if (process.env.NODE_ENV === 'development') {
       require(`../static/themes/${this.theme}/css/general.css`)
     } else {
       let link = document.createElement('link')
       link.rel = 'stylesheet'
       link.href = `./static/themes/${this.theme}/css/general.css`
       document.head.appendChild(link)
     }
  }
}
