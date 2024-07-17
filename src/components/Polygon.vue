<script setup lang="ts">
import { inject, onUnmounted, onUpdated, type ShallowRef, shallowRef, watch } from 'vue';
import { getLoader, mapInstanceKey } from '../keys';

type MVCArray<T> = google.maps.MVCArray<T>;
type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;
type PathsType =
  | MVCArray<MVCArray<LatLng>>
  | MVCArray<LatLng>
  | Array<Array<LatLng | LatLngLiteral>>
  | Array<LatLng | LatLngLiteral>;

const props = withDefaults(
  defineProps<{
    fillColor?: string;
    fillOpacity?: number;
    paths: PathsType;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
  }>(),
  { visible: true }
);

const map = inject<ShallowRef<google.maps.Map>>(mapInstanceKey)!;
const polygon = shallowRef<google.maps.Polygon | null>(null);

watch(map, async () => {
  if (polygon.value === null) {
    const { Polygon } = await getLoader().importLibrary('maps');
    const gPolygon = new Polygon({
      paths: props.paths,
      fillColor: props.fillColor,
      fillOpacity: props.fillOpacity,
      strokeColor: props.strokeColor,
      strokeOpacity: props.strokeOpacity,
      strokeWeight: props.strokeWeight,
      visible: props.visible,
      zIndex: props.zIndex,
    });
    gPolygon.setMap(map.value);
    polygon.value = gPolygon;
  } else {
    polygon.value.setOptions({
      fillColor: props.fillColor,
      fillOpacity: props.fillOpacity,
      paths: props.paths,
      strokeColor: props.strokeColor,
      strokeOpacity: props.strokeOpacity,
      strokeWeight: props.strokeWeight,
      visible: props.visible,
      zIndex: props.zIndex,
    });
    polygon.value.setMap(map.value);
  }
});

onUpdated(() => {
  if (polygon.value) {
    polygon.value.setOptions({
      fillColor: props.fillColor,
      fillOpacity: props.fillOpacity,
      paths: props.paths,
      strokeColor: props.strokeColor,
      strokeOpacity: props.strokeOpacity,
      strokeWeight: props.strokeWeight,
      visible: props.visible,
      zIndex: props.zIndex,
    });
  }
});

onUnmounted(() => {
  if (polygon.value) {
    google.maps.event.clearInstanceListeners(polygon.value);
    polygon.value.setMap(null);
    polygon.value = null;
  }
});
</script>

<template></template>
