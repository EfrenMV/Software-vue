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
        <input type="text" placeholder="Usuario" v-model="usuario" />
      </div>

      <!-- Contraseña -->
      <div class="input-container">
        <i class="fas fa-key icono"></i>
        <span class="divider"></span>
        <input type="password" placeholder="Contraseña" v-model="contraseña" />
      </div>

      <!-- Botón -->
      <button class="lg" @click="handleLogin" :disabled="isLoading">
        <span v-if="isLoading">Verificando...</span>
        <span v-else>LOGIN</span>
      </button>

    </div>

    <!-- Popup dentro del contenedor -->
    <div v-if="showpopup" class="popup-filtro" @click="closepopup">
      <div class="popup-content" @click.stop>
      
        <!-- Header del popup -->
        <div class="popup-header">
          <h3>{{ isFormValid ? '' : '' }}</h3>
          <button class="close-btn" @click="closepopup">×</button>
        </div>

        <!-- Contenido del popup -->
        <div class="popup-body">
          
          <!-- Para cuando el login se realiza correctamente -->
          <div v-if="isFormValid" class="success-content">
            <div class="icon-success">✓</div>
            <h4>¡Login Exitoso!</h4>
            <p>Bienvenido de vuelta, <strong>{{ usuario }}</strong></p>
          </div>

          <!-- Para cuando el login da error -->
          <div v-else class="error-content">
            <div class="icon-error">⚠</div>
            <h4>Campos Incompletos</h4>
            <p>Por favor, completa todos los campos para continuar.</p>
          </div>

        </div>

        <!-- Botones del popup -->
        <div class="popup-footer">
      
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/Header.vue'

const usuario = ref('')
const contraseña = ref('')
const showpopup = ref(false)
const isLoading = ref(false)



const isFormValid = computed(() => {
  return usuario.value.trim() && contraseña.value.trim()
})


/* Esto hace la validacion*/
const handleLogin = () => {
  
  /* Si no es valido manda el de error*/
  if (!isFormValid.value) {
    showpopup.value = true
    return
  }
  
  /* Si es valido manda el cargando*/
  isLoading.value = true
  
  // Esto es simplemente para que haga la funcion de cargando cuando es valido
  setTimeout(() => {
    isLoading.value = false
    showpopup.value = true
  }, 2000)
}


/* Esto es para cerrar el popup */
const closepopup = () => {
  showpopup.value = false
}

const continuar = () => {
  closepopup()
  // Aquí iría tu lógica de redirección
  console.log('Redirigiendo al dashboard...')
}
</script>

<style scoped>

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
    position: relative; /* Añadido para posicionar del popup */
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
  transition: all 0.3s ease;
}

.lg:hover {
  background-color: rgb(220, 110, 20);
  transform: translateY(-1px);
}

.lg:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.texto-container {
  display: flex;
  gap: 10px;  
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

/* Estilos del popup */

/*Esto es para el filtro de fondo */
.popup-filtro {
  position: absolute;  
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  border-radius: 0; /* Para que coincida con el contenedor si tiene bordes redondeados */
}

.popup-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 85%; /* Reducido para que quepa mejor en el contenedor */
  max-width: 280px; /* Ajustado al ancho del contenedor */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  animation: popupSlide 0.3s ease-out;
  position: relative;
}

@keyframes popupSlide {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.popup-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;  
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.popup-body {
  text-align: center;
  margin-bottom: 20px;
  padding: 12px 0;
}

/* Para el icono de correcto */
.success-content .icon-success {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px; 
  height: 50px; 
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  font-size: 24px; 
  font-weight: bold;
  margin-bottom: 12px;
  animation: successPop 0.5s ease-out;
}

/* Para el icono de error */
.error-content .icon-error {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;  
  height: 50px;  
  background-color: #FF9800;
  color: white;
  border-radius: 50%;
  font-size: 24px;  
  font-weight: bold;
  margin-bottom: 12px;
  animation: errorShake 0.5s ease-out;
}

@keyframes successPop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.popup-body h4 {
  margin: 0 0 6px 0;
  color: #333;
  font-size: 18px;  
  font-weight: 600;
}

.popup-body p {
  margin: 0;
  color: #666;
  line-height: 1.4;
  font-size: 13px;  
}

.popup-footer {
  display: flex;
  gap: 10px;
}

.btn-secondary {
  flex: 1;
  padding: 10px 16px;  
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;  
}

.btn-secondary:hover {
  background-color: #eeeeee;
  border-color: #d0d0d0;
}

.btn-primary {
  flex: 1;
  padding: 10px 16px; 
  background-color: rgb(245, 129, 31);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;  
}

.btn-primary:hover {
  background-color: rgb(220, 110, 20);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(245, 129, 31, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

</style>