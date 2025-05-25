<template>
  <div class="vehiculos-view">
    <!-- Barra de búsqueda y fecha -->
    <div class="search-bar">
      <input type="text" placeholder="Búsqueda..." v-model="search" />
      <input type="date" v-model="fecha" />
    </div>

    <!-- Filtros de estado -->
    <div class="estado-filtros">
      <button :class="{'activo': estado === 'operativo'}" @click="estado = 'operativo'">Operativo</button>
      <button :class="{'activo': estado === 'reparacion'}" @click="estado = 'reparacion'">En reparación</button>
      <button :class="{'activo': estado === 'fuera'}" @click="estado = 'fuera'">Fuera de servicio</button>
    </div>

    <!-- Lista de vehículos -->
    <div class="vehiculos-grid">
      <div
        v-for="vehiculo in vehiculosFiltrados"
        :key="vehiculo.placa"
        class="vehiculo-card"
        @click="$router.push(`/vehiculo/${vehiculo.placa}`)"
      >
        <div class="estado-badge" :class="vehiculo.estado">{{ vehiculo.estadoTexto }}</div>
        <img :src="vehiculo.imagen" class="imagen-vehiculo" />
        <div class="detalles">
          <p>Sedán {{ vehiculo.modelo }}</p>
          <p>Placa {{ vehiculo.placa }}</p>
          <p>Últ. reparación {{ vehiculo.reparacion }}</p>
        </div>
      </div>
    </div>

    <!-- Barra de navegación inferior -->
    <!-- <div class="bottom-nav">
      <button>🚗</button>
      <button>🔍</button>
      <button>📊</button>
    </div> -->
    <!-- importar el menu -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      fecha: '',
      estado: 'operativo',
      vehiculos: [
        {
          modelo: 'Corolla',
          placa: 'AJO-475',
          reparacion: '07/10/2025',
          estado: 'operativo',
          estadoTexto: 'Operativo',
          imagen: 'https://via.placeholder.com/100',
        },
        {
          modelo: 'BMW',
          placa: 'SPI-855',
          reparacion: '24/09/2025',
          estado: 'reparacion',
          estadoTexto: 'En reparación',
          imagen: 'https://via.placeholder.com/100',
        },
        // Agrega más vehículos...
      ],
    };
  },
  computed: {
    vehiculosFiltrados() {
      return this.vehiculos.filter((v) => v.estado === this.estado);
    },
  },
};
</script>

<style scoped>
.vehiculos-view {
  padding: 10px;
  font-family: sans-serif;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.estado-filtros {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.estado-filtros button {
  padding: 5px 10px;
  border-radius: 20px;
  border: none;
  background-color: #ddd;
}

.estado-filtros .activo {
  background-color: #a3e635;
}

.vehiculos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.vehiculo-card {
  background-color: #dc2626;
  border-radius: 10px;
  padding: 10px;
  color: white;
  position: relative;
}

.estado-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: green;
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 10px;
}

.estado-badge.reparacion {
  background: orange;
}

.estado-badge.fuera {
  background: gray;
}

.imagen-vehiculo {
  width: 100%;
  border-radius: 5px;
  margin-top: 10px;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: black;
  padding: 10px 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.bottom-nav button {
  background: none;
  color: white;
  font-size: 20px;
}
</style>
