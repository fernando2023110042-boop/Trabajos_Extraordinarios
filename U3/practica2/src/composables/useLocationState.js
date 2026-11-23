import { ref } from 'vue'

export const origen = ref(null)              // { lat, lng }
export const paradas = ref([])               // [{ lat, lng }, ...]
export const destino = ref(null)             // { lat, lng }
export const ruta = ref(null)                // { distance, duration, coordinates }
export const precision = ref(0)
export const cargandoUbicacion = ref(false)
export const cargandoRuta = ref(false)
export const errorGeo = ref('')
export const errorRuta = ref('')

export function useLocationState() {
  return {
    origen, paradas, destino, ruta, precision,
    cargandoUbicacion, cargandoRuta,
    errorGeo, errorRuta
  }
}