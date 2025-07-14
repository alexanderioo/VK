import { Link } from "react-router-dom";
import type { Movie } from "../types/Movie";
import styles from "./MovieCard.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  movie: Movie;
}

const placeholderPoster = "https://via.placeholder.com/200x300?text=No+Image";

const MovieCard = ({ movie }: Props) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const title = movie.name || movie.alternativeName || movie.enName || "Нет названия";
  const year = movie.year || "Нет года";
  const rating =
    (typeof movie.rating?.kp === 'number' && movie.rating.kp > 0)
      ? movie.rating.kp
      : (typeof movie.rating?.imdb === 'number' && movie.rating.imdb > 0)
        ? movie.rating.imdb
        : "Нет рейтинга";

  useEffect(() => {
    let isMounted = true;
    const localPoster = movie.poster?.previewUrl || movie.poster?.url;
    if (localPoster) {
      setPosterUrl(localPoster);
    } else if (movie.id) {
      axios.get(`https://api.kinopoisk.dev/v1.4/image`, {
        params: { movieId: movie.id, type: 'poster', limit: 1 },
        headers: { 'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY },
      })
      .then(res => {
        if (isMounted && res.data.docs && res.data.docs.length > 0) {
          setPosterUrl(res.data.docs[0].previewUrl || res.data.docs[0].url || placeholderPoster);
        } else if (isMounted) {
          setPosterUrl(placeholderPoster);
        }
      })
      .catch(() => {
        if (isMounted) setPosterUrl(placeholderPoster);
      });
    } else {
      setPosterUrl(placeholderPoster);
    }
    return () => { isMounted = false; };
  }, [movie]);

  const genres = (movie.genres?.map((g: any) => g.name).filter(Boolean) || []);

  return (
    <Link to={`/movie/${movie.id}`} className={styles.link}>
      <div className={`${styles.card} fadeIn`} style={{ minHeight: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <img
          src={posterUrl || placeholderPoster}
          alt={title}
          className={styles.image}
          style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
        />
        <h3 className={styles.title} style={{ margin: 0, fontSize: 18, textAlign: 'center' }}>{title}</h3>
        <p className={styles.year} style={{ margin: '4px 0', color: '#666' }}>{year}</p>
        <p className={styles.rating} style={{ margin: 0, fontWeight: 500 }}>Рейтинг: {rating}</p>
        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {genres.map((g: string) => (
            <span className="chip" key={g}>{g}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
