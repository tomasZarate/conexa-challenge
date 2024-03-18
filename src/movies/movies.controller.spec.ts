import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDTO } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const nowDate = new Date();
  const MOVIE_REPOSITORY_TOKEN = getRepositoryToken(Movie);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        UsersService,
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useClass: Repository,
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ],

    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
    title: 'Star Wars: Episode IV - A New Hope',
    url: 'https://swapi.dev/api/films/1/',
    vehicles: ['AT-ST Walker'],
    created_at: nowDate,
    edited_at: nowDate
  };

  describe('findById', () => {
    it('should return a movie by id', async () => {
      const movieId = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(movie);

      expect(await controller.findById(movieId)).toBe(movie);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [movie];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(movies);

      expect(await controller.findAll()).toEqual(movies);
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
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

      const createdDate = new Date();
      const editedDate = new Date();

      const createdMovie: Movie = {
        id: 1,
        ...newMovie,
        created_at: createdDate,
        edited_at: editedDate,
      };

      jest.spyOn(service, 'createMovie').mockResolvedValueOnce(createdMovie);

      const result = await controller.createMovie(newMovie);

      expect(result).toEqual(createdMovie);
    });
  });

  describe('updateMovie', () => {
    it('should update an existing movie', async () => {
      const movieId = 1;
      const updatingMovie: UpdateMovieDTO = { title: 'Updated Movie', director: 'Updated Director' };
      const updatedMovie: Movie = { id: movieId, ...movie, ...updatingMovie };

      jest.spyOn(service, 'updateMovie').mockResolvedValueOnce(updatedMovie);

      expect(await controller.updateMovie(movieId, updatingMovie)).toBe(updatedMovie);
    });
  });

  describe('deleteMovie', () => {
    it('should delete an existing movie', async () => {
      const movieId = 1;
      const deleteResult: DeleteResult = { raw: [], affected: 1 };

      jest.spyOn(service, 'deleteMovie').mockResolvedValueOnce(deleteResult);

      expect(await controller.deleteMovie(movieId)).toBe(deleteResult);
    });

    it('should throw an error if movie is not found', async () => {
      const movieId = 1;

      jest.spyOn(service, 'deleteMovie').mockRejectedValueOnce(new HttpException('Movie not found', HttpStatus.NOT_FOUND));

      await expect(controller.deleteMovie(movieId)).rejects.toThrowError(new HttpException('Movie not found', HttpStatus.NOT_FOUND));
    });
  });
});
