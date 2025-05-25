<template>
  <Header></Header>
  <div class="vehiculos-view">
    <div class="box">
      <!-- Vehículo 1 -->
      <div class="vehiculo-card operativo">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo" src="/img/vehiculos/onix.png" alt="Nissan Sedan Azul">
          <div class="detalles-vehiculo">
            <h3>Nissan Sedan Azul</h3>
            <div class="info-vehiculo">
              <span class="placa">PFX-266</span>
              <span class="reparacion">27/03/2024</span>
            </div>
            <div class="estado-badge operativo">Operativo</div>
          </div>
        </div>
      </div>

      <!-- Vehículo 2 -->
      <div class="vehiculo-card reparacion">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo"  src="/img/vehiculos/onix.png" alt="BMW Serie 1 Azul">
          <div class="detalles-vehiculo">
            <h3>BMW Serie 1 Azul</h3>
            <div class="info-vehiculo">
              <span class="placa">MWY-666</span>
              <span class="reparacion">02/04/2024</span>
            </div>
            <div class="estado-badge reparacion">En reparación</div>
          </div>
        </div>
      </div>

      <!-- Vehículo 3 -->
      <div class="vehiculo-card fuera-servicio">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo"  src="/img/vehiculos/onix.png" alt="JEEP Grand Cherokee Gris">
          <div class="detalles-vehiculo">
            <h3>JEEP Grand Cherokee Gris</h3>
            <div class="info-vehiculo">
              <span class="placa">PFX-266</span>
              <span class="reparacion">27/03/2024</span>
            </div>
            <div class="estado-badge fuera-servicio">Fuera de servicio</div>
          </div>
        </div>
      </div>
    </div>

    <Menu></Menu>
  </div>
</template>

<script setup>
import Menu from '@/components/Menu.vue'
import Header from '@/components/Header.vue'
</script>

<style scoped>
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
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.contenido-vehiculo {
  display: flex;
  gap: 15px;
}

.imagen-vehiculo {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.detalles-vehiculo {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.info-vehiculo {
  display: flex;
  gap: 15px;
  margin: 5px 0;
}

.placa {
  color: #666;
  font-size: 14px;
}

.reparacion {
  color: #666;
  font-size: 14px;
}

.estado-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
}

.estado-badge.operativo {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.estado-badge.reparacion {
  background-color: #FFF8E1;
  color: #FF8F00;
}

.estado-badge.fuera-servicio {
  background-color: #F5F5F5;
  color: #616161;
}
</style>
