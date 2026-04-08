import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      // 1. Verificar se o usuário já existe
      const userRepository = AppDataSource.getRepository(User);
      const userExists = await userRepository.findOneBy({ email });

      if (userExists) {
        return res.status(400).json({ message: "Usuário já cadastrado." });
      }

      // 2. Criptografar a senha (Padrão de segurança)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Criar e salvar o usuário
      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await userRepository.save(newUser);

      return res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error("❌ Erro detalhado:", error);
      return res.status(500).json({ 
        message: "Erro interno no servidor.",
        error: error instanceof Error ? error.message : error 
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { email },
            select: ["id", "password", "name", "role"] 
        });

        if (!user) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        // 3. Gerar o Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || "secret_fallback", 
            { expiresIn: "1d" } 
        );

        return res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao realizar login." });
    }
    }
}