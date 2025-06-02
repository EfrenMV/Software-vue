<template>
    <div class="contenedor">
      <div class="Menu">
        <div class="icon-container">
          <!-- Carro -->     
          <router-link to="/ejMenu" class="icon-link" :class="{ active: $route.path === '/ejMenu' }">
          <i class="fas fa-car icon"></i>
        </router-link>

        <!-- Llave inglesa -->
        <RouterLink to="/menu-nerudo" class="icon-link" :class="{ active: $route.path === '/menu-nerudo' }">
          <i class="fas fa-wrench icon"></i>
        </RouterLink>

        <!-- Usuario -->
        <router-link to="/usuario" class="icon-link" :class="{ active: $route.path === '/usuario' }">
          <i class="fas fa-user icon"></i>
        </router-link>

        </div>
      </div>
      
      <div class="cDiagonal">
        <div class="diagonal"></div>
      </div>
    </div>
  </template>
  
  <style>
  
  .contenedor {
    display: flex;
    flex-direction: column;
    align-items: center;     /* Centra horizontalmente */
    justify-content: center; /* Centra verticalmente si tienes altura */
    }
  
  .Menu {
    width: 325px;
    height: 50px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
  }
  
.icon-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0 20px;
}

.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.icon-link.active {
  background-color: #3d4044bd; /* Color gris para el estado activo */
}

.icon {
  font-size: 20px;
  color: white;
  cursor: pointer;
}

.diagonal {
  height: 4px;
  width: 90px;
  background-color: rgb(6, 6, 6);
  border-radius: 2px;
}

.cDiagonal {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
  </style>
  