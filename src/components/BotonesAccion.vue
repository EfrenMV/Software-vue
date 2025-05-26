<template>
  <div class="acciones">
    <button @click="$emit('reparacion')" class="btn-reparacion">
      Registrar Reparación
    </button>
    <button @click="$emit('historial')" class="btn-historial">
      Ver Historial
    </button>
  </div>
</template>
