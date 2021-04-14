import { storex } from '../store'
const routes = [
  {
    path: '/@:username',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Profile.vue')
      }
    ]
  },
  {
    path: '/welcome/:landing',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Landing.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
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
        const { user } = storex.user
        if (!user) {
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
    path: '/cobrowse',
    component: () => import('layouts/CobrowsingLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Cobrowse.vue')
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
  {
    path: '/neko',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Neko.vue')
      }
    ]
  },
  {
    path: '/navroom/:roomId',
    component: () => import('layouts/RoomLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Navroom.vue')
      }
    ]
  },
  {
    path: '/navroom',
    component: () => import('layouts/RoomLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Navroom.vue')
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
