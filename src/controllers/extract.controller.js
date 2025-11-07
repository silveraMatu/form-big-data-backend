import { prisma } from '../db.js';

/**
 * Controlador para obtener todos los datos de la encuesta consolidados.
 * Prepara los datos en un formato plano ideal para Power BI.
 * * @param {object} req - Objeto de solicitud (Request) de Express.
 * @param {object} res - Objeto de respuesta (Response) de Express.
 */
export const obtenerDatosConsolidados = async (req, res) => {
  try {
    // 1. Obtener todas las respuestas, incluyendo las tablas de detalle
    const respuestasRaw = await prisma.respuestas_Encuesta.findMany({
      select: {
        // Campos de la tabla principal
        id: true,
        fechaRegistro: true,
        edad: true,
        genero: true,
        franjaHoraria: true,
        frecuenciaEscucha: true,
        artistaSugerido: true,
        musicaEpoca: true,
        importanciaIdioma: true,
        interesProgramas: true,
        calidadTecnica: true,
        calidadSeleccion: true,
        franjaMasVariedad: true,
        comoNosEncontro: true,
        sugerenciaAdicional: true,
        
        // Incluir las tablas de relación (Q5 y Q6)
        lugaresEscucha: {
          select: {
            lugarEscucha: true, // Solo necesitamos el valor del lugar
          },
        },
        generos: {
          select: {
            generoMusical: true, // Solo necesitamos el valor del género
          },
        },
      },
      // Opcional: ordenar por fecha de registro
      orderBy: {
        fechaRegistro: 'desc',
      },
    });

    // 2. Aplanar y consolidar los datos para Power BI
    const datosConsolidados = respuestasRaw.map(respuesta => {
      
      // Extrae y une los lugares de escucha en un string separado por comas
      const lugares = respuesta.lugaresEscucha
        .map(l => l.lugarEscucha)
        .join(', ');

      // Extrae y une los géneros en un string separado por comas
      const generos = respuesta.generos
        .map(g => g.generoMusical)
        .join(', ');
      
      // Retorna un objeto plano listo para el análisis
      return {
        ID_Respuesta: respuesta.id,
        Fecha_Registro: respuesta.fechaRegistro,
        Edad: respuesta.edad,
        Genero: respuesta.genero,
        Franja_Horaria: respuesta.franjaHoraria,
        Frecuencia_Escucha: respuesta.frecuenciaEscucha,
        
        // Campos consolidados
        Lugares_Escucha_Consolidado: lugares, // Q5
        Generos_Preferidos_Consolidado: generos, // Q6
        
        // Resto de campos
        Artista_Sugerido: respuesta.artistaSugerido,
        Musica_Epoca: respuesta.musicaEpoca,
        Importancia_Idioma: respuesta.importanciaIdioma,
        Interes_Programas: respuesta.interesProgramas,
        Calidad_Tecnica: respuesta.calidadTecnica,
        Calidad_Seleccion: respuesta.calidadSeleccion,
        Franja_Mas_Variedad: respuesta.franjaMasVariedad,
        Como_Nos_Encontro: respuesta.comoNosEncontro,
        Sugerencia_Adicional: respuesta.sugerenciaAdicional,
      };
    });

    // 3. Respuesta exitosa
    return res.status(200).json(datosConsolidados);

  } catch (error) {
    console.error('Error al obtener los datos consolidados:', error);
    return res.status(500).json({ 
      mensaje: 'Error interno del servidor al obtener los datos.' 
    });
  }
};