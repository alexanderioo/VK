import React, { useState, useEffect } from "react";
import { Box, TextField, Slider, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText } from "@mui/material";

interface FiltersProps {
  onFilterChange: (filters: {
    query: string;
    yearRange: [number, number];
    ratingRange: [number, number];
    genres: string[];
  }) => void;
  initialFilters?: {
    query: string;
    yearRange: [number, number];
    ratingRange: [number, number];
    genres: string[];
  };
}

const genreOptions = [
  { value: "comedy", label: "Комедия" },
  { value: "drama", label: "Драма" },
  { value: "action", label: "Боевик" },
  { value: "fantasy", label: "Фэнтези" },
  { value: "sci-fi", label: "Фантастика" },
];

const Filters: React.FC<FiltersProps> = ({ onFilterChange, initialFilters }) => {
  const [query, setQuery] = useState(initialFilters?.query ?? "");
  const [yearRange, setYearRange] = useState<[number, number]>(initialFilters?.yearRange ?? [1990, 2025]);
  const [ratingRange, setRatingRange] = useState<[number, number]>(initialFilters?.ratingRange ?? [0, 10]);
  const [genres, setGenres] = useState<string[]>(initialFilters?.genres ?? []);

  useEffect(() => {
    if (initialFilters) {
      setQuery(initialFilters.query);
      setYearRange(initialFilters.yearRange);
      setRatingRange(initialFilters.ratingRange);
      setGenres(initialFilters.genres);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(initialFilters)]);

  useEffect(() => {
    onFilterChange({ query, yearRange, ratingRange, genres });
    // eslint-disable-next-line
  }, [query, yearRange, ratingRange, genres]);

  return (
    <Box display="flex" gap={2} alignItems="center" mb={3}>
      <Slider
        min={1990}
        max={2025}
        value={yearRange}
        onChange={(i, newValue) => {
          setYearRange(newValue as [number, number]);
        }}
        valueLabelDisplay="auto"
        sx={{ width: 180 }}
      />
      <Slider
        min={0}
        max={10}
        step={0.1}
        value={ratingRange}
        onChange={(i, newValue) => {
          setRatingRange(newValue as [number, number]);
        }}
        valueLabelDisplay="auto"
        sx={{ width: 120 }}
      />
      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Жанры</InputLabel>
        <Select
          multiple
          value={genres}
          onChange={(e) => {
            setGenres(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value);
          }}
          input={<OutlinedInput label="Жанры" />}
          renderValue={(selected) =>
            (selected as string[]).map(val => genreOptions.find(g => g.value === val)?.label || val).join(', ')
          }
        >
          {genreOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={genres.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filters;
