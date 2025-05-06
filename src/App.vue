<template>
  <div class="mobile-frame">
    <router-view />
  </div>
</template>

<style scoped>


/* Margenes para celular */
 .mobile-frame {
  max-width: 345px;
  max-height: 700px;
  margin: 2rem auto;
  border: 4px solid #838181;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  background-color: white;
}
</style>
