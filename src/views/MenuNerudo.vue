<!-- MenuNerudo "final" -->
<template>
  <Header></Header>
  <div class="vehiculos-view">
    <div class="box">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando vehículos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="cargarVehiculos" class="retry-btn">Reintentar</button>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Barra Superior -->
        <div class="barra-superior">
          <div class="busqueda">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar vehículo..."
              v-model="terminoBusqueda"
              @input="debounceSearch"
            >
          </div>
          <div class="filtros">
            <button
              class="filtro-btn"
              :class="{ 'activo-operativo': filtroActivo === 'OPERATIVO' }"
              @click="cambiarFiltro('OPERATIVO')"
            >
              Operativos ({{ contadorEstados.operativo }})
            </button>
            <button
              class="filtro-btn"
              :class="{ 'activo-reparacion': filtroActivo === 'REPARACION' }"
              @click="cambiarFiltro('REPARACION')"
            >
              Reparación ({{ contadorEstados.reparacion }})
            </button>
            <button
              class="filtro-btn"
              :class="{ 'activo-inactivos': filtroActivo === 'INACTIVO' }"
              @click="cambiarFiltro('INACTIVO')"
            >
              Inactivos ({{ contadorEstados.inactivo }})
            </button>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div v-if="vehiculosFiltrados.length === 0 && !loading" class="no-resultados">
          <i class="fas fa-search"></i>
          <p>No se encontraron vehículos que coincidan con tu búsqueda</p>
          <small>Intenta con otro término de búsqueda o cambia el filtro</small>
        </div>

        <!-- Lista de Vehículos -->
        <div class="vehiculos-lista">
          <div
            v-for="vehiculo in vehiculosFiltrados"
            :key="vehiculo.id"
            class="vehiculo-card"
            :class="getEstadoClass(vehiculo.estado)"
            @click="verDetalleVehiculo(vehiculo.id)"
          >
            <div class="contenido-vehiculo">
              <div class="imagen-container">
                <img
                  class="imagen-vehiculo"
                  :src="vehiculo.imagen || '/img/vehiculos/default.png'"
                  :alt="vehiculo.nombre"
                  @error="handleImageError"
                >
              </div>
              <div class="texto-vehiculo">
                <h3 v-html="resaltarTexto(vehiculo.nombre)"></h3>
                <p><strong>Placa {{ vehiculo.placa }}</strong></p>
                <p>Últ. Reparación: {{ formatearFecha(vehiculo.fecha_ultima_reparacion) }}</p>
              </div>
              <div class="costo-vehiculo">
                <span class="costo-label">{{ formatearCosto(vehiculo.costo) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <Menu></Menu>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Menu from '@/components/Menu.vue';
import Header from '@/components/Header.vue';
import { supabase } from '@/supabase'; // Importar cliente Supabase

// Estado reactivo
const vehiculos = ref([]);
const filtroActivo = ref('OPERATIVO');
const terminoBusqueda = ref('');
const loading = ref(false);
const error = ref(null);
const searchTimeout = ref(null);

// Computed properties
const vehiculosFiltrados = computed(() => {
  let resultado = vehiculos.value;

  // Filtrar por término de búsqueda
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase().trim();
    resultado = resultado.filter(vehiculo =>
      vehiculo.nombre.toLowerCase().includes(termino) ||
      vehiculo.placa.toLowerCase().includes(termino)
    );
  }

  // Filtrar por estado
  resultado = resultado.filter(vehiculo =>
    vehiculo.estado === filtroActivo.value
  );

  return resultado;
});

const contadorEstados = computed(() => {
  const contador = { operativo: 0, reparacion: 0, inactivo: 0 };
  vehiculos.value.forEach(vehiculo => {
    switch (vehiculo.estado) {
      case 'OPERATIVO':
        contador.operativo++;
        break;
      case 'REPARACION':
        contador.reparacion++;
        break;
      case 'INACTIVO':
        contador.inactivo++;
        break;
    }
  });
  return contador;
});

// Métodos
const cargarVehiculos = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Consulta a Supabase
    const { data, error: sbError } = await supabase
      .from('vehiculo')
      .select(`
        id,
        marca,
        modelo,
        ultima_reparacion,
        placa,
        estado_actual
      `)
      .order('id', { ascending: true });

    if (sbError) throw sbError;

    // Mapear datos de Supabase a estructura esperada
    vehiculos.value = data.map(vehiculo => ({
      id: vehiculo.id,
      nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
      placa: vehiculo.placa,
      fecha_ultima_reparacion: vehiculo.ultima_reparacion,
      imagen: null, // Usaremos imagen por defecto
      estado: vehiculo.estado_actual,
      costo: 0 // Valor por defecto para costo
    }));

  } catch (err) {
    console.error('Error al cargar vehículos:', err);
    error.value = 'Error al cargar los vehículos. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

const buscarVehiculos = async (termino) => {
  if (!termino.trim()) return;

  try {
    loading.value = true;

    // Búsqueda en Supabase
    const { data, error: sbError } = await supabase
      .from('vehiculo')
      .select()
      .or(`marca.ilike.%${termino}%,modelo.ilike.%${termino}%,placa.ilike.%${termino}%`)
      .eq('estado_actual', filtroActivo.value);

    if (sbError) throw sbError;

    // Mapear resultados
    vehiculos.value = data.map(vehiculo => ({
      id: vehiculo.id,
      nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
      placa: vehiculo.placa,
      fecha_ultima_reparacion: vehiculo.ultima_reparacion,
      imagen: null,
      estado: vehiculo.estado_actual,
      costo: 0
    }));

  } catch (err) {
    console.error('Error en búsqueda:', err);
  } finally {
    loading.value = false;
  }
};

const debounceSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    buscarVehiculos(terminoBusqueda.value);
  }, 300);
};

