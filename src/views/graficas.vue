<template>
   <Header></Header>
  <div class="ejemploMenu">
  <div class="box">

   <div class="box_img">
        <p style="color: black;">Graficas</p>
        <img src="../components/icons/vehiculo.png" alt="perfil" />
    </div>

   <div class="box_img2">
        <img src="../components/icons/GraficasColumna.png" alt="perfil" />
    </div>
    
    <div class="box_img3">
        <img src="../components/icons/porcentaje.png" alt="perfil" />
    </div>

    <div class="bottones_box">
      <button class="boton_descarga">Descargar PDF</button>
      <button class="boton_descarga">Descargar XLS</button>
    </div>
    
  </div>  
    
  <Menu></Menu>    
  

  </div>
</template>

<script setup>
import Menu from '@/components/Menu.vue'
import Header from '@/components/Header.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Verificar si llegó por navegación del router
  const navigationEntry = performance.getEntriesByType('navigation')[0]
  
  if (navigationEntry && navigationEntry.type !== 'reload') {
    // Si no fue una recarga, forzar recarga
    setTimeout(() => {
      window.location.reload()
    })
  }
})
</script>

<style setup>

.boton_descarga{
    padding: 15px 25px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

button:hover{
 cursor: pointer; 
}
.bottones_box{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}


.box_img{
  justify-content: center;
  display: flex;
  gap: 90px;
}

.box_img2{
  margin-top: 30px;
  display: flex;
  justify-content: center;
  height: 50%;
}

.box_img3{
  display: flex;
  justify-content: center;
  height: 20%;
}

.box_img p{
    font-weight: bold;
    font-family: "Open Sans";
    font-size: 20px;
}

.ejemploMenu{
    width: 345px;
    height: 6500px;
  }

  .box{
     display: flex;
     flex-direction: column;
     justify-content: start;
     align-items: center;
     width: 100%;
     height: 560px;
  }

</style>