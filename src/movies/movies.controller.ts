import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMovieDTO } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('movies')
export class MoviesController {

    constructor(private moviesService: MoviesService) { }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<Movie> {
        return this.moviesService.findById(id);
    }

    @Get()
    async findAll(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Post()
    async createMovie(@Body() newMovie: CreateMovieDTO): Promise<Movie> {
        return this.moviesService.createMovie(newMovie);
    }

    @Patch(':id')
    async updateMovie(@Param('id') id: number, @Body() updatingMovie: UpdateMovieDTO): Promise<Movie> {
        return this.moviesService.updateMovie(id, updatingMovie);
    }

    @Delete(':id')
    async deleteMovie(@Param('id') id: number): Promise<DeleteResult> {
        return this.moviesService.deleteMovie(id)
    }

}
