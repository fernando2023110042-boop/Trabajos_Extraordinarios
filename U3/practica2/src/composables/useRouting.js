import {
  origen, paradas, destino, ruta, cargandoRuta, errorRuta
} from './useLocationState'

export function useRouting() {

  async function calcularRuta() {
    if (!origen.value || !destino.value) return

    cargandoRuta.value = true
    errorRuta.value = ''
    ruta.value = null

    try {
      // Construye la secuencia: origen -> paradas -> destino
      const puntos = [origen.value, ...paradas.value, destino.value]
      // OSRM espera coordenadas como lng,lat separadas por punto y coma
      const coords = puntos.map(p => `${p.lng},${p.lat}`).join(';')
      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`

      const resp = await fetch(url)
      if (!resp.ok) throw new Error('El servicio de ruteo respondió con error.')
      const data = await resp.json()

      if (data.code !== 'Ok' || !data.routes?.length) {
        throw new Error('No se encontró una ruta entre los puntos seleccionados.')
      }

      const r = data.routes[0]
      ruta.value = {
        distance: r.distance,
        duration: r.duration,
        coordinates: r.geometry.coordinates.map(c => [c[1], c[0]]) // a [lat, lng]
      }

    } catch (e) {
      errorRuta.value = e.message || 'No se pudo calcular la ruta.'
    } finally {
      cargandoRuta.value = false
    }
  }

  function limpiar() {
    paradas.value = []
    destino.value = null
    ruta.value = null
    errorRuta.value = ''
  }

  function formatearDuracion(segundos) {
    const min = Math.round(segundos / 60)
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return `${h} h ${m} min`
  }

  return { calcularRuta, limpiar, formatearDuracion }
}