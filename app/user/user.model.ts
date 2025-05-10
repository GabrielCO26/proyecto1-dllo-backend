import { model, Schema, Types } from "mongoose";

type ReservationType = {
  libroId: Types.ObjectId;
  nombreLibro: string;
  fechaReserva: Date;
  fechaEntrega: Date;
};

type UserType = {
  nombre: string;
  correo: string;
  contraseña: string;
  permisos: {
    crearLibros: boolean;
    modificarUsuarios: boolean;
    modificarLibros: boolean;
    inhabilitarUsuarios: boolean;
    inhabilitarLibros: boolean;
  };
  reservas: ReservationType[];
  activo: boolean;
};

//esquemas de mongoose
const ReservationSchema = new Schema<ReservationType>({
  libroId: { type: Schema.Types.ObjectId, ref: "Libro", required: true },
  nombreLibro: { type: String, required: true },
  fechaReserva: { type: Date, required: true },
  fechaEntrega: { type: Date, required: true },
});

const UserSchema = new Schema<UserType>(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    permisos: {
      crearLibros: { type: Boolean, default: false },
      modificarUsuarios: { type: Boolean, default: false },
      modificarLibros: { type: Boolean, default: false },
      inhabilitarUsuarios: { type: Boolean, default: false },
      inhabilitarLibros: { type: Boolean, default: false },
    },
    reservas: [ReservationSchema],
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Modelo de mongo
const UserModel = model<UserType>("User", UserSchema);

export { UserModel, UserSchema, UserType };
