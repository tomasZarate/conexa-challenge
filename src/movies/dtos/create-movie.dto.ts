import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateMovieDTO {

    @IsString()
    @IsNotEmpty()
    director: string

    @IsNumber()
    @IsNotEmpty()
    episode_id: number

    @IsString()
    @IsNotEmpty()
    opening_crawl: string

    @IsArray()
    planets: string[]

    @IsString()
    @IsNotEmpty()
    producer: string

    @IsString()
    @IsNotEmpty()
    release_date: string

    @IsArray()
    characters: string[]

    @IsArray()
    species: string[]

    @IsArray()
    starships: string[]

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    url: string

    @IsArray()
    vehicles: string[]

}