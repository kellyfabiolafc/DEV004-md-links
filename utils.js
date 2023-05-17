// import https from "https";
import fs from "fs";
import pathModule from "path";
import fetch from "node-fetch"
import chalk from "chalk";
// import { resolve } from "dns";

export const getAbsolutePath = (pathArg) => {
  return pathModule.isAbsolute(pathArg) ? pathArg : pathModule.resolve(pathArg);
};

export const getStats = (routeAbsolute) => {
  return new Promise((resolve, reject) => {
    fs.stat(routeAbsolute, (err, stats) => {
      // Si hay un error al leer la ruta, se rechaza la promesa con un error.
      if (err) {
       reject(new Error(`La ruta ${routeAbsolute} no existe`));;
      }
      resolve(stats);
    });
  });
};

const readFile = (filePath) => {
  //retronar una promesa
  return new Promise ((resolve, reject)=> {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        }
        //resolve
        resolve(data);
      });
  })
  
};




/*La función se encarga de leer el contenido de un archivo en el sistema de archivos y extraer los enlaces que encuentre en él.*/
export const extractLinksFromFile = (filePath, options) => {
  return new Promise((resolve, reject) => {
    readFile(filePath)
      .then((content) => {
        const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gm;
        const links = [];

        let match;
        while ((match = regex.exec(content)) !== null) {
          const link = {
            href: match[2],
            text: match[1],
            file: filePath,
          };
          links.push(link);
        }

        if (options && options.validate) {
          const promises = links.map((link) => {
            return new Promise((resolve) => {
              fetch(link.href)
                .then((res) => {
                  link.status = res.status;
                  link.ok = res.ok;
                  resolve(link);
                })
                .catch(() => {
                  link.status = 'Error';
                  link.ok = false;
                  resolve(link);
                });
            });
          });

          Promise.all(promises)
            .then((validatedLinks) => {
              resolve(validatedLinks);
            })
            .catch((err) => reject(err));
        } else {
          resolve(links);
        }
      })
      .catch((err) => reject(err));
  });
};

/* Esta función recibe una ruta de un directorio y opciones, y retorna una promesa que resuelve a un array
   de objetos con información de los links encontrados en los archivos Markdown del directorio y sus subdirectorios.*/
   export const extractLinksFromDirectory = (dirPath, options) => {
    return new Promise((resolve, reject) => {
      readDir(dirPath)
        .then((files) => {
          const promises = files.map((file) => {
            const filePath = pathModule.join(dirPath, file);
  
            return new Promise((resolve) => {
              getStats(filePath)
                .then((stats) => {
                  if (stats.isDirectory()) {
                    extractLinksFromDirectory(filePath, options)
                      .then((links) => resolve(links))
                      .catch(() => resolve([]));
                  } else if (stats.isFile() && path.extname(file) === '.md') {
                    extractLinksFromFile(filePath, options)
                      .then((links) => resolve(links))
                      .catch(() => resolve([]));
                  } else {
                    resolve([]);
                  }
                })
                .catch((err) => {
                  // Si hay un error al leer el archivo, simplemente lo ignoramos
                  resolve([]);
                });
            });
          });
  
          Promise.all(promises)
            .then((results) => {
              const links = results.flat();
              resolve(links);
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  };
  
  const readDir = (dirPath) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => {
        if (err) {
          // Si hay un error al leer el directorio, se rechaza la promesa con un error.
          reject(err);
        }
        resolve(files);
      });
    });
  };
  // Función para simular una barra de carga animada
export const showLoading = () => {
  let i = 0;
  const interval = setInterval(() => {
    i = (i + 1) % 4;
    const dots = '.'.repeat(i);
    const loadingText = chalk.green(`Cargando${dots}`).padStart(process.stdout.columns / 2);;
    process.stdout.write(`${loadingText}\r`);
  }, 300);

  return interval;
};

