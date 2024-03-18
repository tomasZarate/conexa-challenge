import { IsNotEmpty, IsString } from "class-validator"

export class ImportMovieDto {
    @IsString()
    @IsNotEmpty()
    url: string
}