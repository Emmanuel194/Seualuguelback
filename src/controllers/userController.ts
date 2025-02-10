import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../db/db";

// Registro de usuário
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, dateOfBirth, email, password } = req.body;
  try {
    // Verifique se o usuário já existe
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if ((rows as any[]).length > 0) {
      res.status(400).json({ message: "Email já cadastrado" });
      return;
    }

    // Criptografe a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crie um novo usuário
    await pool.query(
      "INSERT INTO users (name, date_of_birth, email, password) VALUES (?, ?, ?, ?)",
      [name, dateOfBirth, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário", error });
  }
};

// Login de usuário
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    // Verifique se o usuário existe
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if ((rows as any[]).length === 0) {
      res.status(400).json({ message: "Credenciais inválidas" });
      return;
    }

    const user = (rows as any[])[0];

    // Verifique a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Credenciais inválidas" });
      return;
    }

    res.status(200).json({ message: "Login bem-sucedido" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};
