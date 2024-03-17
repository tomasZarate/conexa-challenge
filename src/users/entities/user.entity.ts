import { Exclude } from "class-transformer";
import { UserRole } from "../../constants/roles.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Exclude()
    @Column()
    password: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    edited_at: Date

    @Column()
    @Column({
        type: 'varchar',
        default: UserRole.Regular,
    })
    role: string
}