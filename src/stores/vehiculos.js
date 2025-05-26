import { defineStore } from 'pinia';

export const useVehiculosStore = defineStore('vehiculos', {
  state: () => ({
    vehiculos: [] // Se llena desde API
  }),
  actions: {
    async cargarVehiculos() {
      const response = await axios.get('/api/vehiculos');
      this.vehiculos = response.data;
    }
  },
  getters: {
    getByPlaca: (state) => (placa) => state.vehiculos.find(v => v.placa === placa)
  }
});
