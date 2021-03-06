import { store } from '../store'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'user',
        component: () => import('pages/user'),
        children: [
          { path: 'profile', component: () => import('pages/Profile.vue') }
        ],
        meta: { userRequired: true }
      }
    ],
    beforeEnter (to, from, next) {
      if (to.matched.some(record => record.meta.userRequired)) {
        const user = store.getters['user/getUser']
        if (!user.length) {
          next('/')
        }
      }
      next()
    }
  },
  {
    path: '/search',
    component: () => import('layouts/SearchLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Search.vue')
      }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Home.vue')
      }
    ]
  },
  {
    path: '/rtcdemo',
    component: () => import('layouts/SearchLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/RTCDemo.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
