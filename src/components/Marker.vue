<script setup lang="ts">
import { inject, onUnmounted, onUpdated, ref, type ShallowRef, shallowRef, watch } from 'vue';
import { getLoader, mapInstanceKey } from '../keys';

const position = defineModel<google.maps.LatLngLiteral>('position', { required: true });

export interface Props {
  clickable?: boolean;
  content?: Node;
  draggable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  draggable: false,
});

const map = inject<ShallowRef<google.maps.Map>>(mapInstanceKey)!;
const marker = shallowRef<google.maps.marker.AdvancedMarkerElement | null>(null);
const dragging = ref(false);

const emit = defineEmits(['click']);

watch(map, async () => {
  if (marker.value === null) {
    await getLoader().importLibrary('marker');
    const gMarker = new google.maps.marker.AdvancedMarkerElement({
      map: map.value,
      position: position.value,
      gmpClickable: props.clickable,
      gmpDraggable: props.draggable,
      content: props.content,
    });
    gMarker.addEventListener('gmp-click', () => {
      emit('click');
    });
    gMarker.addListener('dragstart', () => {
      dragging.value = true;
    });
    gMarker.addListener('dragend', () => {
      dragging.value = false;
    });
    gMarker.addListener('drag', (evt: google.maps.MapMouseEvent) => {
      position.value.lat = Math.round(evt.latLng!.lat() * 1e6) / 1e6;
      position.value.lng = Math.round(evt.latLng!.lng() * 1e6) / 1e6;
    });
    marker.value = gMarker;
  } else {
    marker.value.map = map.value;
    marker.value.position = position.value;
  }
});

watch(
  position,
  () => {
    if (marker.value && !dragging.value) {
      marker.value.position = position.value;
    }
  },
  { deep: true }
);

onUpdated(() => {
  if (marker.value) {
    marker.value.gmpClickable = props.clickable;
    marker.value.gmpDraggable = props.draggable;
  }
});

onUnmounted(() => {
  if (marker.value) {
    google.maps.event.clearInstanceListeners(marker.value);
    marker.value.map = null;
    marker.value = null;
  }
});
</script>

<template></template>
