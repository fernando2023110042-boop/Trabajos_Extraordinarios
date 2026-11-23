<template>
  <div class="container py-4">
    <div class="text-center mb-4">
      <h1 class="fw-bold"><i class="bi bi-geo-alt-fill text-primary"></i> Directorio de Lugares Favoritos</h1>
      <p class="text-muted mb-1">Explora, filtra y ubica los lugares en el mapa</p>
      <span class="badge bg-light text-dark border">
        <i class="bi bi-cursor-fill text-primary"></i> Haz clic en cualquier punto del mapa para agregar un nuevo lugar
      </span>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <MapaLugares />
      </div>
      <div class="col-lg-5">
        <ListaLugares />
      </div>
    </div>

    <!-- Modal de Bootstrap para agregar lugar -->
    <div class="modal fade" id="modalNuevoLugar" ref="modalEl" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form @submit.prevent="guardarNuevoLugar">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-pin-map-fill text-primary"></i> Agregar lugar de interés
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
              <div class="alert alert-secondary py-2 small mb-3" v-if="coordenadaNueva">
                <strong>Coordenadas seleccionadas:</strong><br>
                Lat: {{ coordenadaNueva.lat.toFixed(5) }} | Lng: {{ coordenadaNueva.lng.toFixed(5) }}
              </div>

              <div class="mb-3">
                <label for="nombreLugar" class="form-label fw-semibold">Nombre del lugar</label>
                <input
                  id="nombreLugar"
                  type="text"
                  class="form-control"
                  v-model="form.nombre"
                  placeholder="Ej. Biblioteca Ingeniería"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="categoriaLugar" class="form-label fw-semibold">Categoría</label>
                <select id="categoriaLugar" class="form-select" v-model="form.categoria" required>
                  <option v-for="(info, clave) in categorias" :key="clave" :value="clave">
                    {{ info.etiqueta }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label for="descripcionLugar" class="form-label fw-semibold">Descripción</label>
                <textarea
                  id="descripcionLugar"
                  class="form-control"
                  rows="3"
                  v-model="form.descripcion"
                  placeholder="Describe brevemente este lugar..."
                  required
                ></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> Guardar lugar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import MapaLugares from './components/MapaLugares.vue'
import ListaLugares from './components/ListaLugares.vue'
import { useLugares } from './composables/useLugares.js'
import { categorias } from './data/lugares.js'

const { coordenadaNueva, agregarLugar } = useLugares()

const modalEl = ref(null)
let modalInstancia = null

const form = reactive({
  nombre: '',
  descripcion: '',
  categoria: 'estudio'
})

onMounted(() => {
  if (modalEl.value) {
    modalInstancia = new Modal(modalEl.value)
    modalEl.value.addEventListener('hidden.bs.modal', () => {
      coordenadaNueva.value = null
    })
  }
})

watch(coordenadaNueva, (nuevaCoord) => {
  if (nuevaCoord && modalInstancia) {
    form.nombre = ''
    form.descripcion = ''
    form.categoria = 'estudio'
    modalInstancia.show()
  }
})

function guardarNuevoLugar() {
  if (!coordenadaNueva.value || !form.nombre.trim()) return

  agregarLugar({
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    categoria: form.categoria,
    lat: coordenadaNueva.value.lat,
    lng: coordenadaNueva.value.lng
  })

  if (modalInstancia) {
    modalInstancia.hide()
  }
}
</script>