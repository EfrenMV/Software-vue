<template>
   <Header></Header>
  <div class="usuario">
  <div class="box">
    <div class="fondoUsuario">
        <div class="hedear-usuario"></div>
    </div>
    <div class="input-container">
      <p>Name</p>
      <input type="text" placeholder=""/>
    </div>

    <div class="input-container">
    <p>Password</p>
    <input type="password" placeholder="" />
    </div>
    <button>Save changes</button>
  </div>  
    
  <Menu></Menu>    
  </div>
</template>

<script setup>
import Menu from '@/components/Menu.vue'
import Header from '@/components/Header.vue'

</script>

<style setup>
.usuario{
    width: 345px;
    height: 6500px;
  }

.box{
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 560px;
   justify-content: flex-start;
   align-items: center;
  }

  .fondoUsuario{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #0B0C1A;
    width: 100%;
    height: 40%;
  }


  .hedear-usuario{
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: aqua;
    width: 100%;
    height: 20%;
  }

  .input-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
 
  button{
    padding: 10px 50px;
    margin: 60px 0;
    color: white;
    font-weight: bold;
    background-color: #0B0C1A;
    border-radius: 30px;
  }

</style>