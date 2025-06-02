<template>
  <Header />

  <div class="contenedor-reporte">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando reporte...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="cargarDatos" class="retry-btn">Reintentar</button>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Encabezado -->
      <div class="encabezado">
        <div class="titulo-estado">
          <h2>{{ vehiculo.marca }} {{ vehiculo.modelo }}</h2>
          <span class="etiqueta-estado" :class="getEstadoClass(vehiculo.estado_actual)">
            {{ getEstadoLabel(vehiculo.estado_actual) }}
          </span>
        </div>

        <div class="info-auto">
          <img src="/src/components/icons/bmw.png" alt="auto" class="imagen-auto" />
          <div class="datos-vehiculo">
            <p class="nombre">{{ mecanico.nombre }} {{ mecanico.apellido_paterno }}</p>
            <p class="placa">Placa {{ vehiculo.placa }}</p>
            <p class="ultima">Últ. Reparación: {{ formatearFecha(reparacion.fecha) }}</p>
          </div>
        </div>
      </div>

      <!-- Reporte -->
      <div class="reporte">
        <h3>Reporte de Reparación</h3>
        <div class="detalle-reparacion">
          <p><strong>Tipo:</strong> {{ reparacion.tipo }}</p>
          <p><strong>Diagnóstico:</strong> {{ reparacion.diagnostico }}</p>
          <p><strong>Procedimiento:</strong> {{ reparacion.procedimiento }}</p>
          <p><strong>Notas:</strong> {{ reparacion.notas || 'Sin notas adicionales' }}</p>
          <p><strong>Odómetro:</strong> {{ reparacion.odometro }} km</p>
          <p><strong>Horómetro:</strong> {{ reparacion.horometro }} hrs</p>
        </div>
      </div>

      <!-- Botones -->
      <div class="botones">
        <button
          @click="seleccionar('aprobado')"
          :class="boton === 'aprobado' ? 'activo-verde' : 'inactivo'"
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
            'deslizado-exito': deslizado && boton === 'aprobado',
            'deslizado-rechazo': deslizado && boton === 'rechazado',
            'slider-verde': boton === 'aprobado',
            'slider-rojo': boton === 'rechazado'
          }"
          @mousedown="iniciarDesliz"
          @touchstart="iniciarDesliz"
        >
          <div
            class="slider-thumb"
            :class="{
              'thumb-verde': boton === 'aprobado',
              'thumb-rojo': boton === 'rechazado'
            }"
            :style="{ left: thumbX + 'px' }"
          >
            ➤
          </div>
          <span v-if="!deslizado">Desliza para continuar</span>
          <span v-else>¡Guardando decisión!</span>
        </div>
      </div>
    </template>
  </div>

  <Menu />

  <Modal
    v-if="mostrarModal"
    :titulo="boton === 'aprobado' ? '¡Reparación Aprobada!' : '¡Reparación Rechazada!'"
    :mensaje="boton === 'aprobado'
        ? 'El reporte fue aceptado exitosamente. El vehículo está listo para uso.'
        : 'El reporte fue rechazado. Se requiere más trabajo en la reparación.'"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import Modal from '@/components/Modal.vue'

import { supabase } from '@/supabase.js'

// Variables reactivas
const mostrarModal = ref(false)
const boton = ref(null)
const loading = ref(true)
const error = ref(null)

// Datos del backend
const vehiculo = ref({})
const reparacion = ref({})
const mecanico = ref({})

const router = useRouter()
const route = useRoute()

// Funciones para cargar datos
const cargarDatos = async () => {
  try {
    loading.value = true
    error.value = null

    const reparacionId = route.params.id // Obtener ID de la URL

    //  CONSULTA REAL A LA BASE DE DATOS
    const { data: reparacionData, error: reparacionError } = await supabase
      .from('reparacion')
      .select(`
        *,
        vehiculo (
          id,
          modelo,
          año,
          placa,
          estado_actual,
          numero_serie
        ),
        usuario:mecanico_id (
          id,
          nombre,
          apellido_paterno,
          apellido_materno
        )
      `)
      .eq('id', reparacionId)
      .eq('status', 'pendiente') // Solo reparaciones pendientes de aprobación
      .single()

    if (reparacionError) {
      throw new Error('No se pudo cargar el reporte de reparación')
    }

    // Asignar datos a las variables reactivas
    reparacion.value = reparacionData
    vehiculo.value = reparacionData.vehiculo
    mecanico.value = reparacionData.usuario

    console.log('Datos cargados:', reparacionData)

  } catch (err) {
    console.error('Error al cargar datos:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Funciones de utilidad
const getEstadoClass = (estado) => {
  const clases = {
    'operativo': 'estado-operativo',
    'reparacion': 'estado-reparacion', 
    'inactivo': 'estado-inactivo'
  }
  return clases[estado] || ''
}

const getEstadoLabel = (estado) => {
  const labels = {
    'operativo': 'Operativo',
    'reparacion': 'En Reparación',
    'inactivo': 'Fuera de Servicio'
  }
  return labels[estado] || estado
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'No disponible'
  
  try {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  } catch (err) {
    return fecha
  }
}

// Funciones de interacción
function seleccionar(opcion) {
  boton.value = opcion
}

// Variables del slider
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

  async function terminar() {
    if (thumbX.value >= maxX) {
      deslizado.value = true
      
      //  GUARDAR DECISIÓN EN LA BASE DE DATOS
      await guardarDecision()
      
      mostrarModal.value = true

      setTimeout(() => {
        router.push('/vehiculos')
      }, 2000)
    } else {
      thumbX.value = 0
    }

    // Limpiar event listeners
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

//  FUNCIÓN PARA GUARDAR EN LA BASE DE DATOS
const guardarDecision = async () => {
  try {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'))
    const nuevoStatus = boton.value === 'aprobado' ? 'completado' : 'rechazado'
    const nuevoEstadoVehiculo = boton.value === 'aprobado' ? 'operativo' : 'reparacion'

    // 1. Actualizar el status de la reparación
    const { error: errorReparacion } = await supabase
      .from('reparacion')
      .update({
        status: nuevoStatus,
        ultima_reparacion: new Date().toISOString()
      })
      .eq('id', reparacion.value.id)

    if (errorReparacion) throw errorReparacion

    // 2. Actualizar el estado del vehículo
    const { error: errorVehiculo } = await supabase
      .from('vehiculo')
      .update({
        estado_actual: nuevoEstadoVehiculo
      })
      .eq('id', vehiculo.value.id)

    if (errorVehiculo) throw errorVehiculo

    console.log(`Decisión "${boton.value}" guardada exitosamente`)

  } catch (err) {
    console.error('Error al guardar decisión:', err)
    error.value = 'Error al guardar la decisión'
  }
}

// Lifecycle
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
/* Loading y Error states */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #7f8c8d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ecf0f1;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

/* Resto de estilos existentes */
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
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: bold;
}

.estado-operativo { background-color: #10b981; color: white; }
.estado-reparacion { background-color: #fbbf24; color: #000; }
.estado-inactivo { background-color: #6b7280; color: white; }

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

.detalle-reparacion p {
  margin: 8px 0;
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

.slider-verde {
  background-color: #10b981;
}

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

.thumb-verde {
  color: #10b981;
}

.thumb-rojo {
  color: #ef4444;
}

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