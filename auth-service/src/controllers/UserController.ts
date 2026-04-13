import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class UserController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      await this.authService.createUser(req.body);
      return res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error: any) {
      const status = error.message === "User already exists" ? 400 : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.authenticate(email, password);

      if (!result) {
        return res.status(401).json({ message: "E-mail ou senha inválidos." });
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao realizar login." });
    }
  }
}