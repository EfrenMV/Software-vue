<template>
   <Header></Header>
  <div class="usuario">
  <div class="box">
    <div class="fondoUsuario">
      <div class="hedear-usuario">
        <button class="btnPerfil">Mecánico</button>
        <div class="Camara dos"></div>
      </div>
        <div class="box_img">
        <img src="../components/icons/userProfile.png" alt="perfil" />
        <p style="color: aliceblue;">Juan Mecanico</p>
      </div>

    </div>
    <div class="input-container">
      <p class="tx1">Name</p>
      <input type="text" placeholder=""/>
    </div>

    <div class="input-container">
    <p class="tx">Password</p>
    <input type="password" placeholder="" />
    </div>
    <button class="btnSave">Save changes</button>
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
    height: 44%;
    border-radius: 0px 0px 30px 30px;
  }


  .hedear-usuario{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 20%;
    gap: 100px;
  }

  .input-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .input-container input{
     margin-top: -10px;
     padding: 10px 15px;
     width: 70%;
     border-radius: 5px;
     margin: 0px;
     border-color: #544c4c2a;
    }

   .input-container .tx{
     margin-right: 200px;
    }
    
   .input-container .tx1{
     margin-right: 220px;
   }

   .input-container .tx, .tx1{
    font-weight: bold;
    font-family: "Open Sans";
    font-size: 14px;
    }
    

  .btnSave{
    padding: 10px 50px;
    margin: 60px 0;
    color: white;
    font-weight: bold;
    background-color: #0B0C1A;
    border-radius: 30px;
  }

  .btnPerfil{
    padding: 8px 40px;
    margin: 60px 0;
    border-radius: 30px;
  }

  /* Optenida del Header.vue*/
  .dos{
    background-color: #3BD135;
    width: 20px;
    height: 20px;
  }

    /* Optenida del Header.vue*/
  .box_img{
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-top: 30px;

   /* Imagen estrellas */
   background-image: url('../components/icons/background_stars.png');
   background-size: cover;
   background-position: center;
   }

  .box_img p{
   font-family: "Open Sans";
   font-size: 20px;
   font-weight: bold;

  }


 

</style>