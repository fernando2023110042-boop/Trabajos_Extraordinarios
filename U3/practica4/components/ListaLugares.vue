<template>
  <div>
    <div class="input-group mb-3">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input type="text" class="form-control" placeholder="Buscar lugar..." v-model="textoBusqueda">
    </div>

    <div class="btn-group w-100 mb-3" role="group">
      <button
        type="button"
        class="btn btn-sm"
        :class="filtroCategoria === 'todas' ? 'btn-secondary' : 'btn-outline-secondary'"
        @click="filtroCategoria = 'todas'"
      >
        Todas
      </button>
      <button
        v-for="(info, clave) in categorias"
        :key="clave"
        type="button"
        class="btn btn-sm"
        :class="filtroCategoria === clave ? 'btn-secondary' : 'btn-outline-secondary'"
        @click="filtroCategoria = clave"
      >
        <i :class="'bi ' + info.icono"></i> {{ info.etiqueta }}
      </button>
    </div>

    <ul class="list-group">
      <li
        v-for="lugar in lugaresFiltrados"
        :key="lugar.id"
        class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
        :class="{ active: lugarSeleccionado?.id === lugar.id }"
        style="cursor: pointer;"
        @click="seleccionarLugar(lugar)"
      >
        <div class="ms-1 me-auto">
          <div class="fw-bold">{{ lugar.nombre }}</div>
          <small>{{ lugar.descripcion }}</small>
        </div>
        <span class="badge rounded-pill" :style="{ backgroundColor: categorias[lugar.categoria].color }">
          {{ categorias[lugar.categoria].etiqueta }}
        </span>
      </li>
      <li v-if="lugaresFiltrados.length === 0" class="list-group-item text-center text-muted">
        No se encontraron lugares con ese criterio.
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useLugares } from '../composables/useLugares.js'
import { categorias } from '../data/lugares.js'

const { lugaresFiltrados, lugarSeleccionado, filtroCategoria, textoBusqueda, seleccionarLugar } = useLugares()
</script>