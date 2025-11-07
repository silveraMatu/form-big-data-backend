import e from "express";
import router from "./routes/registrarRespuesta.router.js";
import cors from "cors"

export const app = e()

app.use(e.json())
app.use(cors({
  origin: 'http://localhost:3000' // <-- Cambia esto por tu URL de React
}));
app.use("/api", router)