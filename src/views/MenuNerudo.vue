<template>
  <Header></Header>
  <div class="vehiculos-view">
    <div class="box">
      <!-- Vehículo 1 -->
      <div class="vehiculo-card operativo">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo" src="/img/vehiculos/onix.png" alt="Nissan Sedan Azul">
          <div class="texto-vehiculo">
            <h3>Nissan Sedan Azul</h3>
            <p><strong>Placa PFX-266</strong></p>
            <p>Ult Reparación: 27-03-2024</p>
          </div>
        </div>
      </div>

      <!-- Vehículo 2 -->
      <div class="vehiculo-card reparacion">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo" src="/img/vehiculos/onix.png" alt="BMW Serie 1 Azul">
          <div class="texto-vehiculo">
            <h3>BMW Serie 1 Azul</h3>
            <p><strong>Placa MWY-666</strong></p>
            <p>Ult Reparación: 02-04-2024</p>
          </div>
        </div>
      </div>

      <!-- Vehículo 3 -->
      <div class="vehiculo-card fuera-servicio">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo" src="/img/vehiculos/onix.png" alt="JEEP Grand Cherokee Gris">
          <div class="texto-vehiculo">
            <div class="estado-label">Fuera de Servicio</div>
            <h3>JEEP Grand Cherokee Gris</h3>
            <p><strong>Placa PFX-266</strong></p>
            <p>Ult Reparación: 27-03-2024</p>
          </div>
        </div>
      </div>

       <!-- Vehículo 3 -->
      <div class="vehiculo-card fuera-servicio">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo" src="/img/vehiculos/onix.png" alt="JEEP Grand Cherokee Gris">
          <div class="texto-vehiculo">
            <div class="estado-label">Fuera de Servicio</div>
            <h3>JEEP Grand Cherokee Gris</h3>
            <p><strong>Placa PFX-266</strong></p>
            <p>Ult Reparación: 27-03-2024</p>
          </div>
        </div>
      </div>

      <!-- Vehículo 4 -->
      <div class="vehiculo-card fuera-servicio">
        <div class="contenido-vehiculo">
          <img class="imagen-vehiculo" src="/img/vehiculos/onix.png" alt="Ford Mustang">
          <div class="texto-vehiculo">
            <h3>Ford Mustang</h3>
            <p><strong>Placa MNN-777</strong></p>
            <p>Ult Reparación: 27-03-2024</p>
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


.contenido-vehiculo {
  display: flex;
  gap: 15px;
  align-items: center;

}

.imagen-vehiculo {
   height: 3rem ;
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
  background-color: #2c3e50;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.vehiculo-card h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.vehiculo-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
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
</style>
