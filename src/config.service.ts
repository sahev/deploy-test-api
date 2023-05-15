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

    public getTypeOrmConfig (): TypeOrmModuleOptions {
        return {
            type: this.getValue('DB_TYPE') as any,
            host: this.getValue('DB_HOST'),
            port: parseInt(this.getValue('DB_PORT')),
            username: this.getValue('DB_USER'),
            password: this.getValue('DB_PASSWORD'),
            database: this.getValue('DB_DATABASE'),
            synchronize: true,
            entities: [AppEntity],
            // ssl: this.isProduction(),
            ssl: false, // true for external databases
        };
    }
}

const configService = new ConfigService(process.env);

export { configService };