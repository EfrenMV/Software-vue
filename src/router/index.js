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
<<<<<<< HEAD
 {
  path: '/menu-nerudo',
  name: 'MenuNerudo',
component: () => import('@/views/MenuNerudo.vue'),
}



=======
  {
    path: '/reporteReparacion',
    name: 'reporteReparacion',
    component: () => import('@/views/reporteReparacion.vue')
  },
  {
    path: '/aprobado',
    name: 'aprobado',
    component: () => import('@/views/aprobado.vue')
  },
  {
    path: '/rechazado',
    name: 'rechazado',
    component: () => import('@/views/rechazado.vue')
  }
>>>>>>> 8910d3dc63423a15ccf2b83dea2a06420c1ef8f8
 ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
