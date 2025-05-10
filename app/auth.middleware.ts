import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { correo: string; permisos: any};
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, 'keySuperSecreta', (err, user) => {
    if (err) {
      console.error('JWT error:', err);
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = user as { correo: string; permisos: any };
    next();
  });
};

export { authenticateToken, AuthenticatedRequest };
