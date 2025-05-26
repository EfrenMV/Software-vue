<template>
  <div class="detalle-vehiculo">
    <!-- Header -->
    <Header />

    <!-- Contenido principal con scroll -->
    <div class="contenido-scrollable">
      <!-- Fecha de última reparación -->
      <div class="fecha-reparacion">
        Últ reparación: <strong>14/11/2024</strong>
      </div>

      <!-- Estado del vehículo -->
      <div class="estado-badge operativo">
        <span class="circulo-verde"></span> Operativo
      </div>

      <div class="imagen-vehiculo">
        <img src="/img/vehiculos/claseG.png" alt="Mercedes Clase G" class="imagen" width="70%">
      </div>

      <!-- Información del vehículo -->
      <div class="info-vehiculo">
        <h2>Mercedes Clase G</h2>
        <h3>Placa <strong>GE-736865</strong></h3>
      </div>

      <!-- Descripción -->
      <div class="descripcion">
        <p>
          Se reemplazó el sistema de frenos ABS tras detectar una pérdida de presión en la línea principal. También se
          realizó un escaneo completo de errores y limpieza de sensores electrónicos.
        </p>
      </div>
    </div>

    <!-- Menú inferior fijo (ajustado más arriba) -->
    <div class="menu-fijo">
      <Menu />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';

const router = useRouter();
const route = useRoute();
const placaVehiculo = route.params.placa;
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
}

.estado-badge.operativo {
  background-color: #a7d782;
   font-family: 'Roboto', sans-serif;
  color: #ffffff;
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

@media (max-height: 700px) {
  .contenido-scrollable {
    padding-bottom: 50px;
  }

  .menu-fijo {
    bottom: 5px;
    height: 45px;
  }
}

.circulo-verde {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4CAF50;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
