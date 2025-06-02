<!-- MenuNerudo.vue - Con Fichas de Solicitudes -->
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
              :class="{ 'activo-solicitadas': filtroActivo === 'solicitadas' }"
              @click="cambiarFiltro('solicitadas')"
            >
              Solicitud ({{ contadorEstados.solicitadas }})
            </button>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div v-if="vehiculosFiltrados.length === 0 && solicitudesFiltradas.length === 0 && !loading" class="no-resultados">
          <i class="fas fa-search"></i>
          <p>No se encontraron resultados que coincidan con tu búsqueda</p>
          <small>Intenta con otro término de búsqueda o cambia el filtro</small>
        </div>

        <!-- Lista de Vehículos (para filtros operativo y reparacion) -->
        <div v-if="filtroActivo !== 'solicitadas'" class="vehiculos-lista">
          <div
            v-for="vehiculo in vehiculosFiltrados"
            :key="vehiculo.id"
            class="vehiculo-card"
            :class="getEstadoClass(vehiculo.estado_actual)"
            @click="verDetalleVehiculo(vehiculo.id)"
          >
            <div class="contenido-vehiculo">
              <div class="imagen-container">
                <img
                  class="imagen-vehiculo"
                  :src="vehiculo.imagen || '/img/vehiculos/default.png'"
                  :alt="vehiculo.marca + ' ' + vehiculo.modelo"
                  @error="handleImageError"
                >
                <div class="costo-vehiculo">
                  <span
                    v-if="vehiculo.costoTotal > 0"
                    class="costo-label"
                  >
                    {{ formatearCosto(vehiculo.costoTotal) }}
                  </span>
                  <span
                    v-else
                    class="costo-label costo-pendiente"
                  >
                    $ Pendiente
                  </span>
                </div>
              </div>
              <div class="texto-vehiculo">
                <h3 v-html="resaltarTexto(vehiculo.marca + ' ' + vehiculo.modelo)"></h3>
                <p><strong>Placa {{ vehiculo.placa }}</strong></p>
                <p>Últ. Reparación: {{ formatearFecha(vehiculo.ultima_reparacion) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Solicitudes (para filtro solicitadas) -->
        <div v-if="filtroActivo === 'solicitadas'" class="solicitudes-lista">
          <div
            v-for="solicitud in solicitudesFiltradas"
            :key="solicitud.id"
            class="solicitud-card"
            @click="verDetalleSolicitud(solicitud.id)"
          >
            <div class="solicitud-header">
              <div class="badge-revision">
                REVISIÓN
              </div>
            </div>

            <div class="contenido-solicitud">
              <div class="info-principal">
                <div class="nombre-refaccion-container">
                  <div class="icono-refaccion">
                    <i class="fas fa-wrench"></i>
                  </div>
                  <h3 class="nombre-refaccion" v-html="resaltarTexto(solicitud.refaccion_nombre)"></h3>
                </div>
                <p class="vehiculo-relacionado">
                  <i class="fas fa-truck"></i>
                  {{ solicitud.vehiculo_info || 'Vehículo no especificado' }}
                </p>
              </div>

              <div class="info-secundaria">
                <div class="proveedor-info">
                  <i class="fas fa-store"></i>
                  <span>{{ solicitud.proveedor_nombre || 'Proveedor no especificado' }}</span>
                </div>

                <div class="fecha-costo">
                  <div class="fecha-solicitud">
                    <i class="fas fa-calendar-alt"></i>
                    <span>{{ calcularTiempoTranscurrido(solicitud.fecha_creacion) }}</span>
                  </div>
                  <div class="costo-total">
                    {{ formatearCosto(solicitud.costo_total) }}
                  </div>
                </div>
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
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue';
import Menu from '@/components/Menu.vue';
import Header from '@/components/Header.vue';
import { supabase } from '@/supabase';

// Estado reactivo
const router = useRouter()
const todosLosVehiculos = ref([]);
const todasLasSolicitudes = ref([]); // Nueva: array para solicitudes
const filtroActivo = ref('operativo');
const terminoBusqueda = ref('');
const loading = ref(false);
const error = ref(null);

// COMPUTED PROPERTIES - TODO EL FILTRADO EN FRONTEND
const vehiculosFiltrados = computed(() => {
  if (filtroActivo.value === 'solicitadas') return [];

  let vehiculosFiltradosPorBusqueda = todosLosVehiculos.value;

  // Filtrar por búsqueda si hay término
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase().trim();
    vehiculosFiltradosPorBusqueda = todosLosVehiculos.value.filter(vehiculo =>
      (vehiculo.marca + ' ' + vehiculo.modelo).toLowerCase().includes(termino) ||
      vehiculo.placa.toLowerCase().includes(termino)
    );
  }

  // Filtrar por estado
  return vehiculosFiltradosPorBusqueda.filter(vehiculo =>
    vehiculo.estado_actual === filtroActivo.value
  );
});

// Nueva computed property para solicitudes
const solicitudesFiltradas = computed(() => {
  if (filtroActivo.value !== 'solicitadas') return [];

  let solicitudesFiltradas = todasLasSolicitudes.value;

  // Filtrar por búsqueda si hay término
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase().trim();
    solicitudesFiltradas = todasLasSolicitudes.value.filter(solicitud =>
      solicitud.refaccion_nombre.toLowerCase().includes(termino) ||
      (solicitud.proveedor_nombre && solicitud.proveedor_nombre.toLowerCase().includes(termino)) ||
      (solicitud.vehiculo_info && solicitud.vehiculo_info.toLowerCase().includes(termino))
    );
  }

  return solicitudesFiltradas;
});

