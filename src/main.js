import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { USERS } from '@/store/users'
import './filters'
import api from './api'

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';

import VueWaypoint from 'vue-waypoint'

Vue.use(VueWaypoint)
api.getMyProfile().then(resp => {
  if (!resp.errors) api.setAuthentication(true)
  store.dispatch(USERS.GET_PROFILE)
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})

