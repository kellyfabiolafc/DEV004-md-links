import pathModule from 'path';
import fs from 'fs';

export const mdLinks = (pathArg, options) => {
  const absolutePath = pathModule.isAbsolute(pathArg) ? pathArg : pathModule.resolve(pathArg);

  return new Promise((resolve, reject) => {
    fs.stat(absolutePath, (err, stats) => {
      if (err) {
        return reject(new Error(`La ruta ${absolutePath} no existe`));
      }

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
    });
  });
};

const extractLinksFromFile = (filePath, options) => {
  // Implementar la lógica para extraer los links de un archivo Markdown
  // ...

  // Ejemplo de retorno
  return Promise.resolve([{ href: 'http://example.com', text: 'Link de ejemplo', file: filePath }]);
};

const extractLinksFromDirectory = (dirPath, options) => {
  // Implementar la lógica para procesar los archivos Markdown de forma recursiva
  // ...

  // Ejemplo de retorno
  return Promise.resolve([{ href: 'http://example.com', text: 'Link de ejemplo', file: pathModule.join(dirPath, 'archivo.md') }]);
};