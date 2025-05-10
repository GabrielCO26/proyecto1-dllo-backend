import { LibroModel, LibroType } from "./book.model";
import { UserModel } from "../user/user.model";
import { Types } from 'mongoose';

async function createBookAction(bookData: LibroType) {
  try {
    const newBook = new LibroModel(bookData);
    await newBook.save();
    return newBook;
  } catch (error: any) {
    throw new Error(`Error creando libro: ${error.message}`);
  }
}

async function readBookByIdAction(bookId: string, allEntries: boolean) {
  try {
    const book = await LibroModel.findById(bookId);
    if (!book) {
      throw new Error('No se encontró libro con el id proporcionado');
    }
    if (!book.activo && !allEntries) { // Si el libro no está activo y no se solicitan explicitamente todos los registros, lanzar un error
      throw new Error('No se encontró libro con el id proporcionado');
    }
    return book;
  } catch (error: any) {
    throw new Error(`Error buscando libro: ${error.message}`);
  }
}

async function readBooksByFilterAction(filters: any, allEntries: boolean) {
  try {
    if (!allEntries){
      filters.activo = true; // Si no se solicitan todos los registros, solo busca libros activos
    }
    const filteredBooks = await LibroModel.find(filters);
    if (!filteredBooks) {
      throw new Error('No se encontraron libros con los filtros proporcionados');
    }
    return filteredBooks;
  } catch (error: any) {
    throw new Error(`Error buscando libros: ${error.message}`);
  }
}

async function updateBookInfoAction(bookId: string, bookUpdateData: any) {
  try {
    if ('activo' in bookUpdateData || 'disponible' in bookUpdateData || 'historialReservas' in bookUpdateData) {
      throw new Error('No se puede modificar el estado de activo, disponible o historialReservas');
    }
    const updatedBook = await LibroModel.findByIdAndUpdate(bookId, bookUpdateData, { new: true });
    if (!updatedBook) {
      throw new Error('No se encontró libro con el id proporcionado');
    }
    return updatedBook;
  } catch (error: any) {
    throw new Error(`Error actualizando libro: ${error.message}`);
  }
}

async function deleteBookAction(bookId: string) {
  try {
    const deletedBook = await LibroModel.findByIdAndUpdate(bookId , { activo: false }, { new: true });
    return deletedBook;
  } catch (error: any) {
    throw new Error(`Error eliminando libro: ${error.message}`);
  }
}

async function lendBookAction(bookId: string, userId: string, reservationDate: Date, returnDate: Date) {
  try {
    const borrowedbook = await LibroModel.findById(bookId);
    if (!borrowedbook) {
      throw new Error('No se encontró el libro con el id proporcionado');
    }
    if (!borrowedbook.disponible) {
      throw new Error('El libro no está disponible para prestar');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('No se encontró el usuario con el id proporcionado');
    }

    borrowedbook.historialReservas.push({
      usuarioId: new Types.ObjectId(userId),
      nombreUsuario: user.nombre,
      fechaReserva: reservationDate,
      fechaEntrega: returnDate,
    });

    user.reservas.push({
      libroId: new Types.ObjectId(bookId),
      nombreLibro: borrowedbook.titulo,
      fechaReserva: reservationDate,
      fechaEntrega: returnDate
    });

    borrowedbook.disponible = false;
    await borrowedbook.save();
    await user.save();

    return borrowedbook;
  } catch (error: any) {
    throw new Error(`Error prestando libro: ${error.message}`);
  }
}

async function returnBookAction(bookId: string) {
  try {
    const returnedBook = await LibroModel.findById(bookId);
    if (!returnedBook) {
      throw new Error('No se encontró el libro con el id proporcionado');
    }
    if (returnedBook.disponible) {
      throw new Error('El libro ya está disponible');
    }

    returnedBook.disponible = true;
    await returnedBook.save();

    return returnedBook;
  } catch (error: any) {
    throw new Error(`Error devolviendo libro: ${error.message}`);
  }
}

export {createBookAction, deleteBookAction, readBookByIdAction, readBooksByFilterAction, updateBookInfoAction, lendBookAction, returnBookAction};