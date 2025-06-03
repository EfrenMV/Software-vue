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
        <div class="titulo-principal">
          <h2>🛒 Orden de Compra #{{ orden.id }}</h2>
        </div>
        
        <!-- Estatus separado -->
        <div class="estado-separado">
          <span class="etiqueta-estado" :class="getEstadoClass(orden.estado)">
            {{ orden.estado || 'Pendiente' }}
          </span>
        </div>

        <!-- Info de la orden -->
        <div class="info-orden">
          <div class="orden-header">
            <h3>💼 Información de la Orden</h3>
          </div>
          <div class="datos-orden">
            <div class="dato-item">
              <span class="icono">💰</span>
              <div class="dato-contenido">
                <p class="label">Costo Total</p>
                <p class="value precio">${{ orden.costo_total || '0' }}</p>
              </div>
            </div>
            <div class="dato-item">
              <span class="icono">📅</span>
              <div class="dato-contenido">
                <p class="label">Fecha</p>
                <p class="value">{{ formatearFecha(orden.fecha_creacion) }}</p>
              </div>
            </div>
            <div v-if="orden.observaciones" class="dato-item">
              <span class="icono">📝</span>
              <div class="dato-contenido">
                <p class="label">Observaciones</p>
                <p class="value">{{ orden.observaciones }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Info del vehículo PRINCIPAL -->
        <div v-if="vehiculo.marca && vehiculo.modelo" class="info-auto">
          <div class="auto-header">
            <h3>🚙 Vehículo Asignado</h3>
          </div>
          <div class="auto-contenido">
            <div class="imagen-container">
              <img :src="getImagenVehiculo(vehiculo.marca)" :alt="vehiculo.marca" class="imagen-auto" />
            </div>
            <div class="datos-vehiculo">
              <p class="vehiculo-nombre">🚗 {{ vehiculo.nombre_completo || (vehiculo.marca + ' ' + vehiculo.modelo) }}</p>
              <p class="placa-info">🆔 Placa: {{ vehiculo.placa }}</p>
              <p class="serie-info">🔢 No. Serie: {{ vehiculo.numero_serie }}</p>
              <p class="estado-info">
                📊 Estado: 
                <span class="estado-badge" :class="getEstadoClass(vehiculo.estado_actual)">
                  {{ getEstadoLabel(vehiculo.estado_actual) }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- Mensaje si no hay vehículo -->
        <div v-else class="info-auto-vacio">
          <div class="vacio-contenido">
            <span class="icono-grande">⚠️</span>
            <p>No se pudo cargar la información del vehículo</p>
          </div>
        </div>

        <!-- Info adicional (simplificada) -->
        <div class="info-adicional">
          <div class="adicional-header">
            <h3>📋 Información Adicional</h3>
          </div>
          <div class="adicional-contenido">
            <div class="info-item">
              <span class="icono">🏢</span>
              <span>Proveedor: {{ proveedor.nombre }}</span>
            </div>
            <div class="info-item">
              <span class="icono">🔧</span>
              <span>Refacción: {{ refaccion.nombre }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte simplificado -->
      <div class="reporte">
        <div class="reporte-header">
          <h3>📋 Notas de la Orden</h3>
        </div>
        <div class="detalle-reparacion">
          <div class="reporte-item">
            <span class="reporte-icono">🔍</span>
            <div class="reporte-contenido">
              <p class="reporte-label">Estado del Vehículo</p>
              <p class="reporte-value">{{ getEstadoLabel(vehiculo.estado_actual) || 'No disponible' }}</p>
            </div>
          </div>
          
          <div class="reporte-item">
            <span class="reporte-icono">📝</span>
            <div class="reporte-contenido">
              <p class="reporte-label">Observaciones de la Orden</p>
              <p class="reporte-value">{{ orden.observaciones || 'Sin observaciones adicionales' }}</p>
            </div>
          </div>
          
          <div class="reporte-item">
            <span class="reporte-icono">💰</span>
            <div class="reporte-contenido">
              <p class="reporte-label">Monto Total</p>
              <p class="reporte-value precio">${{ orden.costo_total || '0' }}</p>
            </div>
          </div>
          
          <div class="reporte-item">
            <span class="reporte-icono">📅</span>
            <div class="reporte-contenido">
              <p class="reporte-label">Fecha de Creación</p>
              <p class="reporte-value">{{ formatearFecha(orden.fecha_creacion) }}</p>
            </div>
          </div>
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
    :titulo="boton === 'aprobado' ? '¡Orden Aprobada!' : '¡Orden Rechazada!'"
    :mensaje="(boton === 'aprobado'
        ? `La orden de compra fue aprobada exitosamente. Se ha creado una nueva reparación en curso para el vehículo ${vehiculo.marca} ${vehiculo.modelo}.`
        : `La orden de compra fue rechazada. No se realizarán cambios en el vehículo ${vehiculo.marca} ${vehiculo.modelo}.`) + 
        `\n\n\nRedirigiendo al menú principal en ${tiempoRestante} segundos...`"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

// Datos del backend - NUEVAS VARIABLES
const orden = ref({})
const proveedor = ref({})
const refaccion = ref({})

// Datos del backend - EXISTENTES
const vehiculo = ref({})
const reparacion = ref({})
const mecanico = ref({})

const router = useRouter()
const route = useRoute()

// Función para cargar datos con la nueva consulta simplificada
const cargarDatos = async () => {
  try {
    loading.value = true
    error.value = null

    const ordenId = route.params.id // ← PRUEBA CON DIFERENTES IDs QUE TENGAN VEHICULOS DISTINTOS

    console.log('🔧 Consultando orden con vehículo ID:', ordenId)

    // También agregar query para verificar qué vehículos están disponibles
    console.log('📋 Verificando vehículos disponibles en la BD...')
    const { data: vehiculosDisponibles } = await supabase
      .from('vehiculo')
      .select('id, marca, modelo, placa')
      .limit(5)
    
    console.log('🚗 Vehículos en la base de datos:', vehiculosDisponibles)

    // También verificar qué órdenes están asignadas a qué vehículos
    const { data: ordenesVehiculos } = await supabase
      .from('orden_compra')
      .select('id, vehiculo_id')
      .limit(10)
    
    console.log('📊 Mapeo orden → vehículo:', ordenesVehiculos)

    // CONSULTA SIMPLIFICADA: orden_compra + vehículo
    const { data: ordenData, error: ordenError } = await supabase
      .from('orden_compra')
      .select(`
        id,
        fecha_creacion,
        estado,
        costo_total,
        observaciones,
        vehiculo:vehiculo_id (
          id,
          marca,
          modelo,
          placa,
          numero_serie,
          estado_actual
        )
      `)
      .eq('id', ordenId)
      .single()

    console.log('📦 Datos de orden completa:', ordenData)

    if (ordenError) {
      throw new Error(`Error consulta orden: ${ordenError.message}`)
    }

    if (!ordenData) {
      throw new Error(`No existe orden con ID ${ordenId}`)
    }

    // Asignar datos a las variables reactivas
    orden.value = ordenData
    vehiculo.value = ordenData.vehiculo || {}
    
    // DEBUG: Verificar datos del vehículo
    console.log('🚗 Datos del vehículo cargados:', vehiculo.value)
    console.log('🚗 Marca:', vehiculo.value.marca)
    console.log('🚗 Modelo:', vehiculo.value.modelo)
    console.log('🚗 Placa:', vehiculo.value.placa)
    console.log('🚗 ID del vehículo:', vehiculo.value.id)
    
    // Crear nombre completo del vehículo
    if (vehiculo.value.marca && vehiculo.value.modelo) {
      vehiculo.value.nombre_completo = `${vehiculo.value.marca} ${vehiculo.value.modelo}`
      console.log('🚗 Nombre completo creado:', vehiculo.value.nombre_completo)
    }

    // Datos mock para campos que no están en esta consulta
    proveedor.value = { nombre: 'Proveedor no especificado' }
    refaccion.value = { 
      nombre: 'Refacción no especificada',
      descripcion: 'Información no disponible en esta consulta',
      precio_unitario: 0,
      cantidad_disponible: 0,
      status: 'pendiente'
    }
    reparacion.value = { 
      diagnostico: 'Información no disponible',
      procedimiento: 'Pendiente',
      notas: 'Sin notas',
      kilometraje: 'N/A'
    }
    mecanico.value = { 
      nombre: 'Sin asignar',
      apellido_paterno: ''
    }

    console.log('✅ Carga completa exitosa!')

  } catch (err) {
    console.error('💥 Error completo:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Funciones de utilidad
const getEstadoClass = (estado) => {
  const clases = {
    'pendiente': 'estado-pendiente',
    'aprobado': 'estado-operativo',
    'rechazado': 'estado-inactivo',
    'completado': 'estado-operativo',
    'operativo': 'estado-operativo',
    'reparacion': 'estado-reparacion', 
    'inactivo': 'estado-inactivo'
  }
  return clases[estado] || 'estado-pendiente'
}

const getStatusRefaccionClass = (status) => {
  const clases = {
    'disponible': 'refaccion-disponible',
    'agotado': 'refaccion-agotado',
    'pedido': 'refaccion-pedido',
    'defectuoso': 'refaccion-defectuoso'
  }
  return clases[status] || 'refaccion-disponible'
}

// Función para obtener imagen dinámica del vehículo
const getImagenVehiculo = (marca) => {
  if (!marca) return '/src/components/icons/default-car.png'
  
  const marcaLower = marca.toLowerCase()
  console.log('🚗 Marca del vehículo:', marca, 'Marca procesada:', marcaLower)
  
  // Mapeo de marcas a imágenes
  const imagenes = {
    'bmw': '/src/components/icons/bmw.png',
    'audi': '/src/components/icons/audi.png',
    'mercedes': '/src/components/icons/mercedes.png',
    'volkswagen': '/src/components/icons/volkswagen.png',
    'toyota': '/src/components/icons/toyota.png',
    'ford': '/src/components/icons/ford.png',
    'chevrolet': '/src/components/icons/chevrolet.png',
    'nissan': '/src/components/icons/nissan.png',
    'honda': '/src/components/icons/honda.png'
  }
  
  return imagenes[marcaLower] || '/src/components/icons/default-car.png'
}

const getEstadoLabel = (estado) => {
  const labels = {
    'operativo': 'Operativo',
    'reparacion': 'En Reparación',
    'inactivo': 'Fuera de Servicio',
    'pendiente': 'Pendiente',
    'aprobado': 'Aprobado',
    'rechazado': 'Rechazado'
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
const tiempoRestante = ref(5) // Contador para el modal
const contadorInterval = ref(null) // Referencia para limpiar el interval

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
      tiempoRestante.value = 5

      // Contador regresivo visual
      contadorInterval.value = setInterval(() => {
        tiempoRestante.value--
        if (tiempoRestante.value <= 0) {
          clearInterval(contadorInterval.value)
          router.push({ name: 'MenuNerudo' }) // Cambiar por el nombre correcto de tu ruta
        }
      }, 1000)

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
    console.log('💾 Iniciando proceso de guardado...')
    console.log('🎯 Decisión seleccionada:', boton.value)
    console.log('📦 Datos de la orden:', orden.value)
    console.log('🚗 Datos del vehículo:', vehiculo.value)

    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'))
    const fechaActual = new Date().toISOString()

    if (boton.value === 'aprobado') {
      // ✅ LÓGICA DE APROBACIÓN
      console.log('✅ Procesando APROBACIÓN...')

      // 1. Actualizar orden de compra - PROBANDO DIFERENTES VALORES
      console.log('📝 Actualizando orden de compra...')
      
      // Intentar con "aprobada" primero (valor más probable)
      let estadoAprobado = 'aprobada'
      let { error: errorOrden } = await supabase
        .from('orden_compra')
        .update({
          estado: estadoAprobado
        })
        .eq('id', orden.value.id)

      // Si falla, intentar con otros valores posibles
      if (errorOrden && errorOrden.message.includes('invalid input value for enum')) {
        console.log('⚠️ "aprobada" no es válido, intentando "completa"...')
        estadoAprobado = 'completa'
        const resultado2 = await supabase
          .from('orden_compra')
          .update({
            estado: estadoAprobado
          })
          .eq('id', orden.value.id)
        errorOrden = resultado2.error
      }

      if (errorOrden && errorOrden.message.includes('invalid input value for enum')) {
        console.log('⚠️ "completa" no es válido, intentando "finalizada"...')
        estadoAprobado = 'finalizada'
        const resultado3 = await supabase
          .from('orden_compra')
          .update({
            estado: estadoAprobado
          })
          .eq('id', orden.value.id)
        errorOrden = resultado3.error
      }

      if (errorOrden) {
        console.error('❌ Error al actualizar orden con todos los valores probados:', errorOrden)
        throw new Error(`Error al actualizar orden: ${errorOrden.message}. Valores probados: aprobada, completa, finalizada`)
      }

      console.log(`✅ Orden actualizada a "${estadoAprobado}"`)

      // 2. Crear nueva reparación con status "en_curso"
      console.log('🔧 Creando nueva reparación...')
      const nuevaReparacion = {
        fecha: fechaActual,
        vehiculo_id: vehiculo.value.id,
        tipo: 'correctivo', // Puedes ajustar esto según tu lógica
        status: 'en_curso',
        mecanico_id: usuarioLogueado?.id || 1, // ID del usuario logueado
        hora_inicio: fechaActual,
        hora_termino: null,
        ultima_reparacion: fechaActual,
        proximo_servicio: null,
        no_economico: vehiculo.value.id?.toString() || '1',
        horometro: null,
        odometro: null,
        diagnostico: `Reparación iniciada por aprobación de orden de compra #${orden.value.id}`,
        procedimiento: 'Pendiente de ejecución',
        notas: `Orden de compra aprobada el ${new Date().toLocaleDateString('es-ES')}`
      }

      const { data: reparacionCreada, error: errorReparacion } = await supabase
        .from('reparacion')
        .insert([nuevaReparacion])
        .select()
        .single()

      if (errorReparacion) {
        console.error('❌ Error al crear reparación:', errorReparacion)
        throw new Error(`Error al crear reparación: ${errorReparacion.message}`)
      }

      console.log('✅ Reparación creada:', reparacionCreada)

      // 3. Actualizar estado del vehículo a "reparacion"
      console.log('🚗 Actualizando estado del vehículo...')
      const { error: errorVehiculo } = await supabase
        .from('vehiculo')
        .update({
          estado_actual: 'reparacion',
          ultima_reparacion: fechaActual
        })
        .eq('id', vehiculo.value.id)

      if (errorVehiculo) {
        console.error('❌ Error al actualizar vehículo:', errorVehiculo)
        throw new Error(`Error al actualizar vehículo: ${errorVehiculo.message}`)
      }

      console.log('✅ Vehículo actualizado a estado reparación')
      console.log('🎉 APROBACIÓN completada exitosamente!')

      // Actualizar UI local
      orden.value.estado = estadoAprobado
      vehiculo.value.estado_actual = 'reparacion'

    } else if (boton.value === 'rechazado') {
      // ❌ LÓGICA DE RECHAZO
      console.log('❌ Procesando RECHAZO...')

      // Solo actualizar orden de compra a "rechazada"
      const { error: errorOrden } = await supabase
        .from('orden_compra')
        .update({
          estado: 'rechazada'
        })
        .eq('id', orden.value.id)

      if (errorOrden) {
        console.error('❌ Error al rechazar orden:', errorOrden)
        throw new Error(`Error al rechazar orden: ${errorOrden.message}`)
      }

      console.log('✅ Orden actualizada a rechazada')
      console.log('🎉 RECHAZO procesado exitosamente!')

      // Actualizar UI local
      orden.value.estado = 'rechazada'
    }

    console.log('💾 Decisión guardada exitosamente en la base de datos')

  } catch (err) {
    console.error('💥 Error completo al guardar decisión:', err)
    error.value = `Error al guardar la decisión: ${err.message}`
    
    // Resetear el slider en caso de error
    deslizado.value = false
    thumbX.value = 0
    boton.value = null
  }
}

// Lifecycle
onMounted(() => {
  cargarDatos()
})

// Limpiar intervalos al salir del componente
onUnmounted(() => {
  if (contadorInterval.value) {
    clearInterval(contadorInterval.value)
    console.log('🧹 Interval limpiado al salir del componente')
  }
})

// Exportar variables reactivas para el template
// (Vue Composition API las exporta automáticamente, pero por claridad)
console.log('📋 Variables exportadas:', { 
  mostrarModal, 
  boton, 
  loading, 
  error, 
  orden, 
  vehiculo, 
  tiempoRestante 
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
  background-color: #2c3e50;
  border-radius: 10px;
  margin: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #34495e;
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

.loading-container p, .error-container p {
  color: white;
  font-size: 14px;
}

.retry-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background-color: #2980b9;
}

/* Asegurar que todo el contenido sea visible */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Resto de estilos existentes */
.contenedor-reporte {
  padding: 20px;
  padding-bottom: 100px; /* Espacio extra para el menú inferior */
  max-width: 480px;
  margin: 0 auto;
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  /* Permitir scroll */
  overflow-y: auto;
  max-height: 100vh;
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
.estado-pendiente { background-color: #8b5cf6; color: white; }

/* NUEVOS ESTILOS PARA ORDEN Y REFACCIÓN */
.info-orden, .info-refaccion {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.info-orden h3, .info-refaccion h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.datos-orden p {
  margin: 6px 0;
  font-size: 14px;
  color: #374151;
}

.info-refaccion p {
  margin: 6px 0;
  font-size: 14px;
  color: #374151;
}

.info-auto-vacio {
  background-color: #fef3c7;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  color: #92400e;
  font-weight: 500;
}

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
  padding: 20px;
}

.botones button {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 28px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.inactivo {
  background-color: #95a5a6;
  color: white;
}

.activo-verde {
  background-color: #2ecc71;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(46, 204, 113, 0.3);
}

.activo-rojo {
  background-color: #e74c3c;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
}

.slider-container {
  margin-top: 16px;
  padding: 0 20px;
}

.slider {
  position: relative;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  user-select: none;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.slider-verde {
  background-color: #2ecc71;
}

.slider-rojo {
  background-color: #e74c3c;
}

.slider-thumb {
  position: absolute;
  top: 6px;
  left: 6px;
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.thumb-verde {
  color: #2ecc71;
}

.thumb-rojo {
  color: #e74c3c;
}

.deslizado-exito {
  background-color: #27ae60 !important;
}

.deslizado-rechazo {
  background-color: #c0392b !important;
}

.deslizado-exito .slider-thumb,
.deslizado-rechazo .slider-thumb {
  background-color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.reporte-value.precio {
  color: #00b894;
  font-size: 16px;
  font-weight: bold;
}

/* Responsividad y scroll para móviles */
@media (max-width: 480px) {
  .contenedor-reporte {
    padding: 15px;
    padding-bottom: 120px;
    gap: 12px;
    max-height: 100vh;
    overflow-y: auto;
  }
  
  .titulo-principal {
    padding: 16px;
  }
  
  .titulo-principal h2 {
    font-size: 18px;
  }
  
  .estado-separado {
    margin: -6px 0 6px 0;
  }
  
  .etiqueta-estado {
    font-size: 11px;
    padding: 6px 14px;
  }
  
  .orden-header, .auto-header, .reporte-header, .adicional-header {
    padding: 12px 16px;
  }
  
  .orden-header h3, .auto-header h3, .reporte-header h3, .adicional-header h3 {
    font-size: 14px;
  }
  
  .datos-orden, .auto-contenido, .detalle-reparacion, .adicional-contenido {
    padding: 16px;
  }
  
  .auto-contenido {
    gap: 16px;
  }
  
  .imagen-auto {
    width: 80px;
    height: 80px;
    padding: 8px;
  }
  
  .vehiculo-nombre {
    font-size: 16px;
  }
  
  .placa-info, .serie-info, .estado-info {
    font-size: 13px;
  }
  
  .estado-badge {
    font-size: 10px;
    padding: 3px 6px;
  }
  
  .botones {
    margin: 15px 0;
    gap: 30px;
    padding: 16px;
  }
  
  .botones button {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
  
  .slider {
    height: 56px;
  }
  
  .slider-thumb {
    width: 44px;
    height: 44px;
    top: 6px;
    left: 6px;
  }
  
  .dato-item, .reporte-item, .info-item {
    padding: 10px 12px;
  }
  
  .dato-item .icono, .reporte-icono, .info-item .icono {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .loading-container, .error-container {
    margin: 15px;
    height: 250px;
  }
}
</style>