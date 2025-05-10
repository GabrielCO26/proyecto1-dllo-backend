import {createUserAction, readUserAction, deleteUserAction} from './user.actions';
import { UserType } from './user.model';


async function CreateUserController(userData: UserType): Promise<UserType>{
  const newUser = await createUserAction(userData);
  return newUser;
}

async function ReadUserController(correo: string, contraseña: string, allEntries: Boolean): Promise<{userData: Partial<UserType>; userToken: string}> {
  const loggedInUser = await readUserAction(correo, contraseña, allEntries);
  return loggedInUser;
}

async function DeleteUserController(correo: string): Promise <UserType> {
  const deletedUser = await deleteUserAction(correo);
  if (!deletedUser) {
    throw new Error('No se encontró usuario con el correo proporcionado');
  }
  return deletedUser;
}

export { CreateUserController, ReadUserController, DeleteUserController };