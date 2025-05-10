import { createBookAction, deleteBookAction, readBookByIdAction, readBooksByFilterAction, updateBookInfoAction } from "./book.actions";
import { LibroType} from "./book.model";


async function CreateBookController(bookData:LibroType): Promise<LibroType> {
  const newBook = await createBookAction(bookData);
  return newBook;
}

async function ReadBookByIdController(id: string, allEntries: boolean): Promise<LibroType> {
  const book = await readBookByIdAction(id, allEntries);
  return book;
}

async function ReadBooksByFiltersController(filters: any, allEntries: boolean): Promise<LibroType[]> {
    const filteredBooks = await readBooksByFilterAction(filters, allEntries);
    return filteredBooks;
}

async function UpdateBookInfoController(id: string, bookUpdateData: any): Promise<LibroType> {
  const updatedBook = await updateBookInfoAction(id, bookUpdateData);
  return updatedBook;
}

async function DeleteBookController(id: string): Promise<LibroType> {
  const deletedBook = await deleteBookAction(id);
  if (!deletedBook) {
    throw new Error('No se encontró libro con el id proporcionado');
  }
  return deletedBook;
}

export {CreateBookController, DeleteBookController, ReadBookByIdController, ReadBooksByFiltersController, UpdateBookInfoController};