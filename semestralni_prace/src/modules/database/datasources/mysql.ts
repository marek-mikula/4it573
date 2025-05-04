import { DataSource } from "typeorm";

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        __dirname + '/../entities/*.entity.ts',
    ],
    migrations: [
        __dirname + '/../migrations/*.ts',
    ],
    migrationsTableName: 'migrations',
    synchronize: process.env.APP_ENV === 'local',
})