const contadorEstados = computed(() => {
  const contador = {
    operativo: 0,
    reparacion: 0,
    solicitadas: 0
  };

  // Filtrar por búsqueda para los contadores de vehículos
  let vehiculosParaContar = todosLosVehiculos.value;
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase().trim();
    vehiculosParaContar = todosLosVehiculos.value.filter(vehiculo =>
      (vehiculo.marca + ' ' + vehiculo.modelo).toLowerCase().includes(termino) ||
      vehiculo.placa.toLowerCase().includes(termino)
    );
  }

  // Contar vehículos por estado
  vehiculosParaContar.forEach(vehiculo => {
    if (vehiculo.estado_actual === 'operativo') contador.operativo++;
    if (vehiculo.estado_actual === 'reparacion') contador.reparacion++;
  });

  // Contar solicitudes
  contador.solicitadas = solicitudesFiltradas.value.length || todasLasSolicitudes.value.length;

  return contador;
});

// Nuevo método para cargar solicitudes
const cargarSolicitudes = async () => {
  try {
    const { data, error: sbError } = await supabase
      .from('orden_compra')
      .select(`
        *,
        refaccion:refaccion_id(
          id,
          nombre,
          descripcion
        ),
        proveedor:proveedor_id(
          id,
          nombre
        )
      `)
      .eq('estado', 'revision')
      .order('fecha_creacion', { ascending: false });

    if (sbError) throw sbError;

    // Procesar cada solicitud para obtener información del vehículo relacionado
    const solicitudesConDatos = await Promise.all(
      data.map(async (solicitud) => {
        let vehiculoInfo = null;

        // Buscar vehículo relacionado a través de reparaciones
        if (solicitud.refaccion?.id) {
          const { data: reparacionData } = await supabase
            .from('reparacion_refaccion')
            .select(`
              reparacion:reparacion_id(
                vehiculo:vehiculo_id(
                  id,
                  marca,
                  modelo,
                  placa
                )
              )
            `)
            .eq('refaccion_id', solicitud.refaccion.id)
            .limit(1);

          if (reparacionData && reparacionData.length > 0 && reparacionData[0].reparacion?.vehiculo) {
            const vehiculo = reparacionData[0].reparacion.vehiculo;
            vehiculoInfo = `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}`;
          }
        }

        return {
          ...solicitud,
          refaccion_nombre: solicitud.refaccion?.nombre || 'Refacción desconocida',
          proveedor_nombre: solicitud.proveedor?.nombre || null,
          vehiculo_info: vehiculoInfo
        };
      })
    );

    todasLasSolicitudes.value = solicitudesConDatos;
    console.log(`✅ Solicitudes cargadas: ${todasLasSolicitudes.value.length} registros`);

  } catch (err) {
    console.error('Error al cargar solicitudes:', err);
  }
};

