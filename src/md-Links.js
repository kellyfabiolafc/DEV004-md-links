
import {
  extractLinksFromDirectory,
  getAbsolutePath,getStats
} from "./api-md.js";
import { extractLinksFromFile } from "./api-file.js";
/* Esta función recibe una ruta y opciones, y retorna una promesa que resuelve a un array de objetos con información de los links 
encontrados en la ruta.*/
export const mdLinks = (pathArg, options) => {
  const absolutePath = getAbsolutePath(pathArg);
  return new Promise((resolve, reject) => {
    getStats(absolutePath)
      .then((stats) => {
        if (stats.isFile()) {
          extractLinksFromFile(absolutePath, options)
            .then((links) => resolve(links))
            .catch((err) => reject(err));
        } else if (stats.isDirectory()) {
          extractLinksFromDirectory(absolutePath, options)
            .then((links) => resolve(links))
            .catch((err) => reject(err));
        } else {
          reject(new Error(`La ruta ${absolutePath} no es un archivo ni un directorio`));
        }
      })
      .catch((err) => reject(err));
  });
};





