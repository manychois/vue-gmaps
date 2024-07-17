<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref, shallowRef, watch } from 'vue';
import { getLoader, mapInstanceKey } from '../keys';

const center = defineModel<google.maps.LatLngLiteral>('center', { default: { lat: 0, lng: 0 } });
const zoom = defineModel<number>('zoom', { default: 10 });

export interface Props {
  mapId?: string;
}
const props = withDefaults(defineProps<Props>(), {
  mapId: '',
});

const div = shallowRef<HTMLElement | null>(null);
const dragging = ref(false);
const gmap = shallowRef<google.maps.Map | null>(null);
provide(mapInstanceKey, gmap);

onMounted(async () => {
  await getLoader().importLibrary('maps');
  const mapOptions: google.maps.MapOptions = {
    center: center.value,
    zoom: zoom.value,
    mapId: props.mapId === '' ? undefined : props.mapId,
  };
  const map = new google.maps.Map(div.value!, mapOptions);
  map.addListener('center_changed', () => {
    const mapCenter = map.getCenter()!;
    center.value.lat = Math.round(mapCenter.lat() * 1e6) / 1e6;
    center.value.lng = Math.round(mapCenter.lng() * 1e6) / 1e6;
  });
  map.addListener('zoom_changed', () => {
    zoom.value = map.getZoom()!;
  });
  map.addListener('dragstart', () => {
    dragging.value = true;
  });
  map.addListener('dragend', () => {
    dragging.value = false;
  });
  gmap.value = map;
});

watch(
  center,
  () => {
    if (dragging.value) return;
    gmap.value?.setCenter(center.value);
  },
  { deep: true }
);

watch(zoom, () => {
  gmap.value?.setZoom(zoom.value);
});

onUnmounted(() => {
  if (!gmap.value) return;
  google.maps.event.clearInstanceListeners(gmap.value);
  gmap.value = null;
});
</script>

<template>
  <div class="map" ref="div"></div>
  <slot />
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
