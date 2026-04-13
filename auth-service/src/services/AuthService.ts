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

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET not configured");
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
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

  async createUser(data: Partial<User>) {
    const { name, email, password, role } = data;
    
    if (!email || !password || !name) {
        throw new Error("Missing required fields");
    }
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