<template>
  <div class="detalle-vehiculo">
    <Header></Header>

    <div class="contenido-scrollable">
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
        <img :src="vehiculo.imagen || '/img/vehiculos/default_info.png'" :alt="`${vehiculo.marca} ${vehiculo.modelo}`" class="imagen" width="70%">
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

    <div class="menu-fixed">
      <Menu></Menu>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
// import { ref, onMounted } from 'vue';
// import { useRoute } from 'vue-router';
import { supabase } from '@/supabase';
import Menu from '@/components/Menu.vue';
import Header from '@/components/Header.vue';


const route = useRoute();
const vehiculo = ref({});
const ultimaReparacion = ref(null);
const estadoClass = ref('');
const estadoTexto = ref('');
const circuloClass = ref('');

// Función para formatear la fecha
const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES');
};

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchVehiculo(newId);
  }
});

// Mapeo de estados a clases y textos
const mapEstado = (estado) => {
  switch (estado) {
    case 'operativo':
      return {
        clase: 'operativo',
        texto: 'Operativo',
        circulo: 'circulo-verde'
      };
    case 'en_reparacion':
    case 'reparacion':
      return {
        clase: 'reparacion',
        texto: 'En reparación',
        circulo: 'circulo-amarillo'
      };
    case 'mantenimiento':
      return {
        clase: 'mantenimiento',
        texto: 'En mantenimiento',
        circulo: 'circulo-amarillo'
      };
    case 'fuera_servicio':
      return {
        clase: 'fuera-servicio',
        texto: 'Fuera de servicio',
        circulo: 'circulo-gris'
      };
    default:
      return {
        clase: '',
        texto: estado,
        circulo: ''
      };
  }
};

// Obtener datos del vehículo
const fetchVehiculo = async (vehiculoId) => {
  try {
    const { data: vehiculoData, error: vehiculoError } = await supabase
      .from('vehiculo')
      .select('*')
      .eq('id', vehiculoId)
      .single();

    if (vehiculoError) throw vehiculoError;
    vehiculo.value = vehiculoData;

    // Configurar estado
    const estadoMapeado = mapEstado(vehiculoData.estado_actual);
    estadoClass.value = estadoMapeado.clase;
    estadoTexto.value = estadoMapeado.texto;
    circuloClass.value = estadoMapeado.circulo;

    // Obtener última reparación
    const { data: reparacionData, error: reparacionError } = await supabase
      .from('reparacion')
      .select('fecha, diagnostico, procedimiento')
      .eq('vehiculo_id', vehiculoId)
      .order('fecha', { ascending: false })
      .limit(1);

    if (reparacionError) throw reparacionError;
    if (reparacionData.length > 0) {
      ultimaReparacion.value = reparacionData[0];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  if (route.params.id) {
    fetchVehiculo(route.params.id);
  }
});
</script>

<style scoped>

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
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.contenido-scrollable {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
  -webkit-overflow-scrolling: touch;
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

.menu-fixed {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 345px;
  z-index: 100;
}
</style>
