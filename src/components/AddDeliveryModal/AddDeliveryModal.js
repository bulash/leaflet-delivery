import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { map } from "../MapContainer/MapContainer";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { PizzaTypes } from "../PizzaTypes";
import { forward, toPoint } from "mgrs";

export function AddDeliveryModal({ onCreateDelivery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [mgrsString, setMgrsString] = useState(null);
  const [pizzaType, setPizzaType] = useState(PizzaTypes[0].id);
  const [dateTime, setDateTime] = useState(dayjs());

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const add = (e) => {
      setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      setIsOpen(true);
    }

    map.on('click', add);

    return () => {
      map.off('click', add);
    };
  }, []);

  const handleTypeChange = useCallback((e, b) => {
    setPizzaType(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    onCreateDelivery({pizzaType, dateTime, latLng, mgrsString});
    setIsOpen(false);
  }, [latLng, pizzaType, dateTime, onCreateDelivery, mgrsString]);

  const handleChangeDateTime = useCallback((value) => {
    setDateTime(value);
  }, []);

  const handleMgrsChange = useCallback((value) => {
    setMgrsString(value);
    try {
      // Center of the MGRS square
      const [lng, lat] = toPoint(value);
      setLatLng({ lat, lng });
    } catch (e) {
      console.error('Could not parse MGRS string', e);
    }
  }, []);

  useEffect(() => {
    try {
      const mgrsString = forward([Number(latLng.lng), Number(latLng.lat)], 5);
      setMgrsString(mgrsString);
    } catch (e) {
      console.error('Could not convert lat/lng to MGRS', e);
    }
  }, [latLng]);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Створюємо нову доставку
          </DialogContentText>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <TextField
                value={mgrsString}
                onChange={(e) => handleMgrsChange(e.target.value)}
                required
                label="MGRS"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                value={latLng.lat}
                onChange={(e) => setLatLng({ ...latLng, lat: e.target.value })}
                required
                label="Lat"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                value={latLng.lng}
                onChange={(e) => setLatLng({ ...latLng, lng: e.target.value })}
                required
                label="Lng"
              />
            </FormControl>
            <FormControl fullWidth>
              <DateTimePicker
                value={dateTime}
                onChange={handleChangeDateTime}
                required
                label="Час доставки"
              />
            </FormControl>
            <FormControl fullWidth>
              <Select
                autoFocus
                value={pizzaType}
                label="Тип"
                onChange={handleTypeChange}
              >
                {PizzaTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрити</Button>
          <Button onClick={handleSubmit}>Створити</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
