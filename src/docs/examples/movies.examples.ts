import { CreateMovieDTO } from "src/movies/dtos/create-movie.dto";
import { UpdateMovieDTO } from "src/movies/dtos/update-movie.dto";

export const createMovieExample: CreateMovieDTO = {
    title: 'Star Wars: Episode IV - A New Hope',
    opening_crawl: 'A long time ago in a galaxy far, far away...',
    episode_id: 4,
    director: 'George Lucas',
    producer: 'Gary Kurtz',
    planets: ['Tatooine', 'Alderaan'],
    release_date: '1977-05-25',
    characters: ['Luke Skywalker', 'Princess Leia'],
    species: ['Human', 'Wookiee'],
    starships: ['X-wing', 'Millennium Falcon'],
    url: 'https://swapi.dev/api/films/1/',
    vehicles: ['Sand Crawler', 'TIE Fighter'],
};

export const updateMovieExample: UpdateMovieDTO = {
    title: 'Star Wars: Episode IV - A New Hope',
    opening_crawl: 'A long time ago in a galaxy far, far away...',
    director: 'George Lucas',
};