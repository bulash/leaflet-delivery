import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { MapContainer, map } from './components/MapContainer/MapContainer';
import { Drawer } from '@mui/material';
import { AddDeliveryModal } from './components/AddDeliveryModal/AddDeliveryModal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { L } from './globals';
import { PizzaTypes } from './components/PizzaTypes';
import dayjs from 'dayjs';
import { SidePanel } from './components/SidePanel/SidePanel';
import { forward } from 'mgrs';

const generateMockDelivery = () => {
  const lat = 50.00 + Math.random() * 0.1;
  const lng = 36.23 + Math.random() * 0.1;
  const pizzaType = Math.floor(Math.random() * PizzaTypes.length);
  const dateTime = dayjs().add(Math.random() * 100, 'hour').toISOString();
  const mgrsString = forward([Number(lng), Number(lat)], 5);

  return {
    latLng: { lat, lng },
    pizzaType,
    dateTime,
    mgrsString
  };
};

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [filters, setFilters] = useState(null);

  const markers = useRef([]);
  const heatLayer = useRef(null);

  const handleCreateDelivery = useCallback((delivery) => {
    setDeliveries([...deliveries, delivery]);
  }, [deliveries]);

  // Generating mock values
  useEffect(() => {
    if (deliveries.length < 30) {
      handleCreateDelivery(generateMockDelivery());
    }
  }, [deliveries, handleCreateDelivery]);

  const activeDeliveries = useMemo(() => {
    if (!filters) {
      return deliveries;
    }

    return deliveries.filter(({pizzaType}) => filters.pizzaTypes[pizzaType]);
  }, [deliveries, filters]);

  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters);
  }, []);

  useEffect(() => {
    // Removing all existing markers
    markers.current.forEach((marker) => {
      marker.remove();
    });

    heatLayer.current?.remove();

    // Adding new markers
    activeDeliveries.forEach(({latLng, pizzaType, dateTime, mgrsString}) => {
      const marker = L.circleMarker(
        L.latLng(Number(latLng.lat), Number(latLng.lng)),
        {
          radius: 5,
          color: PizzaTypes[pizzaType].color,
          pizzaProps: {
            pizzaType,
            dateTime,
          },
        },
      );

      marker.addTo(map);
      marker.bindPopup(`${PizzaTypes[pizzaType]?.label} - ${dayjs(dateTime).format('lll')}<br>${mgrsString}`).openPopup();
      markers.current.push(marker);
    });


    // Heatmap
    heatLayer.current = L.heatLayer(
      activeDeliveries.map(({ latLng }) => [latLng.lat, latLng.lng, 1]), 
      {radius: 30}).addTo(map);

  }, [activeDeliveries]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MapContainer />
      <Drawer open anchor="right" variant="persistent">
        <div style={{width: '320px'}}>
          <SidePanel onFiltersChange={handleFiltersChange} />
        </div>
      </Drawer>
      <AddDeliveryModal onCreateDelivery={handleCreateDelivery} />
    </LocalizationProvider>
  );
}

export default App;
