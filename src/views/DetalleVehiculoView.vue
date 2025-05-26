<template>
  <div class="detalle-vehiculo">
    <h2>Detalle del Vehículo</h2>
    <div v-if="vehiculo">
      <img :src="vehiculo.imagen" :alt="vehiculo.nombre" width="250" />
      <p><strong>Nombre:</strong> {{ vehiculo.nombre }}</p>
      <p><strong>Placa:</strong> {{ vehiculo.placa }}</p>
      <p><strong>Última reparación:</strong> {{ vehiculo.ultReparacion }}</p>
    </div>
    <div v-else>
      <p>Vehículo no encontrado.</p>
    </div>
    <button @click="router.push('/vehiculos')">← Volver al listado</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const placa = route.params.placa

const vehiculos = [
  {
    nombre: "BMW Z4 coupe",
    placa: "M-QB-1180",
    ultReparacion: "16-02-2023",
    imagen: "/img/vehiculos/z4.png"
  },
  {
    nombre: "Ford Mustang",
    placa: "MNN-777",
    ultReparacion: "27-03-2024",
    imagen: "/img/vehiculos/mustang.png"
  },
  {
    nombre: "AJO car",
    placa: "AJO-475",
    ultReparacion: "15-03-2024",
    imagen: "/img/vehiculos/ajo-car.png"
  }
]

const vehiculo = ref(vehiculos.find(v => v.placa === placa))
</script>

<style scoped>
.detalle-vehiculo {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
