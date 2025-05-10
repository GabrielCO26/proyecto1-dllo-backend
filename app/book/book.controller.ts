import { createBookAction, deleteBookAction, readBookByIdAction, readBooksByFilterAction, updateBookInfoAction, lendBookAction, returnBookAction } from "./book.actions";
import { LibroType} from "./book.model";


async function CreateBookController(bookData:LibroType): Promise<LibroType> {
  const newBook = await createBookAction(bookData);
  return newBook;
}

async function ReadBookByIdController(bookId: string, allEntries: boolean): Promise<LibroType> {
  const book = await readBookByIdAction(bookId, allEntries);
  return book;
}

async function ReadBooksByFiltersController(filters: any, allEntries: boolean): Promise<LibroType[]> {
    const filteredBooks = await readBooksByFilterAction(filters, allEntries);
    return filteredBooks;
}

async function UpdateBookInfoController(bookId: string, bookUpdateData: any): Promise<LibroType> {
  const updatedBook = await updateBookInfoAction(bookId, bookUpdateData);
  return updatedBook;
}

async function DeleteBookController(bookId: string): Promise<LibroType> {
  const deletedBook = await deleteBookAction(bookId);
  if (!deletedBook) {
    throw new Error('No se encontró libro con el id proporcionado');
  }
  return deletedBook;
}

async function LendBookController(bookId: string, userId: string, reservationDate: Date, returnDate: Date) {
  const borrowedbook = await lendBookAction(bookId, userId, reservationDate, returnDate);
  return borrowedbook;
}

async function ReturnBookController(bookId: string) {
  const returnedBook = await returnBookAction(bookId);
  return returnedBook;
}

export {CreateBookController, DeleteBookController, ReadBookByIdController, ReadBooksByFiltersController, UpdateBookInfoController, LendBookController, ReturnBookController};