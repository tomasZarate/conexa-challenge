import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateMovieDTO {

    @IsString()
    @IsOptional()    
    director?: string

    @IsNumber()
    @IsOptional()    
    episode_id?: number
    
    @IsString()
    @IsOptional()    
    opening_crawl?: string
    
    @IsArray()
    @IsOptional()    
    planets?: string[]
    
    @IsString()
    @IsOptional()    
    producer?: string
    
    @IsString()
    @IsOptional()    
    release_date?: string

    @IsArray()
    @IsOptional()    
    characters?: string[]
    
    @IsArray()
    @IsOptional()    
    species?: string[]
    
    @IsArray()
    @IsOptional()    
    starships?: string[]
    
    @IsString()
    @IsOptional()    
    title?: string
    
    @IsString()
    @IsOptional()    
    url?: string
    
    @IsArray()
    @IsOptional()    
    vehicles?: string[]

}