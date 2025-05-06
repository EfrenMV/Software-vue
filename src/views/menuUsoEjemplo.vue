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
    height: 700px;
  }

  .box{
    width: 100%;
    height: 560px;
    background-color: rgb(205, 134, 134);
  }
 


</style>