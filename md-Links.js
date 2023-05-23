
import {
  extractLinksFromFile,
  extractLinksFromDirectory,
  getAbsolutePath,getStats
} from "./utils.js";
/* Esta función recibe una ruta y opciones, y retorna una promesa que resuelve a un array de objetos con información de los links 
encontrados en la ruta.*/
export const mdLinks = (pathArg, options) => {
  //se obtiene la ruta absoluta del archivo, independientemente de si se proporcionó una ruta relativa o absoluta como argumento en pathArg.
  const absolutePath = getAbsolutePath(pathArg);
  return new Promise((resolve, reject) => {
    getStats(absolutePath).then((stats) => {
      // Si la ruta es un archivo, se llama a la función extractLinksFromFile.
      if (stats.isFile()) {
        extractLinksFromFile(absolutePath, options)
          .then((links) => resolve(links))
          .catch((err) => reject(err));
      } else if (stats.isDirectory()) {
        // Si la ruta es un directorio, se llama a la función extractLinksFromDirectory.
        extractLinksFromDirectory(absolutePath, options)
          .then((links) => resolve(links))
          .catch((err) => reject(err));
      } else {
        reject(new Error(`La ruta ${absolutePath} no es un archivo ni un directorio`))
        // Si la ruta no es un archivo ni un directorio, se rechaza la promesa con un error.
      }
    });
  });
};


















    // Si hay un error al leer la ruta, se rechaza la promesa con un error.
      // if (err) {
      //   return reject(new Error(`La ruta ${absolutePath} no existe`));
      // }