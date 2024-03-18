import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMovieDTO } from './dtos/create-movie.dto';
import { Movie } from './entities/movie.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>

  const nowDate = new Date();
  const MOVIE_REPOSITORY_TOKEN = getRepositoryToken(Movie);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(MOVIE_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {

      const movies = [{
        id: 1,
        director: 'George Lucas',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war.....',
        planets: ['Tatooine', 'Alderaan'],
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
        characters: ['Luke Skywalker'],
        species: ['Human', 'Wookiee'],
        starships: ['Millennium Falcon'],
        title: 'Star Wars: Episode IV - A New Hope',
        url: 'https://swapi.dev/api/films/1/',
        vehicles: ['AT-ST Walker'],
        created_at: nowDate,
        edited_at: nowDate
      }, {
        id: 2,
        director: 'George Lucas',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war.....',
        planets: ['Tatooine', 'Alderaan'],
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
        characters: ['Luke Skywalker'],
        species: ['Human', 'Wookiee'],
        starships: ['Millennium Falcon'],
        title: 'Star Wars: Episode IV - A New Hope',
        url: 'https://swapi.dev/api/films/1/',
        vehicles: ['AT-ST Walker'],
        created_at: nowDate,
        edited_at: nowDate
      }];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(movies);

      expect(await service.findAll()).toEqual(movies);
    });

    it('should return an empty array if no movies are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return the movie with the provided id', async () => {
      const movie = {
        id: 1,
        director: 'George Lucas',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war.....',
        planets: ['Tatooine', 'Alderaan'],
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
        characters: ['Luke Skywalker'],
        species: ['Human', 'Wookiee'],
        starships: ['Millennium Falcon'],
        title: 'Star Wars: Episode IV - A New Hope',
        url: 'https://swapi.dev/api/films/1/',
        vehicles: ['AT-ST Walker'],
        created_at: nowDate,
        edited_at: nowDate
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(movie);

      expect(await service.findById(1)).toEqual(movie);
    });

    it('should return null if no movie is found with the provided id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      expect(await service.findById(1)).toBeNull();
    });
  });

  describe('createMovie', () => {
    const newMovie: CreateMovieDTO = {
      director: 'George Lucas',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war.....',
      planets: ['Tatooine', 'Alderaan'],
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      characters: ['Luke Skywalker'],
      species: ['Human', 'Wookiee'],
      starships: ['Millennium Falcon'],
      title: 'Star Wars: Episode IV - A New Hope',
      url: 'https://swapi.dev/api/films/1/',
      vehicles: ['AT-ST Walker'],
    };

    const createdMovie = {
      id: 1,
      director: 'George Lucas',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war.....',
      planets: ['Tatooine', 'Alderaan'],
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      characters: ['Luke Skywalker'],
      species: ['Human', 'Wookiee'],
      starships: ['Millennium Falcon'],
      title: 'Star Wars: Episode IV - A New Hope',
      url: 'https://swapi.dev/api/films/1/',
      vehicles: ['AT-ST Walker'],
      created_at: nowDate,
      edited_at: nowDate
    };
    it('should create a new movie', async () => {

      jest.spyOn(repository, 'create').mockReturnValueOnce(createdMovie);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(createdMovie);

      expect(await service.createMovie(newMovie)).toEqual(createdMovie);
    });

    it('should throw an error if movie creation fails', async () => {
      const error = new Error('Failed to create movie');

      jest.spyOn(repository, 'create').mockReturnValueOnce(createdMovie);
      jest.spyOn(repository, 'save').mockRejectedValueOnce(error);

      await expect(service.createMovie(newMovie)).rejects.toThrowError(error);
    });
  });

  describe('updateMovie', () => {

    const existingMovie: Movie = {
      id: 1,
      director: 'George Lucas',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war.....',
      planets: ['Tatooine', 'Alderaan'],
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      characters: ['Luke Skywalker'],
      species: ['Human', 'Wookiee'],
      starships: ['Millennium Falcon'],
      title: 'Star Wars',
      url: 'https://swapi.dev/api/films/1/',
      vehicles: ['AT-ST Walker'],
      created_at: nowDate,
      edited_at: nowDate
    };
    it('should update an existing movie', async () => {
      const updatedMovieData: UpdateMovieDTO = { title: 'Updated Movie' };
      const updatedMovie = { ...existingMovie, ...updatedMovieData };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingMovie);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      const result = await service.updateMovie(existingMovie.id, updatedMovieData);

      expect(result).toEqual(updatedMovie);
    });

    it('should throw an error if movie is not found', async () => {
      const updatedMovieData: UpdateMovieDTO = { opening_crawl: 'Lorem Ipsum' };
      const error = new Error('Movie not found');

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateMovie(1, updatedMovieData)).rejects.toThrowError(error);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie successfully', async () => {
      const movieId = 1;
      const movie: Movie = {
        id: 1,
        director: 'George Lucas',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war.....',
        planets: ['Tatooine', 'Alderaan'],
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
        characters: ['Luke Skywalker'],
        species: ['Human', 'Wookiee'],
        starships: ['Millennium Falcon'],
        title: 'Star Wars',
        url: 'https://swapi.dev/api/films/1/',
        vehicles: ['AT-ST Walker'],
        created_at: nowDate,
        edited_at: nowDate
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(movie);

      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      const result = await service.deleteMovie(movieId);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw an error if movie is not found', async () => {
      const movieId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.deleteMovie(movieId)).rejects.toThrowError(new HttpException('Movie not found', HttpStatus.NOT_FOUND));
    });
  });

});
