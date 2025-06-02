<!-- Hotwhe Final. Optimizado - Solo campos necesarios -->
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
              :class="{ 'activo-operativo': filtroActivo === 'operativo' }"
              @click="cambiarFiltro('operativo')"
            >
              Operativos ({{ contadorEstados.operativo }})
            </button>
            <button
              class="filtro-btn"
              :class="{ 'activo-reparacion': filtroActivo === 'reparacion' }"
              @click="cambiarFiltro('reparacion')"
            >
              Reparación ({{ contadorEstados.reparacion }})
            </button>
            <button
              class="filtro-btn"
              :class="{ 'activo-inactivos': filtroActivo === 'fuera_servicio' }"
              @click="cambiarFiltro('fuera_servicio')"
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

        <div class="vehiculos-lista">
          <div
            v-for="vehiculo in vehiculosFiltrados"
            :key="vehiculo.id"
            class="vehiculo-card"
            :class="getEstadoClass(vehiculo.estado_actual)"
            @click="verDetalleVehiculo(vehiculo.id)"
          >
            <div class="contenido-vehiculo">
              <div class="imagen-container">
                <div class="estado-label" :class="getEstadoLabelClass(vehiculo.estado_actual)">
                  {{ getEstadoLabel(vehiculo.estado_actual) }}
                </div>
                <img
                  class="imagen-vehiculo"
                  :src="vehiculo.imagen || '/img/vehiculos/default.png'"
                  :alt="vehiculo.marca + ' ' + vehiculo.modelo"
                  @error="handleImageError"
                >
              </div>
              <div class="texto-vehiculo">
                <h3 v-html="resaltarTexto(vehiculo.marca + ' ' + vehiculo.modelo)"></h3>
                <p><strong>Placa {{ vehiculo.placa }}</strong></p>
                <p>Últ. Reparación: {{ formatearFecha(vehiculo.ultima_reparacion) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Botón flotante de gráficas -->
   <RouterLink to="/graficas">
    <button class="boton-flotante">
    <i class="fas fa-chart-line"></i>
    </button>
    </RouterLink>

    <Menu></Menu>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue';
import Menu from '@/components/Menu.vue';
import Header from '@/components/Header.vue';
import { supabase } from '@/supabase';

// Estado reactivo
const router = useRouter()
const todosLosVehiculos = ref([]);
const vehiculos = ref([]);
const filtroActivo = ref('operativo');
const terminoBusqueda = ref('');
const loading = ref(false);
const error = ref(null);
const searchTimeout = ref(null);

// Campos específicos que necesitamos (evita SELECT *)
const camposNecesarios = 'id, marca, modelo, placa, estado_actual, imagen, ultima_reparacion';

// Computed properties
const vehiculosFiltrados = computed(() => {
  return vehiculos.value.filter(vehiculo =>
    vehiculo.estado_actual === filtroActivo.value
  );
});

const contadorEstados = computed(() => {
  const contador = {
    operativo: 0,
    reparacion: 0,
    inactivo: 0
  };

  // Usar todosLosVehiculos para contar, pero aplicar filtro de búsqueda si existe
  let vehiculosParaContar = todosLosVehiculos.value;

  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase().trim();
    vehiculosParaContar = vehiculosParaContar.filter(vehiculo =>
      (vehiculo.marca + ' ' + vehiculo.modelo).toLowerCase().includes(termino) ||
      vehiculo.placa.toLowerCase().includes(termino)
    );
  }

  vehiculosParaContar.forEach(vehiculo => {
    if (vehiculo.estado_actual === 'operativo') contador.operativo++;
    if (vehiculo.estado_actual === 'reparacion') contador.reparacion++;
    if (vehiculo.estado_actual === 'fuera_servicio') contador.inactivo++;
  });

  return contador;
});

// Métodos optimizados
const cargarVehiculos = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Consulta optimizada - solo campos necesarios
    const { data, error: sbError } = await supabase
      .from('vehiculo')
      .select(camposNecesarios)
      .order('id', { ascending: true });

    if (sbError) throw sbError;

    // Guardar en ambos arrays
    todosLosVehiculos.value = data; // Para contadores
    vehiculos.value = data; // Para mostrar

  } catch (err) {
    console.error('Error al cargar vehículos:', err);
    error.value = 'Error al cargar los vehículos. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

const buscarVehiculos = async () => {
  try {
    loading.value = true;

    if (terminoBusqueda.value.trim()) {
      // Consulta optimizada con campos específicos
      const { data, error: sbError } = await supabase
        .from('vehiculo')
        .select(camposNecesarios)
        .or(`marca.ilike.%${terminoBusqueda.value}%,modelo.ilike.%${terminoBusqueda.value}%,placa.ilike.%${terminoBusqueda.value}%`)
        .order('id', { ascending: true });

      if (sbError) throw sbError;

      vehiculos.value = data;
    } else {
      // Si no hay búsqueda, mostrar todos los cargados
      vehiculos.value = todosLosVehiculos.value;
    }

  } catch (err) {
    console.error('Error en búsqueda:', err);
  } finally {
    loading.value = false;
  }
};

const debounceSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    buscarVehiculos();
  }, 300);
};

const cambiarFiltro = (nuevoFiltro) => {
  filtroActivo.value = nuevoFiltro;
};

const verDetalleVehiculo = (id) => {
  router.push({ name: 'DTCONECT', params: { id } })
}

const abrirGraficas = () => {
  router.push({ name: 'graficas' });
};

// Funciones de utilidad
const getEstadoClass = (estado) => {
  const clases = {
    'operativo': 'operativo',
    'reparacion': 'reparacion',
    'fuera_servicio': 'fuera-servicio'
  };
  return clases[estado] || '';
};

const getEstadoLabel = (estado) => {
  const labels = {
    'operativo': 'Operativo',
    'reparacion': 'En Reparación',
    'fuera_servicio': 'Fuera de Servicio'
  };
  return labels[estado] || estado;
};

const getEstadoLabelClass = (estado) => {
  const clases = {
    'operativo': 'estado-operativo',
    'reparacion': 'estado-reparacion',
    'fuera_servicio': 'estado-inactivo'
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

.vehiculos-lista {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  max-width: 100%;
}

.vehiculo-card {
  background-color: #2c3e50;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-width: 0;
  overflow: hidden;
}

.vehiculo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.contenido-vehiculo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.imagen-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.imagen-vehiculo {
  width: 100%;
  height: auto;
  max-height: 80px;
  object-fit: contain;
  border-radius: 8px;
}

.estado-label {
  color: white;
  padding: 2px 8px;
  border-radius: 15px;
  font-size: 10px;
  font-weight: bold;
  align-self: flex-start;
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

.texto-vehiculo {
  flex: 1;
  min-width: 0;
}

.vehiculo-card h3 {
  margin: 0 0 5px 0;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.vehiculo-card p {
  margin: 3px 0;
  color: #fff;
  font-size: 10px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

.no-resultados {
  grid-column: span 2;
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
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
  position: sticky;
  top: 0;
  z-index: 10;
  width: calc(100% - 20px);
  max-width: 100%;
  margin: 0 10px 15px 10px;
  box-sizing: border-box;
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

/* Botón flotante */
.boton-flotante {
  position: absolute;
  bottom: 110px; /* Encima del menú, dentro del contenedor */
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.boton-flotante:hover {
  background-color: #333;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.boton-flotante:active {
  transform: scale(0.95);
}

.vehiculos-view {
  width: 345px;
  height: 650px;
  margin: 0 auto;
  overflow-x: hidden;
  position: relative;
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
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>
