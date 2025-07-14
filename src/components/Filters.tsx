import React, { useState } from "react";
import { Box, TextField, Slider, Select, MenuItem } from "@mui/material";

interface FiltersProps {
  onFilterChange: (filters: {
    query: string;
    yearRange: [number, number];
    genre: string;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState("");
  const [yearRange, setYearRange] = useState<[number, number]>([1980, 2025]);
  const [genre, setGenre] = useState("");

  const handleChange = () => {
    onFilterChange({ query, yearRange, genre });
  };

  return (
    <Box display="flex" gap={2} alignItems="center" mb={3}>
      <Slider
        min={1980}
        max={2025}
        value={yearRange}
        onChange={(i, newValue) => {
          setYearRange(newValue as [number, number]);
          handleChange();
        }}
        valueLabelDisplay="auto"
      />
      <Select
        value={genre}
        displayEmpty
        onChange={(e) => {
          setGenre(e.target.value);
          handleChange();
        }}
      >
        <MenuItem value="">Все жанры</MenuItem>
        <MenuItem value="comedy">Комедия</MenuItem>
        <MenuItem value="drama">Драма</MenuItem>
      </Select>
    </Box>
  );
};

export default Filters;
