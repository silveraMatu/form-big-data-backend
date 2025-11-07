import {prisma} from '../db.js';

/**
 * @typedef {object} FormularioRespuesta
 * @property {number} edad
 * @property {string} genero
 * @property {string} franjaHoraria
 * @property {string} frecuenciaEscucha
 * @property {string[]} lugaresEscucha - Array de lugares seleccionados (Q5)
 * @property {string[]} generos - Array de géneros seleccionados (Q6)
 * @property {string} artistaSugerido
 * @property {string} musicaEpoca
 * @property {string} importanciaIdioma
 * @property {string} interesProgramas
 * @property {string} calidadTecnica
 * @property {string} calidadSeleccion
 * @property {string} franjaMasVariedad
 * @property {string} comoNosEncontro
 * @property {string} [sugerenciaAdicional] - Opcional
 */

/**
 * Controlador para manejar la subida de una nueva respuesta de encuesta.
 * Utiliza una transacción para asegurar la consistencia de los datos.
 * * @param {object} req - Objeto de solicitud (Request) de Express.
 * @param {object} res - Objeto de respuesta (Response) de Express.
 */
export const registrarRespuesta = async (req, res) => {
  /** @type {FormularioRespuesta} */
  const datos = req.body; 

  try {
    // 1. Ejecutar la transacción: Si algo falla en los pasos internos, se revierte todo.
    const resultado = await prisma.$transaction(async (tx) => {
      
      // --- PASO A: Insertar la respuesta principal (Tabla Respuestas_Encuesta) ---
      const respuestaPrincipal = await tx.respuestas_Encuesta.create({
        data: {
          edad: datos.edad,
          genero: datos.genero,
          franjaHoraria: datos.franjaHoraria,
          frecuenciaEscucha: datos.frecuenciaEscucha,
          artistaSugerido: datos.artistaSugerido,
          musicaEpoca: datos.musicaEpoca,
          importanciaIdioma: datos.importanciaIdioma,
          interesProgramas: datos.interesProgramas,
          calidadTecnica: datos.calidadTecnica,
          calidadSeleccion: datos.calidadSeleccion,
          franjaMasVariedad: datos.franjaMasVariedad,
          comoNosEncontro: datos.comoNosEncontro,
          sugerenciaAdicional: datos.sugerenciaAdicional || null, // Usar null si es opcional y no viene
        },
      });

      const respuestaId = respuestaPrincipal.id;

      // --- PASO B: Insertar selecciones múltiples de Lugares (Tabla Lugares_Escucha) ---
      // Prepara los datos para inserción masiva (createMany).
      const dataLugares = datos.lugaresEscucha.map(lugar => ({
        respuestaId: respuestaId,
        lugarEscucha: lugar,
      }));
      if (dataLugares.length > 0) {
        await tx.lugares_Escucha.createMany({
          data: dataLugares,
        });
      }

      // --- PASO C: Insertar selecciones múltiples de Géneros (Tabla Preferencias_Generos) ---
      // Prepara los datos para inserción masiva (createMany).
      const dataGeneros = datos.generos.map(genero => ({
        respuestaId: respuestaId,
        generoMusical: genero,
      }));
      if (dataGeneros.length > 0) {
        await tx.preferencias_Generos.createMany({
          data: dataGeneros,
        });
      }

      // Retorna la respuesta principal con el ID generado.
      return respuestaPrincipal;
    });

    // 2. Respuesta exitosa
    return res.status(201).json({ 
      mensaje: '¡Encuesta registrada con éxito!', 
      id: resultado.id 
    });

  } catch (error) {
    // 3. Manejo de errores de transacción o DB
    console.error('Error al registrar la encuesta:', error);
    return res.status(500).json({ 
      mensaje: 'Error interno del servidor al guardar la encuesta.',
      error: error.message
    });
  }
};