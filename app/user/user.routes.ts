import {Router, Request, Response} from 'express';
import { AuthenticatedRequest, authenticateToken } from '../auth.middleware';
import { CreateUserController, ReadUserController, DeleteUserController, UpdateUserController } from './user.controller';

const userRoutes = Router();

// Registro
async function CreateUser(req: Request, res: Response) {
  try {
    const userData = req.body;
    const newUser = await CreateUserController(userData);
    res.status(201).json({message: 'Usuario creado exitosamente', newUser});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
    
}

// Login
async function getUser(req: Request, res: Response) {
  try {
    const userData = req.body;
    const { correo, contraseña, allEntries } = userData; //allEntries es un booleano que indica si se deben mostrar todos los usuarios, incluyendo los inhabilitados
    const loggedInUser = await ReadUserController(correo, contraseña, allEntries);
    res.status(200).json({ message: 'Usuario logeado exitosamente', loggedInUser});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Update user
async function UpdateUser(req: AuthenticatedRequest, res: Response) {
  try {
    const {correo, nombre, contraseña} = req.body;
    if (req.user?.correo !== correo && !req.user?.permisos.modificarUsuarios){
      return res.status(403).json({message: 'No tienes permiso para editar a usuarios'});
    }
    const modificarUsuarios = req.user?.permisos.modificarUsuarios; // Si el usuario tiene permiso para modificar usuarios los puede modificar aún sí no están activos
    const updatedUser = await UpdateUserController(correo, nombre, contraseña, modificarUsuarios);
    res.status(200).json({message: 'Usuario editado exitosamente', updatedUser});
  } catch (error: any) {
    res.status(500).json({message: error.message})
  }
}

// Inhabilitar usuario
async function DeleteUser(req: AuthenticatedRequest, res: Response) {
  try{
    const {correo} = req.body;
    if (req.user?.correo !== correo && !req.user?.permisos.inhabilitarUsuarios){
      return res.status(403).json({message: 'No tienes permiso para inhabilitar a usuarios'});
    }
    const deletedUser = await DeleteUserController(correo);
    res.status(200).json({message: 'Usuario inhabilitado exitosamente', deletedUser});
  } catch (error: any){
    res.status(500).json({message: error.message})
  }
}

//endpoints
userRoutes.post('/createUser', CreateUser);
userRoutes.get('/getUser', getUser);
userRoutes.patch('/updateUser', authenticateToken, UpdateUser);
userRoutes.delete('/deleteUser', authenticateToken, DeleteUser)

export default userRoutes;