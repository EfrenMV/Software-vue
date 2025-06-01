<template>
  <div class="modal-overlay" @click.self="cerrar">
    <div class="modal-contenido">
      <h2>{{ titulo }}</h2>
      <p>{{ mensaje }}</p>
      <button @click="cerrar">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  titulo: String,
  mensaje: String
})
const emit = defineEmits(['cerrar'])

function cerrar() {
  emit('cerrar')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-contenido {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  max-width: 320px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
button {
  margin-top: 16px;
  background-color: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
}
</style>
