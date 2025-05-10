import { error } from "console";
import { UserModel, UserType } from "./user.model";
import jwt from 'jsonwebtoken';

async function createUserAction(userData: UserType) {
  try {
    const newUser = new UserModel(userData);
    await newUser.save();
    return newUser;
  } catch (error: any) {
    throw new Error(`Error creando usuario: ${error.message}`);
  }
}

async function readUserAction(correo: string, contraseña: string, allEntries: Boolean) {
  try {
    const user = await UserModel.findOne({ correo });
    if (!user || user.contraseña !== contraseña || (!user.activo && !allEntries)) { // No se devuelve si el usuario está inhabilitado (soft delete)
      throw new Error('usuario o contraseña incorrectos');
    }
    const loggedInUser = {
      nombre: user.nombre,
      correo: user.correo,
      permisos: user.permisos,
    };

    const token = jwt.sign(
      { correo: user.correo, permisos: user.permisos},
      'keySuperSecreta'
    );

    return {userData: loggedInUser, userToken: token};
  } catch (error: any) {
    throw new Error(`Error durante el login: ${error.message}`);
  }
}

async function deleteUserAction(correo: string) {
  try{
    const deletedUser = await UserModel.findOneAndUpdate({ correo }, {activo: false}, {new: true});
    return deletedUser;
  } catch (error: any){
    throw new Error('Error durante la inhabilitación del usuario')
  } 
}

export { createUserAction, readUserAction, deleteUserAction };