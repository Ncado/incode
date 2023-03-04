import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.subordinates, { nullable: true })
  boss: User;

  @OneToMany(() => User, (user) => user.boss)
  subordinates: User[];

  @Column()
  role: string;
}
