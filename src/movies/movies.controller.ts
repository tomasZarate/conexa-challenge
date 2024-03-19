import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateMovieDTO } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../constants/roles.enum';
import { ImportMovieDto } from './dtos/import-movie.dto';
import axios from 'axios';
import {
  createMovieExample,
  updateMovieExample,
} from '../docs/examples/movies.examples';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get(':id')
  @Roles(UserRole.REGULAR)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiAcceptedResponse({ type: Movie })
  @ApiOperation({ summary: 'Get movie by id' })
  async findById(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.findById(id);
  }

  @Get()
  @ApiAcceptedResponse({ type: [Movie] })
  @ApiOperation({ summary: 'Get all movies' })
  async findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBody({
    type: CreateMovieDTO,
    examples: {
      movieExample: {
        value: createMovieExample,
        summary: 'Example movie expected',
      },
    },
  })
  @ApiAcceptedResponse({ type: Movie })
  @ApiOperation({ summary: 'Create a movie' })
  @UseGuards(AuthGuard, RolesGuard)
  async createMovie(@Body() newMovie: CreateMovieDTO): Promise<Movie> {
    return this.moviesService.createMovie(newMovie);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiBody({
    type: UpdateMovieDTO,
    examples: {
      movieExample: {
        value: updateMovieExample,
        summary: 'Example movie expected',
      },
    },
  })
  @ApiAcceptedResponse({ type: Movie })
  @ApiOperation({ summary: 'Update a movie' })
  @UseGuards(AuthGuard, RolesGuard)
  async updateMovie(
    @Param('id') id: number,
    @Body() updatingMovie: UpdateMovieDTO,
  ): Promise<Movie> {
    return this.moviesService.updateMovie(id, updatingMovie);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete movie' })
  @UseGuards(AuthGuard, RolesGuard)
  async deleteMovie(@Param('id') id: number): Promise<DeleteResult> {
    return this.moviesService.deleteMovie(id);
  }

  @Post('/import')
  @Roles(UserRole.ADMIN)
  @ApiBody({
    type: ImportMovieDto,
    examples: {
      url1: {
        value: { url: 'https://swapi.dev/api/films/1/' },
        summary: 'Example user swapi url',
      },
    },
  })
  @ApiOperation({ summary: 'Import movie from SWAPI' })
  @UseGuards(AuthGuard, RolesGuard)
  async importMovie(@Body() toImportMovie: ImportMovieDto): Promise<Movie> {
    const url = toImportMovie.url;

    try {
      const response = await axios.get(url);

      if (response.status === HttpStatus.OK && response.data) {
        const newMovie: Movie = response.data;

        const createdMovie = await this.moviesService.createMovie(newMovie);

        return createdMovie;
      } else {
        throw new HttpException(
          'Could not get valid data from the Star Wars API.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Error importing movie: ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
