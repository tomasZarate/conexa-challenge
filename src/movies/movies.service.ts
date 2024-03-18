import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateMovieDTO } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find({ select: ['id', 'title'] });
  }

  async findById(id: number): Promise<Movie> {
    return this.moviesRepository.findOne({ where: { id } });
  }

  async createMovie(newMovie: CreateMovieDTO): Promise<Movie> {
    try {
      const createdMovie = this.moviesRepository.create(newMovie);
      return this.moviesRepository.save(createdMovie);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteMovie(id: number): Promise<DeleteResult> {
    const existingMovie = await this.moviesRepository.findOne({
      where: { id },
    });

    if (!existingMovie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return this.moviesRepository.delete({ id });
  }

  async updateMovie(id: number, movie: UpdateMovieDTO): Promise<Movie> {
    const existingMovie = await this.moviesRepository.findOne({
      where: { id },
    });

    if (!existingMovie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    await this.moviesRepository.update({ id }, movie);

    const updatedMovie = { ...existingMovie, ...movie };

    return updatedMovie;
  }
}
