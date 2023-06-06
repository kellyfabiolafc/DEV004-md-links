import { isMarkdownFile,readFile,findLinks,getLinkStats,fetchLinkStatus} from './api-md.js'
/*La función se encarga de leer el contenido de un archivo en el sistema de archivos y extraer los enlaces que encuentre en él.*/
export const extractLinksFromFile = (filePath, options) => {
  return new Promise((resolve, reject) => {
    // Verificar si la ruta del archivo es un archivo Markdown
    if (!isMarkdownFile(filePath)) {
      throw new Error("La ruta no es un archivo Markdown (.md)");
    }
    
    // Leer el contenido del archivo
    readFile(filePath)
      .then((content) => {
        // Encontrar los enlaces en el contenido del archivo
        const links = findLinks(content, filePath);

        // Si no se encontraron enlaces, lanzar un error
        if (links.length === 0) {
          throw new Error("La ruta no contiene enlaces");
        }

        if (options && options.validate) {
          // Si se solicita la validación de enlaces, realizar la validación
          const promises = links.map((link) => fetchLinkStatus(link));
          //map() para crear un array de promesas basado en links
          Promise.all(promises)
          //para esperar a que todas las promesas se resuelvan. 
            .then((validatedLinks) => {
              if (options && options.stats) {
                // Si se solicita la generación de estadísticas, generar las estadísticas sobre los enlaces
                const stats = getLinkStats(validatedLinks, options);
                resolve(stats);
              } else {
                // Devolver los enlaces validados
                resolve(validatedLinks);
              }
            })
            .catch((err) => reject(err));
        } else if (options && options.stats) {
          // Si solo se solicitan estadísticas sin validación, generar las estadísticas sobre los enlaces encontrados
          const stats = getLinkStats(links, options);
          resolve(stats);
        } else {
          // Devolver los enlaces encontrados sin validación ni estadísticas
          resolve(links);
        }
      })
      .catch((err) => reject(err));
  });
};