<template>
   <Header></Header>
  <div class="ejemploMenu">
  <div class="box"></div>  
    
  <Menu></Menu>    
  

  </div>
</template>

<script setup>
import Menu from '@/components/Menu.vue'
import Header from '@/components/Header.vue'

</script>

<style setup>
.ejemploMenu{
    width: 345px;
    height: 6500px;
  }

  .box{
    width: 100%;
    height: 560px;
    }
 

</style>