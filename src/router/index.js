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
  { path: '/usuario', 
    name: 'usuario', 
    component:() => import ('@/views/usuario.vue')
  },
  { path: '/vehiculos', 
    name: 'vehiculos', 
    component:() => import ('@/views/VehiculosView.vue') 
  },
   { path: '/graficas', 
    name: 'graficas', 
    component:() => import ('@/views/graficas.vue') 
  },
 ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
