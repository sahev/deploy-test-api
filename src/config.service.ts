import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppEntity } from 'src/app.entity';
import { DatabaseType } from 'typeorm';

require('dotenv').config();

class ConfigService {

    constructor (private env: { [k: string]: string | undefined }) { }

    private getValue (key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues (keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort () {
        return this.getValue('PORT', true);
    }

    public isProduction () {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }

    public getDbSettings () {
        let dbType;

        const mode = this.getValue('MODE', false);

        console.log('mode', mode)


        if (mode.toLowerCase().includes('local')) {
            dbType = 'mysql'
        } else if (mode.toLowerCase().includes('dev')) {
            dbType = 'postgres'
        }

        console.log('dbtype', dbType);

        let sqlSettings = {
            dbType: '',
            host: '',
            port: 0,
            username: '',
            password: '',
            database: ''
        }

        switch (dbType) {
            case 'mysql':
                sqlSettings = {
                    dbType: 'mysql',
                    host: this.getValue('MYSQL_HOST'),
                    port: parseInt(this.getValue('MYSQL_PORT')),
                    username: this.getValue('MYSQL_USER'),
                    password: this.getValue('MYSQL_PASSWORD'),
                    database: this.getValue('MYSQL_DATABASE'),
                }
                break;
            case 'postgres':
                sqlSettings = {
                    dbType: 'postgres',
                    host: this.getValue('POSTGRES_HOST'),
                    port: parseInt(this.getValue('POSTGRES_PORT')),
                    username: this.getValue('POSTGRES_USER'),
                    password: this.getValue('POSTGRES_PASSWORD'),
                    database: this.getValue('POSTGRES_DATABASE'),
                }
                break;
            default:
                sqlSettings = {
                    dbType: 'mysql',
                    host: this.getValue('MYSQL_HOST'),
                    port: parseInt(this.getValue('MYSQL_PORT')),
                    username: this.getValue('MYSQL_USER'),
                    password: this.getValue('MYSQL_PASSWORD'),
                    database: this.getValue('MYSQL_DATABASE'),
                }
                break;
        }
        return sqlSettings
    }

    public getTypeOrmConfig (): TypeOrmModuleOptions {
        const dbSettings = this.getDbSettings();

        return {
            type: dbSettings.dbType as any,
            host: dbSettings.host,
            port: dbSettings.port,
            username: dbSettings.username,
            password: dbSettings.password,
            database: dbSettings.database,
            synchronize: true,
            entities: [AppEntity],
            ssl: this.isProduction(),
        };
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE'
    ]);

export { configService };