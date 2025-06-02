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
  // { path: '/vehiculos',
  //   name: 'vehiculos',
  //   component:() => import ('@/views/VehiculosView.vue')
  // },
 {
  path: '/menu-nerudo',
  name: 'MenuNerudo',
component: () => import('@/views/MenuNerudo.vue'),
},
  {
    path: '/reporteReparacion',
    name: 'reporteReparacion',
    component: () => import('@/views/reporteReparacion.vue')
  },
  {
    path: '/graficas',
    name: 'graficas',
    component: () => import('@/views/graficas.vue')
  },

{
  path: '/menu-nerudo',
  name: 'MenuNerudo',
component: () => import('@/views/MenuNerudo.vue'),
},
{
  path: '/Detallesvehi',
  name: 'VehiculoDetalle',
  component: () => import('@/views/DetalleVehiculoView.vue')
},
{
  path: '/hotwhe',
  name: 'hotwhe',
  component: () => import('@/views/carrito_hot_wheels.vue')
},
{
  path: '/DTCONECT/:id',
  name: 'DTCONECT',
  component: () => import('@/views/DVconect.vue')
}

 ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
