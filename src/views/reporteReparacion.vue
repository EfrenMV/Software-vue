<template>
  <Header></Header>
  
  <div class="p-4 flex flex-col min-h-screen bg-white">
    <!-- Encabezado -->
    <div class="mb-4">
      <h2 class="font-bold text-sm">BMW Sedan Azul</h2>
      <span class="bg-yellow-400 text-white text-xs px-2 py-1 rounded">En reparación</span>
      <div class="flex items-center mt-2">
        <img src="/src/components/icons/bmw.png" alt="Auto" class="w-20 h-14 object-cover mr-2" />
        <div>
          <p class="text-sm font-semibold">Juan Pérez Cruz</p>
          <p class="text-sm font-bold">Placa PFX-266</p>
          <p class="text-xs text-gray-500">Últ. Reparación: 27-03-2025</p>
        </div>
      </div>
    </div>

    <!-- Reporte -->
    <div class="bg-gray-100 p-4 rounded-xl text-sm text-gray-700 mb-6">
      <h3 class="font-semibold mb-2">Reporte de Reparación</h3>
      <p>
        Coche BMW presenta fallas en ....
      </p>
    </div>

    <!-- Botones -->
    <div class="flex justify-around mb-6">
      <button
        @click="seleccionar('aceptado')"
        :class="boton === 'aceptado' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'"
        class="w-14 h-14 rounded-full text-xl"
      >
        ✔
      </button>
      <button
        @click="seleccionar('rechazado')"
        :class="boton === 'rechazado' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'"
        class="w-14 h-14 rounded-full text-xl"
      >
        ✖
      </button>
    </div>

    <!-- Barra deslizable -->
    <div class="mt-auto">
      <button
        v-if="boton"
        @click="continuar"
        :class="boton === 'aceptado' ? 'bg-green-500' : 'bg-red-500'"
        class="w-full py-3 text-white font-bold rounded-full transition-colors duration-300"
      >
        Deslizar para continuar
      </button>
    </div>
  </div>
  <Menu></Menu>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';

const boton = ref(null)
const router = useRouter()

function seleccionar(opcion) {
  boton.value = opcion
}

function continuar() {
  if (boton.value === 'aceptado') {
    router.push('/aprobado')
  } else if (boton.value === 'rechazado') {
    router.push('/rechazado')
  }
}
</script>

<style scoped>
/* Puedes agregar animaciones o más estilos aquí */
</style>
