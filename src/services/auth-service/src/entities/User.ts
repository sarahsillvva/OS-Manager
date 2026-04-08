import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("users") 
export class User {
  @PrimaryGeneratedColumn("uuid") 
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) 
  password!: string;

  @Column()
  name!: string;

  @Column({ default: "technician" })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;
}