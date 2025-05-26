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

    <!-- Continuar -->
    <div v-if="boton" class="continuar">
      <button
        @click="continuar"
        :class="boton === 'aceptado' ? 'continuar-verde' : 'continuar-rojo'"
      >
        Deslizar para continuar
      </button>
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

function continuar() {
  if (boton.value === 'aceptado') {
    router.push('/aprobado')
  } else if (boton.value === 'rechazado') {
    router.push('/rechazado')
  }
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
</style>
