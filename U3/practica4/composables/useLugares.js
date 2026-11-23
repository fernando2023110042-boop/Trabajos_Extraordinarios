import { ref, computed } from 'vue'
import { lugaresIniciales } from '../data/lugares.js'

const lugares = ref([...lugaresIniciales])
const lugarSeleccionado = ref(null)
const filtroCategoria = ref('todas')
const textoBusqueda = ref('')
const coordenadaNueva = ref(null) 

export function useLugares() {
  const lugaresFiltrados = computed(() => {
    return lugares.value.filter(lugar => {
      const coincideCategoria =
        filtroCategoria.value === 'todas' || lugar.categoria === filtroCategoria.value
      const coincideTexto =
        lugar.nombre.toLowerCase().includes(textoBusqueda.value.toLowerCase())
      return coincideCategoria && coincideTexto
    })
  })

  function seleccionarLugar(lugar) {
    lugarSeleccionado.value = lugar
  }

  function limpiarSeleccion() {
    lugarSeleccionado.value = null
  }

  function prepararNuevoLugar(lat, lng) {
    coordenadaNueva.value = { lat, lng }
  }

  function agregarLugar({ nombre, descripcion, categoria, lat, lng }) {
    const nuevoId = lugares.value.length > 0
      ? Math.max(...lugares.value.map(l => l.id)) + 1
      : 1

    const nuevoLugar = {
      id: nuevoId,
      nombre,
      categoria,
      lat,
      lng,
      descripcion
    }

    lugares.value.push(nuevoLugar)
    lugarSeleccionado.value = nuevoLugar
    coordenadaNueva.value = null
  }

  return {
    lugares,
    lugaresFiltrados,
    lugarSeleccionado,
    filtroCategoria,
    textoBusqueda,
    coordenadaNueva,
    seleccionarLugar,
    limpiarSeleccion,
    prepararNuevoLugar,
    agregarLugar
  }
}