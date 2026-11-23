<template>
  <div class="mapa-wrapper rounded shadow-sm overflow-hidden">
    <l-map
      ref="mapRef"
      :zoom="15"
      :center="centroMapa"
      :use-global-leaflet="false"
      style="height: 500px; width: 100%;"
      @click="alHacerClicMapa"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <l-marker
        v-for="lugar in lugaresFiltrados"
        :key="lugar.id"
        :lat-lng="[lugar.lat, lugar.lng]"
        @click="seleccionarLugar(lugar)"
      >
        <l-popup>
          <div class="popup-lugar">
            <span class="badge mb-1" :style="{ backgroundColor: categorias[lugar.categoria].color }">
              <i :class="'bi ' + categorias[lugar.categoria].icono"></i>
              {{ categorias[lugar.categoria].etiqueta }}
            </span>
            <h6 class="mb-1">{{ lugar.nombre }}</h6>
            <p class="mb-0 small text-muted">{{ lugar.descripcion }}</p>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
import { useLugares } from '../composables/useLugares.js'
import { categorias } from '../data/lugares.js'

// Solución para que los pines de Leaflet se vean en Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
})

const {
  lugaresFiltrados,
  lugarSeleccionado,
  seleccionarLugar,
  prepararNuevoLugar
} = useLugares()

const mapRef = ref(null)
const centroMapa = ref([19.0432, -98.1987])

function alHacerClicMapa(e) {
  if (!e || !e.latlng) return
  prepararNuevoLugar(e.latlng.lat, e.latlng.lng)
}

watch(lugarSeleccionado, async (lugar) => {
  if (!lugar) return
  await nextTick()
  const mapInstance = mapRef.value?.leafletObject
  if (mapInstance) {
    mapInstance.flyTo([lugar.lat, lugar.lng], 17, { duration: 0.75 })
  }
})
</script>

<style scoped>
.mapa-wrapper { border: 1px solid #dee2e6; }
.popup-lugar { min-width: 180px; }
</style>