import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from '@nestjs/config';

//TOOD: Move this harcoded to configService
export const dataSourceOptions = (configService: ConfigService) : DataSourceOptions => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'root',
    database: 'moviesdb',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    synchronize: true,
})

const dataSource = new DataSource(dataSourceOptions(new ConfigService()))

export default dataSource