/* Estilos adicionales para el template mejorado de solicitudes */

.orden-id {
  background-color: #34495e;
  color: #ecf0f1;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
}

.refaccion-details {
  flex: 1;
}

.refaccion-descripcion {
  color: #95a5a6;
  font-size: 11px;
  margin: 4px 0 0 0;
  line-height: 1.3;
}

.vehiculo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.vehiculo-marca-modelo {
  font-weight: 600;
  color: #ecf0f1;
}

.vehiculo-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
}

.vehiculo-placa {
  color: #bdc3c7;
  font-size: 11px;
}

.vehiculo-estado {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
}

.estado-operativo {
  background-color: #4CAF50;
  color: white;
}

.estado-reparacion {
  background-color: #FFC107;
  color: #2c3e50;
}

.no-vehiculo {
  color: #e74c3c !important;
  font-style: italic;
}

/* Información de reparación */
.info-reparacion {
  background-color: #34495e;
  border-radius: 8px;
  padding: 10px;
  margin: 8px 0;
  border-left: 3px solid #9C27B0;
}

.reparacion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #ecf0f1;
  font-size: 12px;
  font-weight: 600;
}

.reparacion-fecha {
  margin-left: auto;
  color: #95a5a6;
  font-size: 10px;
  font-weight: normal;
}

.diagnostico {
  color: #bdc3c7;
  font-size: 11px;
  margin: 4px 0;
  line-height: 1.3;
}

.mecanico {
  color: #9C27B0;
  font-size: 11px;
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Proveedor mejorado */
.proveedor-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.proveedor-nombre {
  color: #ecf0f1;
  font-weight: 500;
}

.proveedor-contacto {
  color: #95a5a6;
  font-size: 10px;
}

/* Información de refacción */
.info-refaccion {
  background-color: rgba(156, 39, 176, 0.1);
  border-radius: 6px;
  padding: 8px;
  margin-top: 8px;
}

.refaccion-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.precio-unitario {
  color: #9C27B0;
  font-size: 11px;
  font-weight: 600;
}

.stock-disponible {
  color: #4CAF50;
  font-size: 10px;
  font-weight: 500;
}

.sin-stock {
  color: #e74c3c !important;
}

/* Mejoras responsive */
@media (max-width: 360px) {
  .vehiculo-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .refaccion-stock {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

/* Animaciones suaves */
.solicitud-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.solicitud-card:hover .vehiculo-estado {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.solicitud-card:hover .costo-total {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}
