<template>
  <div class="detalle-vehiculo">
    <Header />

    <div class="contenido-scrollable" v-if="vehiculo">
      <!-- Fecha dinámica -->
      <div class="fecha-reparacion">
        Últ reparación: <strong>{{ vehiculo.ultima_reparacion_formateada || 'N/A' }}</strong>
      </div>

      <!-- Estado dinámico -->
      <div
        class="estado-badge"
        :class="vehiculo.estado_actual"
        :style="{ backgroundColor: estadoInfo[vehiculo.estado_actual]?.fondo }"
      >
        <span
          class="circulo"
          :style="{ backgroundColor: estadoInfo[vehiculo.estado_actual]?.color }"
        ></span>
        {{ estadoInfo[vehiculo.estado_actual]?.texto || vehiculo.estado_actual }}
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
        <h2>{{ vehiculo.marca }} {{ vehiculo.modelo }}</h2>
        <h3>Placa <strong>{{ vehiculo.placa }}</strong></h3>
        <h3 v-if="vehiculo.numero_serie">N° Serie <strong>{{ vehiculo.numero_serie }}</strong></h3>
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
const cargando = ref(true)
const error = ref(null)

// Configuración de estados
const estadoInfo = {
  operativo: {
    texto: 'Operativo',
    color: '#4CAF50',
    fondo: '#a7d782'
  },
  en_reparacion: {
    texto: 'En reparación',
    color: '#FF9800',
    fondo: '#ffcc80'
  },
  inactivo: {
    texto: 'Inactivo',
    color: '#F44336',
    fondo: '#e57373'
  }
}

// URL de imagen (puedes personalizar esto según tus necesidades)
const imagenUrl = computed(() => {
  return `/img/vehiculos/${vehiculo.value?.modelo?.toLowerCase().replace(/\s+/g, '') || 'default'}.png`
})

// Manejar errores de imagen
const handleImageError = (event) => {
  event.target.src = '/img/vehiculos/default.png'
}

// Obtener datos del vehículo
const cargarDatosVehiculo = async () => {
  try {
    cargando.value = true
    error.value = null

    const { data, error: supabaseError } = await supabase
      .from('vehiculo')
      .select('id, marca, modelo, ultima_reparacion, numero_serie, placa, estado_actual')
      .eq('placa', placa)
      .single()

    if (supabaseError) throw supabaseError
    if (!data) throw new Error('Vehículo no encontrado')

    // Formatear fecha si existe
    if (data.ultima_reparacion) {
      const fecha = new Date(data.ultima_reparacion)
      if (!isNaN(fecha)) {
        data.ultima_reparacion_formateada = fecha.toLocaleDateString('es-ES')
      } else {
        // Si no es una fecha válida, mostrar el valor original
        data.ultima_reparacion_formateada = data.ultima_reparacion
      }
    }

    vehiculo.value = data
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
  margin: 5px 0;
  color: #666;
  font-weight: normal;
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
