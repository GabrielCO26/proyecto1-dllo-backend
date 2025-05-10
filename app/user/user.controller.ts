import {createUserAction, readUserAction, deleteUserAction, updateUserAction} from './user.actions';
import { UserType } from './user.model';


async function CreateUserController(userData: UserType): Promise<UserType>{
  const newUser = await createUserAction(userData);
  return newUser;
}

async function ReadUserController(correo: string, contraseña: string, allEntries: Boolean): Promise<{userData: Partial<UserType>; userToken: string}> {
  const loggedInUser = await readUserAction(correo, contraseña, allEntries);
  return loggedInUser;
}

async function UpdateUserController(correo: string, nombre: string, contraseña: string, modificarUsuario: boolean): Promise<UserType> {
  const updatedUser = await updateUserAction({correo, nombre, contraseña}, modificarUsuario);
  return updatedUser;
}

async function DeleteUserController(correo: string): Promise <UserType> {
  const deletedUser = await deleteUserAction(correo);
  return deletedUser;
}

export { CreateUserController, ReadUserController, DeleteUserController, UpdateUserController };