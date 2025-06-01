<template>
  <Header />

  <div class="contenedor-reporte">
    <!-- Encabezado -->
    <div class="encabezado">
      <h2>BMW Sedan Azul</h2>
      <span class="etiqueta-estado">En reparación</span>
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
    :class="{ 'deslizado-exito': deslizado }"
    @mousedown="iniciarDesliz"
    @touchstart="iniciarDesliz"
  >
    <div
      class="slider-thumb"
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'



const boton = ref(null)
const router = useRouter()

function seleccionar(opcion) {
  boton.value = opcion
}

const thumbX = ref(0)
const deslizado = ref(false)
const maxX = 220 // puedes ajustar el máximo para deslizar

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
      setTimeout(() => {
        if (boton.value === 'aceptado') {
          router.push('/aprobado')
        } else if (boton.value === 'rechazado') {
          router.push('/rechazado')
        }
      }, 400)
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

</script>

<style scoped>
.contenedor-reporte {
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.encabezado h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.etiqueta-estado {
  background-color: #facc15;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.info-auto {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.imagen-auto {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.nombre {
  font-weight: 600;
  font-size: 14px;
}

.placa {
  font-weight: bold;
  font-size: 14px;
}

.ultima {
  font-size: 12px;
  color: gray;
}

.reporte {
  background-color: #f3f3f3;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
}

.reporte h3 {
  font-weight: bold;
  margin-bottom: 8px;
}

.botones {
  display: flex;
  justify-content: space-around;
}

.botones button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 24px;
  border: none;
  transition: background-color 0.3s ease;
}

.inactivo {
  background-color: #e5e5e5;
  color: #6b7280;
}

.activo-verde {
  background-color: #22c55e;
  color: white;
}

.activo-rojo {
  background-color: #ef4444;
  color: white;
}

.continuar button {
  width: 100%;
  padding: 12px;
  border-radius: 24px;
  color: white;
  font-weight: bold;
  border: none;
  font-size: 16px;
}

.continuar-verde {
  background-color: #22c55e;
}

.continuar-rojo {
  background-color: #ef4444;
}

.slider-container {
  padding: 0 4px;
}

.slider {
  position: relative;
  height: 50px;
  background-color: #e5e5e5;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  font-weight: bold;
  font-size: 14px;
  user-select: none;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.slider-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  background-color: #444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: background 0.3s;
}

.deslizado-exito {
  background-color: #22c55e;
  color: white;
}





</style>
