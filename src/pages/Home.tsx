import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import movieStore from "../store/MovieStore";
import MovieCard from "../components/MovieCard";
import Filters from "../components/Filters";
import Header from "../components/Header";
import styles from "./Home.module.css";

const Home = () => {
  useEffect(() => {
    movieStore.fetchMovies();
  }, []);

  const handleSearch = (query: string) => {
    movieStore.setQuery(query);
    movieStore.fetchMovies();
  };

  const handleFilterChange = (filters: {
    query: string;
    yearRange: [number, number];
    genre: string;
  }) => {
    movieStore.setFilters(filters);
    movieStore.fetchMovies();
  };

  return (
    <div>
      <Header onSearch={handleSearch} />
      <div className={styles.container}>
        <h1 className={styles.title}>Home — Список фильмов</h1>
        <Filters onFilterChange={handleFilterChange} />
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
