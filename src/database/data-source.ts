import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv'

dotenv.config();

export const dataSourceOptions = () : DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    synchronize: true,
})

const dataSource = new DataSource(dataSourceOptions())

export default dataSource