import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @Column()
    director: string

    @UpdateDateColumn({ type: 'timestamp' })
    edited_at: Date

    @Column()
    episode_id: number

    @Column()
    opening_crawl: string

    @Column('varchar', { array: true, nullable: true })
    planets

    @Column()
    producer: string

    @Column({ type: 'varchar' })
    release_date: string

    @Column('varchar', { array: true, nullable: true })
    characters: string[]

    @Column('varchar', { array: true, nullable: true })
    species: string[]

    @Column('varchar', { array: true, nullable: true })
    starships: string[]

    @Column()
    title: string

    @Column()
    url: string

    @Column('varchar', { array: true, nullable: true })
    vehicles: string[]

}