import { createContext } from 'react';
import { useEffect, useState, ReactNode, useContext} from 'react';

import { Button } from './components/Button';
import { MovieCard } from './components/MovieCard';

import { api } from './services/api';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}
interface MoviesProviderProps {
  children: ReactNode;
}
interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}
interface MoviesData {
  genres : GenreResponseProps[];
  selectedGenre : GenreResponseProps;
  selectedGenreId : number;
  handleClickButton : (id : number) => void;
  movies : MovieProps[];
}

const MoviesContext = createContext({} as MoviesData);

export function MoviesProvider({children}:MoviesProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }
  return(
    <MoviesContext.Provider value={{genres, selectedGenre, selectedGenreId, handleClickButton, movies}}>
      {children}
    </MoviesContext.Provider>
  )
}
export function UseMovies () {
  const context = useContext(MoviesContext);

  return context;
}