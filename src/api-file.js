import { isMarkdownFile,readFile,findLinks,getLinkStats,fetchLinkStatus} from './api-md.js'
/*La función se encarga de leer el contenido de un archivo en el sistema de archivos y extraer los enlaces que encuentre en él.*/
export const extractLinksFromFile = (filePath, options) => {
    return new Promise((resolve, reject) => {
      if (!isMarkdownFile(filePath)) {
        throw new Error("La ruta no es un archivo Markdown (.md)");
      }
      readFile(filePath)
        .then((content) => {
        const links = findLinks(content, filePath)
     
        if (links.length === 0) {
          throw new Error("La ruta no contiene enlaces");
        }
          if (options && options.validate) {
            const promises = links.map((link) => fetchLinkStatus(link));
  
            Promise.all(promises)
              .then((validatedLinks) => {
                if (options && options.stats) {
                  const stats = getLinkStats(validatedLinks, options);
                  resolve(stats);
                } else {
                  resolve(validatedLinks);
                }
              })
              .catch((err) => reject(err));
          } else if (options && options.stats) {
            const stats = getLinkStats(links, options);
            resolve(stats);
          } else {
            resolve(links);
          }
        })
        .catch((err) => reject(err));
    });
  };