const cambiarFiltro = async (nuevoFiltro) => {
  filtroActivo.value = nuevoFiltro;
  await buscarVehiculos(terminoBusqueda.value);
};

const verDetalleVehiculo = (id) => {
  console.log('Ver detalle del vehículo:', id);
  // router.push(`/vehiculos/${id}`);
};

// Funciones de utilidad
const getEstadoClass = (estado) => {
  const clases = {
    'OPERATIVO': 'operativo',
    'REPARACION': 'reparacion',
    'INACTIVO': 'fuera-servicio'
  };
  return clases[estado] || '';
};

const formatearCosto = (costo) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(costo);
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'No disponible';

  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (err) {
    return fecha;
  }
};

const resaltarTexto = (texto) => {
  if (!terminoBusqueda.value.trim()) return texto;

  const regex = new RegExp(`(${terminoBusqueda.value.trim()})`, 'gi');
  return texto.replace(regex, '<mark>$1</mark>');
};

const handleImageError = (event) => {
  event.target.src = '/img/vehiculos/default.png';
};

// Lifecycle hooks
onMounted(() => {
  cargarVehiculos();
});
</script>

<style scoped>
/* Estados de carga y error */
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

.error-container i {
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 15px;
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

.retry-btn:hover {
  background-color: #2980b9;
}

/* Lista de vehículos */
.vehiculos-lista {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vehiculo-card {
  width: 85%;
  background-color: #2c3e50;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.vehiculo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.contenido-vehiculo {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  position: relative;
}

.imagen-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.imagen-vehiculo {
  height: 3rem;
  object-fit: cover;
  border-radius: 8px;
}

.texto-vehiculo {
  flex: 1;
  min-width: 0;
}

.costo-vehiculo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.costo-label {
  background-color: rgb(19, 154, 124);
  color: rgb(255, 255, 255);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
  border: 1px solid rgb(59, 81, 105);
}

.vehiculos-view {
  width: 345px;
  height: 650px;
  margin: 0 auto;
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #f5f5f5;
  width: 100%;
  height: 560px;
  overflow-y: auto;
}

.vehiculo-card h3 {
  margin: 0 0 5px 0;
  color: #fff;
  font-size: 1rem;
}

.vehiculo-card p {
  margin: 5px 0;
  color: #fff;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.operativo {
  border-left: 4px solid #4CAF50;
}

.reparacion {
  border-left: 4px solid #FFC107;
}

.fuera-servicio {
  border-left: 4px solid #9E9E9E;
}

.estado-label {
  color: white;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 12px;
  display: inline-block;
  margin-bottom: 5px;
}

.estado-operativo {
  background-color: #4CAF50;
}

.estado-reparacion {
  background-color: #FFC107;
  color: #333;
}

.estado-inactivo {
  background-color: #9E9E9E;
}

.no-resultados {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
}

.no-resultados i {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.no-resultados p {
  font-size: 16px;
  margin-bottom: 5px;
  color: #34495e;
}

.no-resultados small {
  font-size: 12px;
  opacity: 0.7;
}

:deep(mark) {
  background-color: #f39c12;
  color: white;
  padding: 1px 3px;
  border-radius: 3px;
  font-weight: bold;
}

/* Barra superior */
.barra-superior {
  background-color: #2c3e50;
  padding: 10px 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 86%;
  max-width: 100%;
}

.busqueda {
  display: flex;
  align-items: center;
  background-color: #2c3e50;
  border-radius: 20px;
  padding: 8px 15px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  border: 1px solid #34495e;
}

.busqueda:hover {
  background-color: #34495e;
}

.busqueda i {
  color: #ecf0f1 !important;
  margin-right: 10px;
}

.busqueda input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background-color: transparent;
  color: #ecf0f1;
}

.busqueda input::placeholder {
  color: #bdc3c7;
}

.filtros {
  display: flex;
  gap: 0.13rem;
  overflow-x: auto;
  padding-bottom: 5px;
}

.filtro-btn {
  background-color: #34495e;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 5px 12px;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filtro-btn.activo-operativo {
  background-color: #4CAF50 !important;
}

.filtro-btn.activo-reparacion {
  background-color: #FFC107 !important;
}

.filtro-btn.activo-inactivos {
  background-color: #9E9E9E !important;
}

.filtros::-webkit-scrollbar {
  height: 4px;
}

.filtros::-webkit-scrollbar-thumb {
  background: #4a5353;
  border-radius: 2px;
}

.filtro-btn:hover {
  background-color: #2c3e50;
}

.filtro-btn.activo-operativo:hover {
  background-color: #43a047 !important;
}

.filtro-btn.activo-reparacion:hover {
  background-color: #ffb300 !important;
}

.filtro-btn.activo-inactivos:hover {
  background-color: #757575 !important;
}
</style>
