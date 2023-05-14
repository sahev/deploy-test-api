import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('users')
export class AppEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string

    @Column()
    email: string
}