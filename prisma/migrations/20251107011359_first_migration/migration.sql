-- CreateTable
CREATE TABLE "respuestas_encuesta" (
    "id" SERIAL NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edad" INTEGER NOT NULL,
    "genero" VARCHAR(20) NOT NULL,
    "franjaHoraria" VARCHAR(30) NOT NULL,
    "frecuenciaEscucha" VARCHAR(30) NOT NULL,
    "artistaSugerido" VARCHAR(255),
    "musicaEpoca" VARCHAR(50) NOT NULL,
    "importanciaIdioma" VARCHAR(30) NOT NULL,
    "interesProgramas" VARCHAR(50) NOT NULL,
    "calidadTecnica" VARCHAR(20) NOT NULL,
    "calidadSeleccion" VARCHAR(20) NOT NULL,
    "franjaMasVariedad" VARCHAR(30) NOT NULL,
    "comoNosEncontro" VARCHAR(30) NOT NULL,
    "sugerenciaAdicional" TEXT,

    CONSTRAINT "respuestas_encuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lugares_escucha" (
    "id" SERIAL NOT NULL,
    "respuestaId" INTEGER NOT NULL,
    "lugarEscucha" VARCHAR(50) NOT NULL,

    CONSTRAINT "lugares_escucha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferencias_generos" (
    "id" SERIAL NOT NULL,
    "respuestaId" INTEGER NOT NULL,
    "generoMusical" VARCHAR(50) NOT NULL,

    CONSTRAINT "preferencias_generos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lugares_escucha" ADD CONSTRAINT "lugares_escucha_respuestaId_fkey" FOREIGN KEY ("respuestaId") REFERENCES "respuestas_encuesta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferencias_generos" ADD CONSTRAINT "preferencias_generos_respuestaId_fkey" FOREIGN KEY ("respuestaId") REFERENCES "respuestas_encuesta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
