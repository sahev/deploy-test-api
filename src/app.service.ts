import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppEntity } from './app.entity';
import { Repository } from 'typeorm'

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(AppEntity) readonly appRepository: Repository<AppEntity>,
  ) {}


  getHello(): any {
    return this.appRepository.find()
  }

  create(data: AppEntity): any {
    return this.appRepository.save(data)
  }
}
