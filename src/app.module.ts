import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config.service';
import { AppEntity } from './app.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()), TypeOrmModule.forFeature([AppEntity])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
