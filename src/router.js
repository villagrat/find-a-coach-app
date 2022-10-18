import { createRouter, createWebHistory } from "vue-router";

// import CoachDetail from './pages/coaches/CoachDetail.vue'
import CoachesList from './pages/coaches/CoachesList.vue'
// import CoachRegistration from './pages/coaches/CoachRegistration.vue'
// import ContactCoach from './pages/requests/ContactCoach.vue'
// import RequestsReceived from './pages/requests/RequestsReceived.vue'
// import UserAuth from './pages/auth/UserAuth.vue'
import NotFound from './pages/NotFound.vue'
import store from './store/index.js'

// Optimization: lazy loading of components
// NB: Async Components & Routing - it is not recommended to use as per the Vue 3.x docs
// Best Practice: can use to lazy load & fetch Components when working with v-if, wrapping the functional Components with defineAsyncComponent
// For Routes that are not often visited, if you did decide to do lazy loading, use the following syntax instead:
const CoachDetail = () => import('./pages/coaches/CoachDetail.vue')
const CoachRegistration = () => import('./pages/coaches/CoachRegistration.vue')
const ContactCoach = () => import('./pages/requests/ContactCoach.vue')
const RequestsReceived = () => import('./pages/requests/RequestsReceived.vue')
const UserAuth = () => import('./pages/auth/UserAuth.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: 'coaches' },
    { path: '/coaches', component: CoachesList },
    { path: '/coaches/:id', 
      component: CoachDetail,
      // children will receive :id as a prop
      props: true,
      children: [
      { path: 'contact', component: ContactCoach } // coaches/c1/contact
    ] },
    { path: '/register', component: CoachRegistration, meta: { requiresAuth: true }},
    { path: '/requests', component: RequestsReceived, meta: { requiresAuth: true } },
    { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
    { path: '/:notFound(.*)', component: NotFound },
  ]
})

// global nav guard using route metadata
router.beforeEach(function(to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/coaches')
  } else {
    next()
  }
})

export default router