import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Chip, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import favoritesStore from "../store/FavoritesStore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

const placeholderPoster = "https://via.placeholder.com/300x450?text=No+Image";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddFavorite = () => setOpen(true);
  const handleConfirm = () => {
    favoritesStore.add(movie);
    setOpen(false);
  };
  const handleCancel = () => setOpen(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
        headers: {
          "X-API-KEY": import.meta.env.VITE_KINOPOISK_API_KEY,
        },
      })
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setError("Ошибка загрузки фильма");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={6}>{error}</Typography>;
  if (!movie) return null;

  const posterUrl = movie.poster?.url || movie.poster?.previewUrl || placeholderPoster;
  const title = movie.name || movie.alternativeName || movie.enName || "Нет названия";
  const description = movie.description || movie.shortDescription || "Нет описания";
  const rating = typeof movie.rating?.kp === 'number' && movie.rating.kp > 0
    ? movie.rating.kp
    : (typeof movie.rating?.imdb === 'number' && movie.rating.imdb > 0 ? movie.rating.imdb : "Нет рейтинга");
  const year = movie.year || "Нет года";
  const genres = movie.genres?.map((g: any) => g.name).filter(Boolean) || [];
  const releaseDate = movie.premiere?.world?.slice(0, 10) || year;

  return (
    <Box maxWidth={900} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={4} bgcolor="#fff" display="flex" gap={4}>
      <Box minWidth={300}>
        <img
          src={posterUrl}
          alt={title}
          style={{ width: 300, height: 450, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 16px #0002' }}
        />
      </Box>
      <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start">
        <Typography variant="h4" fontWeight={700} mb={2}>{title}</Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={2}>{releaseDate}</Typography>
        <Typography variant="body1" mb={3}>{description}</Typography>
        <Typography variant="h6" mb={2}>Рейтинг: {rating}</Typography>
        <Box mb={2} display="flex" gap={1} flexWrap="wrap">
          {genres.map((g: string) => (
            <Chip key={g} label={g} color="primary" variant="outlined" />
          ))}
        </Box>
        {/* Кнопка для добавления в избранное будет позже */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFavorite}
          sx={{ mt: 2, width: 240 }}
          disabled={favoritesStore.isFavorite(movie.id)}
        >
          {favoritesStore.isFavorite(movie.id) ? "В избранном" : "Добавить в избранное"}
        </Button>
        <Dialog open={open} onClose={handleCancel}>
          <DialogTitle>Добавить фильм в избранное?</DialogTitle>
          <DialogActions>
            <Button onClick={handleCancel}>Отмена</Button>
            <Button onClick={handleConfirm} variant="contained" color="primary">Добавить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
export default MovieDetails;
