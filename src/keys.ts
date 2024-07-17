import { Loader } from '@googlemaps/js-api-loader';
import { inject } from 'vue';

export const apiKey = Symbol('Google Maps API Key');
export const mapInstanceKey = Symbol('google.maps.Map');

let loader: Loader | null = null;

export function getLoader(): Loader {
  if (loader === null) {
    loader = new Loader({
      apiKey: inject<string>(apiKey)!,
      version: 'beta',
    });
  }
  return loader;
}
