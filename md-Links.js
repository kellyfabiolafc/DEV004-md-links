import pathModule from 'path';
import fs from 'fs';
/* Esta función recibe una ruta y opciones, y retorna una promesa que resuelve a un array de objetos con información de los links 
encontrados en la ruta.*/
export const mdLinks = (pathArg, options) => {
  const absolutePath = pathModule.isAbsolute(pathArg) ? pathArg : pathModule.resolve(pathArg);

  return new Promise((resolve, reject) => {
    fs.stat(absolutePath, (err, stats) => {
         // Si hay un error al leer la ruta, se rechaza la promesa con un error.
      if (err) {
        return reject(new Error(`La ruta ${absolutePath} no existe`));
      }
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
           // Si la ruta no es un archivo ni un directorio, se rechaza la promesa con un error.
        reject(new Error(`La ruta ${absolutePath} no es un archivo ni un directorio`));
      }
    });
  });
};
/* Esta función recibe una ruta de un archivo y retorna una promesa que resuelve a un array de objetos con información de los links
 encontrados en el archivo.*/
const extractLinksFromFile = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
                 // Si hay un error al leer el archivo, se rechaza la promesa con un error.
        if (err) {
          return reject(err);
        }
  
        const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/gm;
        const links = [];
  
        let match;
        while ((match = regex.exec(data)) !== null) {
          // Se extrae la información de los links y se agrega al array de links.
          links.push({
            href: match[2],
            text: match[1],
            file: filePath,
          });
        }
  
        resolve(links);
      });
    });
  };
/* Esta función recibe una ruta de un directorio y opciones, y retorna una promesa que resuelve a un array
 de objetos con información de los links encontrados en los archivos Markdown del directorio y sus subdirectorios.*/
const extractLinksFromDirectory = (dirPath, options) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
           // Si hay un error al leer el directorio, se rechaza la promesa con un error.
        return reject(err);
      }

      const promises = files.map((file) => {
        const filePath = pathModule.join(dirPath, file);

        return new Promise((resolve) => {
          fs.stat(filePath, (err, stats) => {
            if (err) {
              // Si hay un error al leer el archivo, simplemente lo ignoramos
              resolve([]);
            } else if (stats.isDirectory()) {
              // Si el archivo es un directorio, llamamos recursivamente a extractLinksFromDirectory
              extractLinksFromDirectory(filePath, options)
                .then((links) => resolve(links))
                .catch(() => resolve([]));
            } else if (stats.isFile() && pathModule.extname(file) === '.md') {
              // Si el archivo es un archivo Markdown, llamamos a extractLinksFromFile
              extractLinksFromFile(filePath, options)
                .then((links) => resolve(links))
                .catch(() => resolve([]));
            } else {
              // Si el archivo no es un archivo Markdown, simplemente lo ignoramos
              resolve([]);
            }
          });
        });
      });

      Promise.all(promises)
        .then((results) => {
          const links = results.flat();
          resolve(links);
        })
        .catch((err) => reject(err));
    });
  });
};
