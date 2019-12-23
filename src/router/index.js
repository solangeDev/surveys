import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Login from '@/components/Login'
import Form from '@/components/Form'
import Welcome from '@/components/Welcome'
import Thanks from '@/components/Thanks'
import Method from '@/components/Method'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app',
      component: App,
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: Welcome,
      props: true
    },
    {
      path: '/survey/:access_code',
      name: 'survey',
      component: Form,
      props: true
    },
    {
      path: '/thanks',
      name: 'thanks',
      component: Thanks,
      props: true
    },
    {
      path: '/method',
      name: 'method',
      component: Method
    }
  ]
})
