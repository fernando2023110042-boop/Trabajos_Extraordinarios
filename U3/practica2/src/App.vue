<template>
  <div id="app-layout">
    <ControlPanel />
    <MapView />
  </div>
</template>

<script setup>
import ControlPanel from './components/ControlPanel.vue'
import MapView from './components/MapView.vue'
</script>

<style>
html, body, #app { margin: 0; padding: 0; height: 100%; }
#app-layout { display: flex; height: 100vh; width: 100vw; }
</style>