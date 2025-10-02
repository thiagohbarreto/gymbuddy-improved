import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, password } = registerSchema.parse(req.body);
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const user = await User.create({ nome, email, password });
    const token = generateToken({ userId: user.id, email: user.email });
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
  }
};