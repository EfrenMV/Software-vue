<template>
  <Header></Header>
  <div class="login-view">
    <div class="decor-top-right" />
    <h1>Constructora<br />Aguilar</h1>

    <input type="text" placeholder="Usuario" />
    <input type="password" placeholder="Contraseña" />

    <p>Bienvenido</p>
    <button @click="goToMenu">Iniciar sesión</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
  
const router = useRouter()
 </script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  width: 345px;
  height: 700px;
  position: relative;
  text-align: center;
}

.decor-top-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background-color: #f4c542;
  border-bottom-left-radius: 100px;
}

input {
  width: 100%;
  max-width: 280px;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  border: 1px solid #aaa;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  background-color: #aaa;
  border: none;
  color: white;
  font-weight: bold;
  width: 80%;
  max-width: 250px;
}

footer {
  margin-top: auto;
  font-size: 0.75rem;
  padding-bottom: 1rem;
}
</style>
