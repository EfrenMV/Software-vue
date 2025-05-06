import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', 
    name: 'Login', 
    component:() => import ('@/views/loginView.vue') 
  },
  { path: '/ejMenu', 
    name: 'ejMenu', 
    component:() => import ('@/views/menuUsoEjemplo.vue') 
  },
 ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
