import {
  origen, precision, cargandoUbicacion, errorGeo
} from './useLocationState'

export function useGeolocation() {

  function ubicarme() {
    errorGeo.value = ''

    if (!('geolocation' in navigator)) {
      errorGeo.value = 'Este navegador no soporta la Geolocation API.'
      return
    }

    cargandoUbicacion.value = true

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        origen.value = { lat: latitude, lng: longitude }
        precision.value = accuracy
        cargandoUbicacion.value = false
      },
      (err) => {
        cargandoUbicacion.value = false
        const mensajes = {
          1: 'Permiso de ubicación denegado.',
          2: 'Ubicación no disponible.',
          3: 'Tiempo de espera agotado.'
        }
        errorGeo.value = mensajes[err.code] || 'Error desconocido.'
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  return { ubicarme }
}