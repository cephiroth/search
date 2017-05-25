import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Search from '@/pages/Search'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})

export default router

