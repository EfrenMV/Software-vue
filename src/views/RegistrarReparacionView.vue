<template>
  <div class="registrar-reparacion">
    <Header />
    <h1>Registrar Reparación para placa: {{ placa }}</h1>

    <form @submit.prevent="guardarReparacion">
      <label>Fecha:</label>
      <input type="date" v-model="fecha" required />

      <label>Descripción:</label>
      <textarea v-model="descripcion" required></textarea>

      <button type="submit">Guardar</button>
    </form>

    <Menu />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';

const route = useRoute();
const placa = route.params.placa;
const fecha = ref('');
const descripcion = ref('');

const guardarReparacion = () => {
  console.log('Reparación registrada:', {
    placa,
    fecha: fecha.value,
    descripcion: descripcion.value
  });
  // Aquí iría la lógica para guardar en API/Pinia
};
</script>

<style scoped>
.registrar-reparacion {
  padding: 20px;
  max-width: 345px;
  margin: 0 auto;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
