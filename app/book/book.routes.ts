import { Router, Request, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../auth.middleware';
import { CreateBookController, DeleteBookController, ReadBookByIdController, ReadBooksByFiltersController, UpdateBookInfoController} from './book.controller';

const bookRoutes = Router();


async function CreateBook(req: AuthenticatedRequest, res: Response) {
	try{
		if (!req.user?.permisos.crearLibros){
			return res.status(403).json({message: 'No tienes permiso para crear libros'});
		}
		const bookData = req.body;
		const newBook = await CreateBookController(bookData);
		res.status(200).json({message: 'Libro creado exitosamente', newBook});

	} catch(error: any){
		res.status(500).json({ message: error.message });
	}
}

async function getBookById(req: Request, res: Response) { 
  try{
    const {id} = req.params;
    const {allEntries} = req.body; // allEntries es un booleano que indica si se deben mostrar todos los libros, incluyendo los inhabilitados
    const book = await ReadBookByIdController(id, allEntries);
    res.status(200).json({message: 'Libro encontrado', book});
  } catch (error: any){
    res.status(500).json({ message: error.message });
  }
}

async function getBooksByFilters(req: Request, res: Response) {
  try {
    const filters: any = {};
    if (req.query.genero) filters.genero = req.query.genero;
    if (req.query.fechaPublicacion) filters.fechaPublicacion = new Date(req.query.fechaPublicacion as string);
    if (req.query.editorial) filters.editorial = req.query.editorial;
    if (req.query.autor) filters.autor = req.query.autor;
    if (req.query.titulo) filters.titulo = req.query.titulo;
    if (req.query.disponible) filters.disponible = req.query.disponible;

    const {allEntries} = req.body; // allEntries es un booleano que indica si se deben mostrar todos los libros, incluyendo los inhabilitados
    const filteredBooks = await ReadBooksByFiltersController(filters, allEntries);
    res.status(200).json({ message: 'Libros encontrados', filteredBooks });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function updateBookInfo(req: AuthenticatedRequest, res: Response) {
  try{
    if (!req.user?.permisos.modificarLibros){
      return res.status(403).json({message: 'No tienes permiso para modificar libros'});
    }
    const {id, ...bookUpdateData} = req.body;
    const updatedBook = await UpdateBookInfoController(id, bookUpdateData);
    res.status(200).json({message: 'Libro actualizado exitosamente', updatedBook});
  } catch (error: any){
    res.status(500).json({ message: error.message });
  }
}


async function deleteBook(req: AuthenticatedRequest, res: Response) {
  try{
    const {id} = req.body;
    if (!req.user?.permisos.inhabilitarLibros){
      return res.status(403).json({message: 'No tienes permiso para borrar libros'});
    }
    const deletedBook = await DeleteBookController(id);
    res.status(200).json({message: 'Libro inhabilitado exitosamente', deletedBook})

  } catch (error: any){
    res.status(500).json({ message: error.message });
  }
}
//endpoints
bookRoutes.post('/createBook', authenticateToken, CreateBook);
bookRoutes.get('/getBookById/:id', getBookById);
bookRoutes.get('/getBooksByFilters', getBooksByFilters);
bookRoutes.patch('/updateBookInfo', authenticateToken, updateBookInfo);
bookRoutes.delete('/deleteBook', authenticateToken, deleteBook);

export default bookRoutes;
