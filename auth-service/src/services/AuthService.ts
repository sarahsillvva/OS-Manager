import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "password", "name", "role", "email"] 
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret_fallback",
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async createUser(data: any) {
    const { name, email, password, role } = data;

    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return await this.userRepository.save(newUser);
  }
}