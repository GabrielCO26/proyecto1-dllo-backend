import { LibroModel, LibroType } from "./book.model";

async function createBookAction(bookData: LibroType) {
  try {
    const newBook = new LibroModel(bookData);
    await newBook.save();
    return newBook;
  } catch (error: any) {
    throw new Error(`Error creando libro: ${error.message}`);
  }
}

async function readBookByIdAction(id: string, allEntries: boolean) {
  try {
    const book = await LibroModel.findById(id);
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

async function deleteBookAction(id: string) {
  try {
    const deletedBook = await LibroModel.findByIdAndUpdate(id , { activo: false }, { new: true });
    return deletedBook;
  } catch (error: any) {
    throw new Error(`Error eliminando libro: ${error.message}`);
  }
}

export {createBookAction, deleteBookAction, readBookByIdAction, readBooksByFilterAction};