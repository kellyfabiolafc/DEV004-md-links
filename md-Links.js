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
const extractLinksFromFile = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
  
        const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/gm;
        const links = [];
  
        let match;
        while ((match = regex.exec(data)) !== null) {
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

const extractLinksFromDirectory = (dirPath, options) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
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
