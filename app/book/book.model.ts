import { model, Schema, Types } from "mongoose";

// DECLARE RESERVATION HISTORY TYPE
type HistorialReservaType = {
  usuarioId: Types.ObjectId;
  nombreUsuario: string;
  fechaReserva: Date;
  fechaEntrega: Date;
};

// DECLARE MODEL TYPE
type LibroType = {
  titulo: string;
  autor?: string;
  genero?: string;
  editorial?: string;
  fechaPublicacion?: Date;
  disponible: boolean;
  historialReservas: HistorialReservaType[];
  activo: boolean;
};


// esquemas de mongoose
const HistorialReservaSchema = new Schema<HistorialReservaType>({
  usuarioId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  nombreUsuario: { type: String, required: true },
  fechaReserva: { type: Date, required: true },
  fechaEntrega: { type: Date, required: true },
});

const LibroSchema = new Schema<LibroType>(
  {
    titulo: { type: String, required: true },
    autor: String,
    genero: String,
    editorial: String,
    fechaPublicacion: Date,
    disponible: { type: Boolean, default: true },
    historialReservas: [HistorialReservaSchema],
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Modelo de mongo
const LibroModel = model<LibroType>("Libro", LibroSchema);

export { LibroModel, LibroSchema, LibroType };
