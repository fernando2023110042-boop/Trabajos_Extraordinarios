<template>
  <div class="map-wrap">
    <div ref="mapEl" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
import { origen, paradas, destino, ruta } from '../composables/useLocationState'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
})

const mapEl = ref(null)
let map = null
let marcadorOrigen = null
let marcadoresParadas = []
let marcadorDestino = null
let capaLineaPuntos = null
let capaRuta = null

function crearIconoParada(numero) {
  return L.divIcon({
    className: 'parada-pin',
    html: `<div style="background:#f59e0b;color:#12161c;font-weight:bold;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);">${numero}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  })
}

// Dibuja una línea conectando origen -> paradas -> destino
function actualizarLineaPuntos() {
  if (!map) return
  if (capaLineaPuntos) {
    map.removeLayer(capaLineaPuntos)
    capaLineaPuntos = null
  }

  const puntos = []
  if (origen.value) puntos.push([origen.value.lat, origen.value.lng])
  paradas.value.forEach(p => puntos.push([p.lat, p.lng]))
  if (destino.value) puntos.push([destino.value.lat, destino.value.lng])

  if (puntos.length >= 2) {
    capaLineaPuntos = L.polyline(puntos, {
      color: '#f59e0b',
      weight: 3,
      dashArray: '8, 8'
    }).addTo(map)
  }
}

onMounted(() => {
  map = L.map(mapEl.value).setView([19.4326, -99.1332], 5)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)

  map.on('click', (e) => {
    const nuevoPunto = { lat: e.latlng.lat, lng: e.latlng.lng }

    if (!destino.value) {
      destino.value = nuevoPunto
    } else {
      paradas.value = [...paradas.value, { ...destino.value }]
      destino.value = nuevoPunto
    }
  })
})

watch(origen, (nuevo) => {
  if (!nuevo || !map) return
  const latlng = [nuevo.lat, nuevo.lng]

  if (marcadorOrigen) {
    marcadorOrigen.setLatLng(latlng)
  } else {
    marcadorOrigen = L.marker(latlng, { title: 'Origen' })
      .addTo(map).bindPopup('Tu ubicación actual')
  }
  map.setView(latlng, 15)
  actualizarLineaPuntos()
})

watch(paradas, (nuevas) => {
  if (!map) return

  marcadoresParadas.forEach(m => map.removeLayer(m))
  marcadoresParadas = []

  nuevas.forEach((p, index) => {
    const marcador = L.marker([p.lat, p.lng], {
      draggable: true,
      icon: crearIconoParada(index + 1),
      title: `Parada ${index + 1}`
    })
      .addTo(map)
      .bindPopup(`Parada ${index + 1}`)

    marcador.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      const copia = [...paradas.value]
      copia[index] = { lat: pos.lat, lng: pos.lng }
      paradas.value = copia
    })

    marcadoresParadas.push(marcador)
  })

  actualizarLineaPuntos()
}, { deep: true })

watch(destino, (nuevo) => {
  if (!map) return

  if (!nuevo) {
    if (marcadorDestino) { map.removeLayer(marcadorDestino); marcadorDestino = null }
    if (capaRuta) { map.removeLayer(capaRuta); capaRuta = null }
    actualizarLineaPuntos()
    return
  }

  const latlng = [nuevo.lat, nuevo.lng]
  if (marcadorDestino) {
    marcadorDestino.setLatLng(latlng)
  } else {
    marcadorDestino = L.marker(latlng, { draggable: true, title: 'Destino' })
      .addTo(map).bindPopup('Destino').openPopup()

    marcadorDestino.on('dragend', (e) => {
      const p = e.target.getLatLng()
      destino.value = { lat: p.lat, lng: p.lng }
    })
  }

  actualizarLineaPuntos()
})

watch(ruta, (nueva) => {
  if (!map) return
  if (capaRuta) { map.removeLayer(capaRuta); capaRuta = null }
  if (!nueva) return

  capaRuta = L.polyline(nueva.coordinates, { color: '#4fd1c5', weight: 5 }).addTo(map)
  map.fitBounds(capaRuta.getBounds(), { padding: [40, 40] })
})
</script>

<style scoped>
.map-wrap { flex: 1; }
.map { width: 100%; height: 100%; }
</style>