<template>
  <aside class="panel">
    <h2>Geo + Ruta</h2>

    <button @click="ubicarme" :disabled="cargandoUbicacion">
      {{ cargandoUbicacion ? 'Localizando…' : '📍 Usar mi ubicación actual' }}
    </button>

    <div class="status" v-if="origen">
      <strong>Origen:</strong><br>
      Lat: {{ origen.lat.toFixed(5) }}<br>
      Lng: {{ origen.lng.toFixed(5) }}<br>
      Precisión: ±{{ Math.round(precision) }} m
    </div>
    <div class="status error" v-if="errorGeo">{{ errorGeo }}</div>

    <p class="hint">
      Haz clic en el mapa para fijar el destino. Cada clic extra agregará una parada antes del destino.
    </p>

    <div class="status" v-if="paradas.length > 0">
      <strong>Paradas ({{ paradas.length }}):</strong>
      <div v-for="(p, i) in paradas" :key="i" class="parada-item">
        <span>#{{ i + 1 }}: {{ p.lat.toFixed(4) }}, {{ p.lng.toFixed(4) }}</span>
        <button class="btn-quitar" @click="quitarParada(i)" title="Quitar parada">✕</button>
      </div>
    </div>

    <div class="status" v-if="destino">
      <strong>Destino:</strong><br>
      Lat: {{ destino.lat.toFixed(5) }}, Lng: {{ destino.lng.toFixed(5) }}
    </div>

    <div class="status destacado" v-if="distanciaTotal > 0">
      <strong>Distancia recorrida:</strong> {{ (distanciaTotal / 1000).toFixed(2) }} km
      <span v-if="ruta"><br><strong>Duración:</strong> {{ formatearDuracion(ruta.duration) }}</span>
    </div>

    <button @click="calcularRuta" :disabled="!origen || !destino || cargandoRuta">
      {{ cargandoRuta ? 'Calculando…' : '🧭 Calcular ruta' }}
    </button>
    <button @click="limpiar">Limpiar</button>

    <div class="status error" v-if="errorRuta">{{ errorRuta }}</div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useLocationState } from '../composables/useLocationState'
import { useGeolocation } from '../composables/useGeolocation'
import { useRouting } from '../composables/useRouting'

const {
  origen, paradas, destino, ruta, precision,
  cargandoUbicacion, cargandoRuta,
  errorGeo, errorRuta
} = useLocationState()

const { ubicarme } = useGeolocation()
const { calcularRuta, limpiar, formatearDuracion } = useRouting()

function quitarParada(index) {
  paradas.value = paradas.value.filter((_, i) => i !== index)
}

// Calcula distancia acumulada entre origen, paradas y destino (en metros)
const distanciaTotal = computed(() => {
  if (ruta.value) return ruta.value.distance

  const puntos = []
  if (origen.value) puntos.push(origen.value)
  puntos.push(...paradas.value)
  if (destino.value) puntos.push(destino.value)

  if (puntos.length < 2) return 0

  let metros = 0
  const R = 6371000
  for (let i = 0; i < puntos.length - 1; i++) {
    const lat1 = (puntos[i].lat * Math.PI) / 180
    const lat2 = (puntos[i + 1].lat * Math.PI) / 180
    const dLat = lat2 - lat1
    const dLng = ((puntos[i + 1].lng - puntos[i].lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    metros += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }
  return metros
})
</script>

<style scoped>
.panel {
  width: 320px;
  padding: 20px;
  background: #12161c;
  color: #e6ebf1;
  overflow-y: auto;
}
button {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #171c24;
  color: inherit;
  cursor: pointer;
}
button:disabled { opacity: 0.5; cursor: not-allowed; }
.status {
  font-family: monospace;
  font-size: 12px;
  background: #171c24;
  color: #8a95a5;
  padding: 10px;
  border-radius: 6px;
  margin-top: 8px;
}
.status.destacado {
  color: #4fd1c5;
  border: 1px solid #264645;
}
.status.error { color: #e5675a; }
.hint { font-size: 12px; color: #8a95a5; }
.parada-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #262d38;
}
.btn-quitar {
  width: auto;
  margin: 0;
  padding: 2px 7px;
  font-size: 11px;
  background: #2a1d21;
  color: #e5675a;
  border-color: #4a252c;
}
</style>