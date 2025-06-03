<template>
  <div class="detalle-vehiculo">
    <Header></Header>
    
    <div class="contenido-scrollable">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        Cargando información del vehículo...
      </div>

      <div v-else-if="vehiculo.id">
        <!-- Fecha de última reparación -->
        <div class="fecha-reparacion" v-if="ultimaReparacion">
          Últ reparación: <strong>{{ formatFecha(ultimaReparacion.fecha) }}</strong>
        </div>
        <div class="fecha-reparacion" v-else>
          No hay reparaciones registradas
        </div>

        <!-- Estado del vehículo -->
        <div class="estado-badge" :class="estadoClass">
          <span :class="circuloClass"></span> {{ estadoTexto }}
        </div>

        <div class="imagen-vehiculo">
          <img
            :src="vehiculo.imagen || '/img/vehiculos/default_info.png'"
            :alt="`${vehiculo.marca} ${vehiculo.modelo}`"
            class="imagen"
            width="70%"
            loading="lazy"
          >
        </div>

        <!-- Información del vehículo -->
        <div class="info-vehiculo">
          <h2>{{ vehiculo.marca }} {{ vehiculo.modelo }}</h2>
          <h3>Placa <strong>{{ vehiculo.placa }}</strong></h3>
        </div>

        <!-- Descripción -->
        <div class="descripcion" v-if="ultimaReparacion">
          <p>
            {{ ultimaReparacion.diagnostico || 'Sin diagnóstico disponible' }}
            {{ ultimaReparacion.procedimiento ? ` ${ultimaReparacion.procedimiento}` : '' }}
          </p>
        </div>
        <div class="descripcion" v-else>
          <p>No hay información de reparación disponible</p>
        </div>
      </div>

      <div v-else-if="error" class="error-container">
        Error al cargar la información: {{ error }}
      </div>
    </div>
    
    <!-- Menú en la parte inferior dentro del contenedor -->
    <div class="menu-container">
      <Menu></Menu>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/supabase';
import Menu from '@/components/Menu.vue';
import Header from '@/components/Header.vue';

const route = useRoute();
const vehiculo = ref({});
const ultimaReparacion = ref(null);
const estadoClass = ref('');
const estadoTexto = ref('');
const circuloClass = ref('');
const loading = ref(false);
const error = ref(null);

// Cache simple para evitar consultas repetidas
const cache = new Map();

// Función para formatear la fecha
const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES');
};

// Optimizar el watch para evitar consultas duplicadas
let lastId = null;
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== lastId) {
    lastId = newId;
    await nextTick(); // Esperar a que el DOM se actualice
    await fetchVehiculo(newId);
  }
}, { immediate: false });

// Mapeo de estados a clases y textos
const mapEstado = (estado) => {
  const estados = {
    'operativo': {
      clase: 'operativo',
      texto: 'Operativo',
      circulo: 'circulo-verde'
    },
    'en_reparacion': {
      clase: 'reparacion',
      texto: 'En reparación',
      circulo: 'circulo-amarillo'
    },
    'reparacion': {
      clase: 'reparacion',
      texto: 'En reparación',
      circulo: 'circulo-amarillo'
    },
    'mantenimiento': {
      clase: 'mantenimiento',
      texto: 'En mantenimiento',
      circulo: 'circulo-amarillo'
    },
    'fuera_servicio': {
      clase: 'fuera-servicio',
      texto: 'Fuera de servicio',
      circulo: 'circulo-gris'
    }
  };

  return estados[estado] || {
    clase: '',
    texto: estado,
    circulo: ''
  };
};

// Obtener datos del vehículo con cache y manejo de errores
const fetchVehiculo = async (vehiculoId) => {
  if (!vehiculoId) return;

  // Verificar cache primero
  const cacheKey = `vehiculo_${vehiculoId}`;
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    vehiculo.value = cachedData.vehiculo;
    ultimaReparacion.value = cachedData.ultimaReparacion;

    const estadoMapeado = mapEstado(cachedData.vehiculo.estado_actual);
    estadoClass.value = estadoMapeado.clase;
    estadoTexto.value = estadoMapeado.texto;
    circuloClass.value = estadoMapeado.circulo;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Consulta optimizada: traer vehículo y última reparación en paralelo
    const [vehiculoResponse, reparacionResponse] = await Promise.all([
      supabase
        .from('vehiculo')
        .select('*')
        .eq('id', vehiculoId)
        .single(),
      supabase
        .from('reparacion')
        .select('fecha, diagnostico, procedimiento')
        .eq('vehiculo_id', vehiculoId)
        .order('fecha', { ascending: false })
        .limit(1)
    ]);

    if (vehiculoResponse.error) throw vehiculoResponse.error;

    vehiculo.value = vehiculoResponse.data;

    // Configurar estado
    const estadoMapeado = mapEstado(vehiculoResponse.data.estado_actual);
    estadoClass.value = estadoMapeado.clase;
    estadoTexto.value = estadoMapeado.texto;
    circuloClass.value = estadoMapeado.circulo;

    // Manejar reparaciones
    if (reparacionResponse.error) {
      console.warn('Error fetching reparaciones:', reparacionResponse.error);
      ultimaReparacion.value = null;
    } else {
      ultimaReparacion.value = reparacionResponse.data.length > 0 ? reparacionResponse.data[0] : null;
    }

    // Guardar en cache (válido por 5 minutos)
    cache.set(cacheKey, {
      vehiculo: vehiculoResponse.data,
      ultimaReparacion: ultimaReparacion.value,
      timestamp: Date.now()
    });

    // Limpiar cache antiguo
    setTimeout(() => {
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp > 300000) { // 5 minutos
          cache.delete(cacheKey);
        }
      }
    }, 300000);

  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err.message || 'Error desconocido';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const vehiculoId = route.params.id;
  if (vehiculoId) {
    lastId = vehiculoId;
    await fetchVehiculo(vehiculoId);
  }
});
</script>

<style scoped>
.loading-container, .error-container {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-family: 'Roboto', sans-serif;
}

.error-container {
  color: #d32f2f;
}

/* Estados del badge - todos con el mismo formato */
.estado-badge.operativo {
  background-color: #a7d782;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
}

.estado-badge.reparacion {
  background-color: #ffc107;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
}

.estado-badge.en-reparacion {
  background-color: #ffc107;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
}

.estado-badge.mantenimiento {
  background-color: #ffc107;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
}

.estado-badge.fuera-servicio {
  background-color: #6c757d;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
}


/* Círculos de estado */
.circulo-verde {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4CAF50;
  margin-right: 8px;
  vertical-align: middle;
}

.circulo-rojo {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f44336;
  margin-right: 8px;
}

.circulo-amarillo {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ffeb3b;
  margin-right: 8px;
}

.circulo-gris {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #9e9e9e;
  margin-right: 8px;
}

.detalle-vehiculo {
  width: 100%;
  max-width: 345px;
  height: 100vh;
  margin: 0 auto;
  background-color: white;
  display: grid;
  grid-template-rows: auto 1fr auto;
  position: relative;
}

.contenido-scrollable {
  overflow-y: auto;
  padding: 20px;
  -webkit-overflow-scrolling: touch;
}

/* Menú que se queda dentro del contenedor */
.menu-container {
  width: 100%;
  margin-bottom: 64px;
  background-color: white;
  border-top: 1px solid #eee;
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
  margin-bottom: 30px;
}

.descripcion p {
  margin: 0;
  color: #333;
  line-height: 1.5;
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

/*
.menu-fixed {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 345px;
  z-index: 100;
}*/
</style>
