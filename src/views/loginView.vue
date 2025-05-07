<template>
  <Header class="hd"></Header>
  <div class="contenedor">
    <div class="box">

      <div class="box_img">
        <img src="../components/icons/constructora.png" alt="Descripción de la imagen" />
      </div>

      <div class="texto-container">
        <div class="txt_big">
          CA
        </div>
        <div class="txt_peq">
          <p>Constructora <br>Aguilar</p> 
         </div>
        
      </div>
      <!-- Usuario -->
      <div class="input-container">
        <i class="fas fa-user icono"></i>
        <span class="divider"></span>
        <input type="text" placeholder="Usuario" />
      </div>

      <!-- Contraseña -->
      <div class="input-container">
        <i class="fas fa-key icono"></i>
        <span class="divider"></span>
        <input type="password" placeholder="Contraseña" />
      </div>

      <!-- Botón -->
      <button class="lg">LOGIN</button>

    </div>
  </div>
</template>


<script setup>
 import Header from '@/components/Header.vue'
</script>

<style setup>

.hd{
  background-color: rgb(76, 80, 94);
  color: aliceblue;
  stroke: aliceblue;

}
.my-icon{
  stroke: aliceblue;
}

.contenedor{
    width: 345px;
    height: 650px;
    background-color: rgb(89, 92, 110);
  }

.box{
   display: flex;
    width: 100%;
    height: 560px;
    background-color: rgb(89, 92, 110);
    flex-direction: column;  
    display: flex;
    align-items: center;
    justify-content: center;

   }
 
 
.input-container {
  display: flex;
  align-items: center;
  background-color: #6b6d80;
  padding: 10px 15px;
  border-radius: 12px;
  margin: 10px 0;
  width: 280px;
  color: white;
}

.input-container input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  padding-left: 10px;
}

.input-container input::placeholder {
  color: #ccc;  
  opacity: 1;   
}

.icono {
  font-size: 16px;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: #888;
  margin: 0 10px;
}

.lg {
  height: 60px;
  width: 280px;
  border-radius: 30px;
  color: white;
  background-color: rgb(245, 129, 31);
  border: none;
  margin-top: 20px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.texto-container {
  display: flex;
  gap: 10px; /* Espacio entre los textos */
  color: white;
  margin-bottom: 15px;
}

.txt_big{
  font-size: 70px;
}

 
.box_img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
   display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.box_img img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

</style>