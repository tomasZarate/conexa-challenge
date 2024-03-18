import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateMovieDTO } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../constants/roles.enum';
import { ImportMovieDto } from './dtos/import-movie.dto';
import axios from 'axios';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
export class MoviesController {

    constructor(private moviesService: MoviesService) { }

    @Get(':id')
    @Roles(UserRole.REGULAR)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Get movie by id' })
    async findById(@Param('id') id: number): Promise<Movie> {
        return this.moviesService.findById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all movies' })
    async findAll(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiBody({ type: CreateMovieDTO })
    @ApiOperation({ summary: 'Create a movie' })
    @UseGuards(AuthGuard, RolesGuard)
    async createMovie(@Body() newMovie: CreateMovieDTO): Promise<Movie> {
        return this.moviesService.createMovie(newMovie);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiBody({ type: UpdateMovieDTO })
    @ApiOperation({ summary: 'Update a movie' })
    @UseGuards(AuthGuard, RolesGuard)
    async updateMovie(@Param('id') id: number, @Body() updatingMovie: UpdateMovieDTO): Promise<Movie> {
        return this.moviesService.updateMovie(id, updatingMovie);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete movie' })
    @UseGuards(AuthGuard, RolesGuard)
    async deleteMovie(@Param('id') id: number): Promise<DeleteResult> {
        return this.moviesService.deleteMovie(id)
    }

    @Post('/import')
    @Roles(UserRole.ADMIN)
    @ApiBody({ type: ImportMovieDto })
    @ApiOperation({ summary: 'Import movie from SWAPI' })
    @UseGuards(AuthGuard, RolesGuard)
    async importMovie(@Body() toImportMovie: ImportMovieDto): Promise<Movie> {
        const url = toImportMovie.url;

        try {
            const response = await axios.get(url);

            if (response.status === 200 && response.data) {
                const newMovie: Movie = response.data;

                const createdMovie = await this.moviesService.createMovie(newMovie);

                return createdMovie;
            } else {
                throw new Error('Could not get valid data from the Star Wars API.');
            }
        } catch (error) {
            throw new Error('Error importing movie: ' + error.message);
        }
    }
}
