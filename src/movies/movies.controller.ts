import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateMovieDTO } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../constants/roles.enum';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
@UseGuards(AuthGuard, RolesGuard)
export class MoviesController {

    constructor(private moviesService: MoviesService) { }

    @Get(':id')
    @Roles(UserRole.REGULAR)
    async findById(@Param('id') id: number): Promise<Movie> {
        return this.moviesService.findById(id);
    }

    @Get()
    async findAll(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Post()
    @Roles(UserRole.ADMIN)
    async createMovie(@Body() newMovie: CreateMovieDTO): Promise<Movie> {
        return this.moviesService.createMovie(newMovie);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async updateMovie(@Param('id') id: number, @Body() updatingMovie: UpdateMovieDTO): Promise<Movie> {
        return this.moviesService.updateMovie(id, updatingMovie);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async deleteMovie(@Param('id') id: number): Promise<DeleteResult> {
        return this.moviesService.deleteMovie(id)
    }

}
