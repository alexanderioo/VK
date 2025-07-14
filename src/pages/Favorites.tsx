import { observer } from "mobx-react-lite";
import favoritesStore from "../store/FavoritesStore";
import MovieCard from "../components/MovieCard";
import { Box, Typography } from "@mui/material";

const Favorites = () => {
  return (
    <Box maxWidth={1200} mx="auto" mt={5} p={3}>
      <Typography variant="h4" fontWeight={700} mb={4}>Избранные фильмы</Typography>
      {favoritesStore.favorites.length === 0 ? (
        <Typography color="text.secondary">Список избранного пуст.</Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={3}>
          {favoritesStore.favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Box>
      )}
    </Box>
  );
};
export default observer(Favorites);
