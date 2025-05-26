<template>
  <Header></Header>
  <div class="vehiculos-view">
    <div class="box">

      <!--  Barra Superior -->
      <div class="barra-superior">
        <div class="busqueda">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Buscar...">
        </div>
        <div class="filtros">
          <button class="filtro-btn" :class="{ 'activo-operativo': filtroActivo === 'Operativos' }"
            @click="filtroActivo = 'Operativos'">
            Operativos
          </button>
          <button class="filtro-btn" :class="{ 'activo-reparacion': filtroActivo === 'Reparación' }"
            @click="filtroActivo = 'Reparación'">
            Reparación
          </button>
          <button class="filtro-btn" :class="{ 'activo-inactivos': filtroActivo === 'Inactivos' }"
            @click="filtroActivo = 'Inactivos'">
            Inactivos
          </button>
        </div>
      </div>

      <!-- Vehículos dinámicos -->
      <div v-for="vehiculo in vehiculosFiltrados" :key="vehiculo.id" class="vehiculo-card" :class="vehiculo.estado">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo" :src="vehiculo.imagen" :alt="vehiculo.nombre">
          <div class="texto-vehiculo">
            <div v-if="vehiculo.tieneLabel" class="estado-label">Fuera de Servicio</div>
            <h3>{{ vehiculo.nombre }}</h3>
            <p><strong>Placa {{ vehiculo.placa }}</strong></p>
            <p>Ult Reparación: {{ vehiculo.ultReparacion }}</p>
          </div>
        </div>
      </div>
    </div>

    <Menu></Menu>
  </div>
</template>



<script setup>
  import { ref, computed } from 'vue';
  import Menu from '@/components/Menu.vue';
  import Header from '@/components/Header.vue';

  const filtroActivo = ref('Operativos'); // Filtro inicial

  // Array con todos los vehículos (convertidos a datos dinámicos)
  const vehiculos = ref([
    {
      id: 1,
      nombre: "BMW Z4 coupe",
      placa: "M-QB-1180",
      ultReparacion: "16-02-2023",
      imagen: "/img/vehiculos/z4.png",
      estado: "operativo"
    },
    {
      id: 2,
      nombre: "Mercedez CLE coupe",
      placa: "S-CL-2362",
      ultReparacion: "15-06-2022",
      imagen: "/img/vehiculos/CLE_coupe.png",
      estado: "operativo"
    },
    {
      id: 3,
      nombre: "Nissan Sedan Azul",
      placa: "PFX-266",
      ultReparacion: "27-03-2024",
      imagen: "/img/vehiculos/onix.png",
      estado: "operativo"
    },
    {
      id: 4,
      nombre: "BMW Serie 1 Azul",
      placa: "MWY-666",
      ultReparacion: "02-04-2024",
      imagen: "/img/vehiculos/bmw.png",
      estado: "reparacion"
    },
    {
      id: 5,
      nombre: "Mercedez clase G",
      placa: "GE-736-865",
      ultReparacion: "27-03-2024",
      imagen: "/img/vehiculos/clase_g.png",
      estado: "fuera-servicio",
      tieneLabel: true // Este es para mostrar "Fuera de Servicio", solo lo integre en este, los demas tienen la barra
    },
    {
      id: 6,
      nombre: "Ford Mustang",
      placa: "MNN-777",
      ultReparacion: "27-03-2024",
      imagen: "/img/vehiculos/mustang.png",
      estado: "fuera-servicio"
    }
  ]);

  // Filtrado reactivo
  const vehiculosFiltrados = computed(() => {
    return vehiculos.value.filter(vehiculo => {
      if (filtroActivo.value === 'Operativos') return vehiculo.estado === 'operativo';
      if (filtroActivo.value === 'Reparación') return vehiculo.estado === 'reparacion';
      if (filtroActivo.value === 'Inactivos') return vehiculo.estado === 'fuera-servicio';
      return true; // Si no hay filtro (opcional)
    });
  });
</script>





<style scoped>
  .contenido-vehiculo {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .imagen-vehiculo {
    height: 3rem;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .texto-vehiculo {
    flex: 1;
  }


  .estado-label {
    margin-bottom: 5px;
  }

  .vehiculos-view {
    width: 345px;
    height: 650px;
    margin: 0 auto;
  }

  .box {
    width: 100%;
    height: 560px;
    overflow-y: auto;
    padding: 15px;
    background-color: #f5f5f5;
  }

  .vehiculo-card {
    width: 85%;
    background-color: #2c3e50;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    right: 0rem;
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
    background-color: #9E9E9E;
    color: white;
    padding: 3px 10px;
    border-radius: 15px;
    font-size: 12px;
    display: inline-block;
  }

  /* ////////////////////////////////// */
  /* Iniciamos la barra superior */

  .barra-superior {
    background-color: #2c3e50;
    padding: 10px 15px;
    border-radius: 10px;
    margin-bottom: 15px;
    position: sticky;
    top: 0;
    z-index: 10;
    width: 90%;
    max-width: 100%;
  }

  .busqueda {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 20px;
    padding: 8px 15px;
    margin-bottom: 10px;
  }

  .busqueda i {
    color: #7f8c8d;
    margin-right: 10px;
  }

  .busqueda input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
  }

  /* Apartir de aqui comenzamos el estilis¿zado de los botones  */

  .filtros {
    display: flex;
    gap: 1.4rem;
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

  /* ////////////////////////////////////// */
  /* Apartir de aqui agregamos estilo a la barra de busqueda */

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
</style>
