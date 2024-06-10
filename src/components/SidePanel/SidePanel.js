import { FormControl, Stack, Switch, Typography } from "@mui/material";
import { PizzaTypes } from "../PizzaTypes";
import { useEffect, useState } from "react";

export function SidePanel({ onFiltersChange }) {

  const [filters, setFilters] = useState({
    pizzaTypes: Object.fromEntries(
      PizzaTypes.map(({ id }) => [id, true])
    ),
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [onFiltersChange, filters]);

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        {PizzaTypes.map(({id, label}) => (
          <Stack key={id} direction="horizontal" alignItems="center">
            <Switch
              checked={filters.pizzaTypes[id]}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  pizzaTypes: {
                    ...filters.pizzaTypes,
                    [id]: e.target.checked,
                  }
                });
              }}
            />
            <Typography>{label}</Typography>
          </Stack>
        ))}
      </FormControl>
    </Stack>
  );
}