import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import movieStore from "../store/MovieStore";
import MovieCard from "../components/MovieCard";

const Home = () => {
  useEffect(() => {
    movieStore.fetchMovies();
  }, []);

  return (
    <div>
      <h1>Home — Список фильмов</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {movieStore.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default observer(Home);
