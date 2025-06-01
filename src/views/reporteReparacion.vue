<template>
  <Header />

  <div class="contenedor-reporte">
    <!-- Encabezado -->
    <div class="encabezado">
      <div class="titulo-estado">
        <h2>BMW Sedan Azul</h2>
        <span class="etiqueta-estado">En reparación</span>
      </div>

      <div class="info-auto">
        <img src="/src/components/icons/bmw.png" alt="auto" class="imagen-auto" />
        <div class="datos-vehiculo">
          <p class="nombre">Juan Pérez Cruz</p>
          <p class="placa">Placa PFX-266</p>
          <p class="ultima">Últ. Reparación: 27-03-2025</p>
        </div>
      </div>
    </div>

    <!-- Reporte -->
    <div class="reporte">
      <h3>Reporte de Reparación</h3>
      <p>
        Coche BMW presenta fallas en el sistema eléctrico, especialmente en los sensores de reversa y el alternador.
      </p>
    </div>

    <!-- Botones -->
    <div class="botones">
      <button
        @click="seleccionar('aceptado')"
        :class="boton === 'aceptado' ? 'activo-verde' : 'inactivo'"
      >✔</button>

      <button
        @click="seleccionar('rechazado')"
        :class="boton === 'rechazado' ? 'activo-rojo' : 'inactivo'"
      >✖</button>
    </div>

    <!-- Deslizador -->
    <div v-if="boton" class="slider-container">
      <div
        class="slider"
        :class="{ 
          'deslizado-exito': deslizado && boton === 'aceptado',
          'deslizado-rechazo': deslizado && boton === 'rechazado',
          'slider-verde': boton === 'aceptado',
          'slider-rojo': boton === 'rechazado'
        }"
        @mousedown="iniciarDesliz"
        @touchstart="iniciarDesliz"
      >
        <div
          class="slider-thumb"
          :class="{
            'thumb-verde': boton === 'aceptado',
            'thumb-rojo': boton === 'rechazado'
          }"
          :style="{ left: thumbX + 'px' }"
        >
          ➤
        </div>
        <span v-if="!deslizado">Desliza para continuar</span>
        <span v-else>¡Redirigiendo!</span>
      </div>
    </div>

  </div>

  <Menu />

  <Modal
    v-if="mostrarModal"
    :titulo="boton === 'aceptado' ? '¡Reparación Aprobada!' : '¡Reparación Rechazada!'"
    :mensaje="boton === 'aceptado'
        ? 'El reporte fue aceptado exitosamente. Puedes continuar con el siguiente paso.'
        : 'El reporte fue rechazado. Informa al cliente o revalúa el diagnóstico.'"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import Modal from '@/components/Modal.vue'

const mostrarModal = ref(false)
const boton = ref(null)
const router = useRouter()

function seleccionar(opcion) {
  boton.value = opcion
}

const thumbX = ref(0)
const deslizado = ref(false)
const maxX = 220

function iniciarDesliz(event) {
  const startX = event.touches ? event.touches[0].clientX : event.clientX

  function mover(e) {
    const currentX = e.touches ? e.touches[0].clientX : e.clientX
    const delta = Math.min(currentX - startX, maxX)
    thumbX.value = delta > 0 ? delta : 0
  }

  function terminar() {
    if (thumbX.value >= maxX) {
      deslizado.value = true
      mostrarModal.value = true

      setTimeout(() => {
        router.push('/menu-nerudo')
      }, 2000)
    } else {
      thumbX.value = 0
    }

    window.removeEventListener('mousemove', mover)
    window.removeEventListener('mouseup', terminar)
    window.removeEventListener('touchmove', mover)
    window.removeEventListener('touchend', terminar)
  }

  window.addEventListener('mousemove', mover)
  window.addEventListener('mouseup', terminar)
  window.addEventListener('touchmove', mover)
  window.addEventListener('touchend', terminar)
}

function cerrarModal() {
  mostrarModal.value = false
  if (boton.value === 'aceptado') {
    router.push('/aprobado')
  } else if (boton.value === 'rechazado') {
    router.push('/rechazado')
  }
}
</script>

<style scoped>
.contenedor-reporte {
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.encabezado {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.titulo-estado {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titulo-estado h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #1f2937;
}

.etiqueta-estado {
  background-color: #fbbf24;
  color: #000;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: bold;
}

.info-auto {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 12px;
}

.imagen-auto {
  width: 80px;
  height: 80px;
  object-fit: contain;
  flex-shrink: 0;
}

.datos-vehiculo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nombre {
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  color: #1f2937;
}

.placa {
  font-weight: bold;
  font-size: 14px;
  margin: 0;
  color: #374151;
}

.ultima {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.reporte {
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
}

.reporte h3 {
  font-weight: bold;
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #1f2937;
}

.reporte p {
  margin: 0;
  line-height: 1.5;
}

.botones {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
}

.botones button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 24px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inactivo {
  background-color: #e5e7eb;
  color: #6b7280;
}

.activo-verde {
  background-color: #10b981;
  color: white;
  transform: scale(1.1);
}

.activo-rojo {
  background-color: #ef4444;
  color: white;
  transform: scale(1.1);
}

.slider-container {
  margin-top: 16px;
}

.slider {
  position: relative;
  height: 56px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  user-select: none;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

/* Estilos para slider verde (aceptado) */
.slider-verde {
  background-color: #10b981;
}

/* Estilos para slider rojo (rechazado) */
.slider-rojo {
  background-color: #ef4444;
}

.slider-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;
  font-size: 18px;
  font-weight: bold;
}

/* Thumb para slider verde */
.thumb-verde {
  color: #10b981;
}

/* Thumb para slider rojo */
.thumb-rojo {
  color: #ef4444;
}

/* Estados cuando está deslizado */
.deslizado-exito {
  background-color: #059669 !important;
}

.deslizado-rechazo {
  background-color: #dc2626 !important;
}

.deslizado-exito .slider-thumb {
  background-color: #ffffff;
  color: #059669;
}

.deslizado-rechazo .slider-thumb {
  background-color: #ffffff;
  color: #dc2626;
}
</style>