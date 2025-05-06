<template>
  <div class="header">
    <div class="numero"><p>9:30</p></div>
    <div class="Camara"></div>
    <div class="icons-box">
        <Wifi class="my-icon" />
        <div class="signal-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#080404">
            <rect x="2" y="18" width="2" height="4" />
            <rect x="6" y="16" width="2" height="6" />
            <rect x="10" y="12" width="2" height="10" />
            <rect x="14" y="8" width="2" height="14" />
        </svg>
        </div>
    <Battery class="my-icon rotated"/>

  </div>
  </div>
</template>

<script setup>
import { Wifi } from 'lucide-vue-next'; /*https://lucide.dev/ */
import { Battery } from 'lucide-vue-next';

</script>

<style>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
 }

.Camara {
  width: 12px;
  height: 12px;
  background-color: #333;
  border-radius: 50%;
  box-shadow: 0 0 2px #666;
}

.icons-box{
    display: flex;
    align-items: center;
    justify-content: center;
}
.my-icon {
  width: 20px;
  height: 20px;
  stroke: #080404;
}

.rotated {
   transform: rotate(-90deg);  
 }

.numero{
    font-family: 'Orbitron', sans-serif;
 }
</style>