// MÉTODO MODIFICADO - CON IMÁGENES DESDE EVIDENCIA
const cargarVehiculos = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Cargar vehículos y solicitudes en paralelo
    await Promise.all([
      cargarDatosVehiculos(),
      cargarSolicitudes()
    ]);

  } catch (err) {
    console.error('Error al cargar datos:', err);
    error.value = 'Error al cargar los datos. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

const cargarDatosVehiculos = async () => {
  // Consulta original para vehículos
  const { data, error: sbError } = await supabase
    .from('vehiculo')
    .select(`
      *,
      reparaciones:reparacion(
        id,
        refacciones:reparacion_refaccion(
          refaccion:refaccion_id(
            id,
            precio_unitario,
            nombre
          )
        ),
        evidencias:evidencia(
          id,
          tipo,
          url_archivo
        )
      )
    `)
    .order('id', { ascending: true });

  if (sbError) throw sbError;

  // Procesar cada vehículo (lógica original)
  const vehiculosConDatos = await Promise.all(
    data.map(async (vehiculo) => {
      let costoTotal = 0;
      let tieneSolicitadas = false;
      let imagenVehiculo = null;

      if (vehiculo.reparaciones) {
        for (const reparacion of vehiculo.reparaciones) {
          if (reparacion.evidencias) {
            const evidenciasConImagen = reparacion.evidencias.filter(evidencia =>
              evidencia.tipo === 'imagen' && evidencia.url_archivo
            );
            if (evidenciasConImagen.length > 0) {
              imagenVehiculo = evidenciasConImagen[0].url_archivo;
            }
          }

          if (reparacion.refacciones) {
            for (const item of reparacion.refacciones) {
              const precio = item.refaccion?.precio_unitario || 0;
              const cantidad = 1;
              costoTotal += precio * cantidad;

              if (item.refaccion?.id) {
                const { data: ordenes } = await supabase
                  .from('orden_compra')
                  .select('estado')
                  .eq('refaccion_id', item.refaccion.id)
                  .eq('estado', 'revision');

                if (ordenes && ordenes.length > 0) {
                  tieneSolicitadas = true;
                }
              }
            }
          }
        }
      }

      return {
        ...vehiculo,
        costoTotal,
        tieneSolicitadas,
        imagen: imagenVehiculo || vehiculo.imagen
      };
    })
  );

  todosLosVehiculos.value = vehiculosConDatos;
  console.log(`✅ Vehículos cargados: ${todosLosVehiculos.value.length} registros`);
};

const cambiarFiltro = (nuevoFiltro) => {
  filtroActivo.value = nuevoFiltro;
  console.log(`🔄 Filtro cambiado a: ${nuevoFiltro}`);
};

const verDetalleVehiculo = (id) => {
  router.push({ name: 'DTCONECT', params: { id } })
}

const verDetalleSolicitud = (id) => {
  // Aquí puedes implementar la navegación al detalle de la solicitud
  console.log(`Ver detalle de solicitud: ${id}`);
  // router.push({ name: 'DetalleSolicitud', params: { id } })
}

// Función para calcular tiempo transcurrido
const calcularTiempoTranscurrido = (fecha) => {
  if (!fecha) return 'Fecha no disponible';

  const ahora = new Date();
  const fechaSolicitud = new Date(fecha);
  const diferenciaMilisegundos = ahora - fechaSolicitud;
  const diasTranscurridos = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  if (diasTranscurridos === 0) return 'Hoy';
  if (diasTranscurridos === 1) return 'Hace 1 día';
  if (diasTranscurridos < 7) return `Hace ${diasTranscurridos} días`;
  if (diasTranscurridos < 30) {
    const semanas = Math.floor(diasTranscurridos / 7);
    return semanas === 1 ? 'Hace 1 semana' : `Hace ${semanas} semanas`;
  }

  const meses = Math.floor(diasTranscurridos / 30);
  return meses === 1 ? 'Hace 1 mes' : `Hace ${meses} meses`;
};

// Funciones de utilidad (las originales)
const getEstadoClass = (estado) => {
  const clases = {
    'operativo': 'operativo',
    'reparacion': 'reparacion',
    'solicitadas': 'solicitadas'
  };
  return clases[estado] || '';
};

const formatearCosto = (costo) => {
  if (!costo || costo === 0) return '$ 0';
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
/* Estilos originales */
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

/* Estilos para vehículos (originales) */
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
  gap: 8px;
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
  justify-content: center;
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

.costo-pendiente {
  background-color: #e74c3c !important;
}

/* NUEVOS ESTILOS PARA SOLICITUDES */
.solicitudes-lista {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.solicitud-card {
  width: 85%;
  background-color: #2c3e50;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid #9C27B0;
  position: relative;
}

.solicitud-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.solicitud-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;
}

.nombre-refaccion-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icono-refaccion {
  background-color: #9C27B0;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.badge-revision {
  background-color: #9C27B0;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.contenido-solicitud {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-principal {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nombre-refaccion {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.vehiculo-relacionado {
  color: #bdc3c7;
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.vehiculo-relacionado i {
  color: #9C27B0;
}

.info-secundaria {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.proveedor-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ecf0f1;
  font-size: 11px;
}

.proveedor-info i {
  color: #9C27B0;
  width: 12px;
}

.fecha-costo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fecha-solicitud {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #95a5a6;
  font-size: 10px;
}

.fecha-solicitud i {
  color: #9C27B0;
}

.costo-total {
  background-color: #9C27B0;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
}

/* Estilos originales restantes */
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

.solicitadas {
  border-left: 4px solid #9C27B0;
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

.filtro-btn.activo-solicitadas {
  background-color: #9C27B0 !important;
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

.filtro-btn.activo-solicitadas:hover {
  background-color: #7B1FA2 !important;
}
</style>
