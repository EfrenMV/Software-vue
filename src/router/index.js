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
{
  path: '/vehiculo/:id',
  name: 'DetalleVehiculo',
  component: () => import('@/views/DetalleVehiculoView.vue')
},
{
   path: '/vehiculo/:placa',
    name: 'DetalleVehiculo',
    component: () => import('@/views/DetalleVehiculoView.vue')
},
 {
    path: '/vehiculo/:placa/reparacion',
    name: 'RegistrarReparacion',
    component: () => import('@/views/RegistrarReparacionView.vue')
  }

 ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
