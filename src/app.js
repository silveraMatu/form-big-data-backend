import e from "express";
import router from "./routes/registrarRespuesta.router.js";

export const app = e()

app.use(e.json())
app.use("/api", router)