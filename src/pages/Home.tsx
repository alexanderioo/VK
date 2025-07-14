import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import movieStore from "../store/MovieStore";
import MovieCard from "../components/MovieCard";
import Filters from "../components/Filters";
import Header from "../components/Header";
import styles from "./Home.module.css";
import { CircularProgress, Alert } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";

const parseParams = (params: URLSearchParams) => {
  return {
    query: params.get("query") || "",
    yearRange: [
      Number(params.get("yearStart")) || 1990,
      Number(params.get("yearEnd")) || 2025,
    ] as [number, number],
    ratingRange: [
      Number(params.get("ratingStart")) || 0,
      Number(params.get("ratingEnd")) || 10,
    ] as [number, number],
    genres: params.get("genres") ? params.get("genres")!.split(",") : [],
  };
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersFromUrl = parseParams(searchParams);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !movieStore.isLoading &&
        !movieStore.error
      ) {
        movieStore.loadNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterChange = (filters: {
    query: string;
    yearRange: [number, number];
    ratingRange: [number, number];
    genres: string[];
  }) => {
    movieStore.setFilters(filters);
    movieStore.fetchMovies();
    setSearchParams({
      query: filters.query,
      yearStart: String(filters.yearRange[0]),
      yearEnd: String(filters.yearRange[1]),
      ratingStart: String(filters.ratingRange[0]),
      ratingEnd: String(filters.ratingRange[1]),
      genres: filters.genres.join(","),
    });
  };

  return (
    <div className={styles.pageBg}>
      <Header />
      <div className={styles.container}>
        <div className={styles.filtersBlock}>
          <h1 className={styles.title}>
            <MovieIcon fontSize="large" style={{ color: '#ff6600' }} />
            Список фильмов
          </h1>
          <p className={styles.subtitle}>Открой для себя лучшие фильмы по жанрам, рейтингу и году!</p>
          <Filters onFilterChange={handleFilterChange} initialFilters={filtersFromUrl} />
        </div>
        {movieStore.isLoading && (
          <div style={{ display: "flex", justifyContent: "center", margin: 32 }}>
            <CircularProgress />
          </div>
        )}
        {movieStore.error && (
          <Alert severity="error" style={{ margin: 32 }}>{movieStore.error}</Alert>
        )}
        <div className={styles.grid}>
          {movieStore.movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(Home);
