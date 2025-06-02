<!-- Detalles vehiculo borrador malo -->
<template>
  <div class="detalle-vehiculo">
    <Header />

    <div class="contenido-scrollable" v-if="vehiculo">
      <!-- Fecha dinámica -->
      <div class="fecha-reparacion">
        Últ reparación: <strong>{{ fechaFormateada || 'N/A' }}</strong>
      </div>

      <!-- Estado dinámico -->
      <div
        class="estado-badge"
        :class="statusReparacion"
        :style="{ backgroundColor: estadoInfo[statusReparacion]?.fondo }"
      >
        <span
          class="circulo"
          :style="{ backgroundColor: estadoInfo[statusReparacion]?.color }"
        ></span>
        {{ estadoInfo[statusReparacion]?.texto || statusReparacion }}
      </div>

      <div class="imagen-vehiculo">
        <img
          :src="imagenUrl"
          :alt="vehiculo.modelo"
          class="imagen"
          width="70%"
          @error="handleImageError"
        >
      </div>

      <!-- Información dinámica -->
      <div class="info-vehiculo">
        <h2>{{ vehiculo.modelo }}</h2>
        <h3>Placa <strong>{{ vehiculo.placa }}</strong></h3>
      </div>

      <div class="descripcion">
        <p>{{ descripcion || 'Sin descripción disponible' }}</p>
      </div>

      <!-- Detalles adicionales -->
      <div class="detalles-adicionales">
        <div class="detalle-item">
          <span class="detalle-label">Mecánico:</span>
          <span class="detalle-valor">{{ mecanicoNombre || 'No asignado' }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Horómetro:</span>
          <span class="detalle-valor">{{ reparacion.horometro || 'N/A' }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Odómetro:</span>
          <span class="detalle-valor">{{ reparacion.odometro || 'N/A' }}</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Próximo servicio:</span>
          <span class="detalle-valor">{{ proximoServicioFormateado || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="cargando" class="mensaje-estado">
      <p>Cargando información del vehículo...</p>
    </div>

    <div v-if="error" class="mensaje-estado error">
      <p>Error al cargar el vehículo: {{ error }}</p>
      <button @click="cargarDatosVehiculo">Reintentar</button>
    </div>

    <div class="menu-fijo">
      <Menu />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import { supabase } from '@/supabase'

const route = useRoute()
const placa = route.params.placa
const vehiculo = ref(null)
const reparacion = ref({})
const mecanico = ref(null)
const cargando = ref(true)
const error = ref(null)

// Configuración de estados
const estadoInfo = {
  completado: {
    texto: 'Operativo',
    color: '#4CAF50',
    fondo: '#a7d782'
  },
  en_progreso: {
    texto: 'En reparación',
    color: '#FF9800',
    fondo: '#ffcc80'
  },
  pendiente: {
    texto: 'Pendiente',
    color: '#F44336',
    fondo: '#e57373'
  },
  cancelado: {
    texto: 'Cancelado',
    color: '#9E9E9E',
    fondo: '#eeeeee'
  }
}

// Computed properties
const statusReparacion = computed(() => {
  return reparacion.value.status || 'pendiente'
})

const fechaFormateada = computed(() => {
  if (reparacion.value.fecha) {
    const fecha = new Date(reparacion.value.fecha)
    return fecha.toLocaleDateString('es-ES')
  }
  return null
})

const proximoServicioFormateado = computed(() => {
  if (reparacion.value.proximo_servicio) {
    const fecha = new Date(reparacion.value.proximo_servicio)
    return fecha.toLocaleDateString('es-ES')
  }
  return null
})

const imagenUrl = computed(() => {
  return vehiculo.value?.imagen_url || '/img/vehiculos/default.png'
})

const descripcion = computed(() => {
  return reparacion.value?.diagnostico ||
         reparacion.value?.procedimiento ||
         vehiculo.value?.descripcion ||
         'Sin descripción disponible'
})

const mecanicoNombre = computed(() => {
  return mecanico.value?.nombre_completo || mecanico.value?.nombre || 'Mecánico no asignado'
})

// Manejar errores de imagen
const handleImageError = (event) => {
  event.target.src = '/img/vehiculos/default.png'
}

// Obtener datos del vehículo y reparación
const cargarDatosVehiculo = async () => {
  try {
    cargando.value = true
    error.value = null

    // Paso 1: Obtener vehículo por placa
    const { data: vehiculoData, error: vehiculoError } = await supabase
      .from('vehiculo')
      .select('*')
      .eq('placa', placa)
      .single()

    if (vehiculoError) throw vehiculoError
    if (!vehiculoData) throw new Error('Vehículo no encontrado')

    vehiculo.value = vehiculoData

    // Paso 2: Obtener última reparación del vehículo
    const { data: reparacionData, error: reparacionError } = await supabase
      .from('reparacion')
      .select('*')
      .eq('vehiculo_id', vehiculo.value.id)
      .order('fecha', { ascending: false })
      .limit(1)
      .single()

    if (reparacionError) {
      console.warn('No se encontró reparación para el vehículo:', reparacionError.message)
    } else {
      reparacion.value = reparacionData || {}

      // Paso 3: Si hay reparación, obtener mecánico asignado
      if (reparacionData?.mecanico_id) {
        const { data: mecanicoData, error: mecanicoError } = await supabase
          .from('usuario')
          .select('id, nombre, apellido, nombre_completo')
          .eq('id', reparacionData.mecanico_id)
          .single()

        if (!mecanicoError && mecanicoData) {
          mecanico.value = mecanicoData
        }
      }
    }

  } catch (err) {
    console.error('Error al cargar vehículo:', err)
    error.value = err.message || 'Error desconocido'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatosVehiculo)
</script>

<style scoped>
.detalle-vehiculo {
  width: 100%;
  max-width: 345px;
  height: 100vh;
  margin: 0 auto;
  background-color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.contenido-scrollable {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 60px;
  -webkit-overflow-scrolling: touch;
}

.menu-fijo {
  position: fixed;
  bottom: 5rem;
  width: 100%;
  max-width: 345px;
  height: 50px;
  z-index: 100;
  background-color: white;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
  border-radius: 15px;
  margin: 0 auto;
  left: 0;
  right: 0;
}

.fecha-reparacion {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  text-align: right;
  font-family: 'Roboto', sans-serif;
}

.estado-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;
  color: #333;
}

.info-vehiculo {
  margin-bottom: 25px;
  font-family: 'Arial', sans-serif;
}

.info-vehiculo h2 {
  font-size: 24px;
  margin: 0 0 5px 0;
  color: #333;
}

.info-vehiculo h3 {
  font-size: 16px;
  margin: 0;
  color: #666;
  font-weight: normal;
}

.descripcion {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.descripcion p {
  margin: 0;
  color: #333;
  line-height: 1.5;
}

.detalles-adicionales {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.detalle-label {
  font-weight: bold;
  color: #666;
}

.detalle-valor {
  color: #333;
}

.imagen-vehiculo {
  text-align: center;
  margin: 15px 0;
}

.imagen {
  max-width: 70%;
  height: auto;
  border-radius: 8px;
}

@media (max-height: 700px) {
  .contenido-scrollable {
    padding-bottom: 50px;
  }

  .menu-fijo {
    bottom: 5px;
    height: 45px;
  }
}

.circulo {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.mensaje-estado {
  text-align: center;
  padding: 2rem;
  color: #666;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mensaje-estado.error {
  color: #f44336;
}

.mensaje-estado button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
