<template>
  <div class="mapa-container">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :center="centro"
      style="height: 100%; width: 100%;"
    >
      <l-tile-layer
        :url="tileUrl"
        :attribution="atribucion"
      />

      <l-marker
        v-for="(punto, index) in coordenadas"
        :key="index"
        :lat-lng="[punto.lat, punto.lng]"
      >
        <l-popup>
          <strong>{{ punto.nombre }}</strong><br />
          Lat: {{ punto.lat }}, Lng: {{ punto.lng }}
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
})

const zoom = ref(15)
const centro = ref([40.0055, 116.3136])

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const atribucion = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const coordenadas = ref([])

onMounted(async () => {
  const respuesta = await fetch('/gps.csv')
  const texto = await respuesta.text()
  const lineas = texto.trim().split('\n')

  // Toma 1 punto cada 250 líneas para mostrar el recorrido sin saturar el mapa
  const puntos = []
  for (let i = 0; i < lineas.length; i += 250) {
    const [lat, lng, fecha] = lineas[i].trim().split(',')
    if (lat && lng) {
      puntos.push({
        nombre: `Registro #${i + 1} (${fecha})`,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      })
    }
  }

  coordenadas.value = puntos
  if (puntos.length > 0) {
    centro.value = [puntos[0].lat, puntos[0].lng]
  }
})
</script>

<style scoped>
.mapa-container {
  height: 500px;
  width: 100%;
}
</style>