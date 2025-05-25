<template>
   <Header></Header>
  <div class="ejemploMenu">
  <div class="box">
   <div class="box_img">
        <p style="color: black;">Graficas</p>
        <img src="../components/icons/vehiculo.png" alt="perfil" />
    </div>

  </div>  
    
  <Menu></Menu>    
  

  </div>
</template>

<script setup>
import Menu from '@/components/Menu.vue'
import Header from '@/components/Header.vue'

</script>

<style setup>
.box_img{
  justify-content: center;
  display: flex;
  gap: 90px;
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
    width: 100%;
    height: 560px;
    }
 

</style>