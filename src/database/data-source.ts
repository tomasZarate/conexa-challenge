import { DataSource, DataSourceOptions } from "typeorm";

//TOOD: Move this harcoded to configService
export const dataSourceOptions = () : DataSourceOptions => ({
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

const dataSource = new DataSource(dataSourceOptions())

export default dataSource