import { useEffect } from "react";
import { L } from "../../globals";

export let map = null;

export function MapContainer() {
  useEffect(() => {
    if (map) {
      return;
    }

    // 50°00′21″ пн. ш. 36°13′45″ сх. д.
    map = L.map('map').setView([50.00, 36.23], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }, []);

  return (
    <div id="map" style={{height: '100vh', width: '100%'}}>Loading...</div>
  );
}