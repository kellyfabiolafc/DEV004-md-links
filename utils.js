
import fs from "fs";
import pathModule from "path";
import 'whatwg-fetch';

//funcion que debería devolver una ruta absoluta
export const getAbsolutePath = (pathArg) => {
  return pathModule.isAbsolute(pathArg) ? pathArg : pathModule.resolve(pathArg);
};

//funcion que deberia resolver la promesa con los stats
export const getStats = (routeAbsolute) => {
  return new Promise((resolve, reject) => {
    fs.stat(routeAbsolute, (err, stats) => {
      // Si hay un error al leer la ruta, se rechaza la promesa con un error.
      if (err) {
        reject(new Error(`La ruta ${routeAbsolute} no existe`));
      }
      resolve(stats);
    });
  });
};


export const readDir = (dirPath) => {
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

export const readFile = (filePath) => {
  //retronar una promesa
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      //resolve
      resolve(data);
    });
  });
};

/*La función se encarga de leer el contenido de un archivo en el sistema de archivos y extraer los enlaces que encuentre en él.*/

export const extractLinksFromFile = (filePath, options) => {
  return new Promise((resolve, reject) => {
    readFile(filePath)
      .then((content) => {
        const links = findLinks(content, filePath);

        if (options && options.validate) {
          validateLinks(links, options)
            .then(() => resolve(links))
            .catch((err) => reject(err));
        } else {
          resolve(links);
        }
      })
      .catch((err) => reject(err));
  });
};

export const findLinks = (content, filePath) => {
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
  
  return links;
};
const computeStats = (links, options) => {
  if (options && options.stats) {
    const stats = {
      Total: links.length,
      Unique: new Set(links.map((link) => link.href)).size
    };

    if (options.validate) {
      stats.Broken = links.filter((link) => link.status !== 200).length;
    }

    return { stats }; // Retorna un objeto con las propiedades "links" y "stats"
  } else {
    return { links }; // Retorna un objeto con la propiedad "links"
  }
};

export const validateLinks = (links, options) => {
  const promises = links.map((link) => {
    return new Promise((resolve) => {
      fetch(link.href)
        .then((res) => {
          link.status = res.status;
          link.ok = res.statusText;
          resolve(link);
        })
        .catch((err) => {
          if (err.response) {
            link.status = err.response.status;
            link.ok = err.response.statusText;
          } else {
            link.status = 500;
            link.ok = "Internal Server Error";
          }
          resolve(link);
        });
    });
  });

  return Promise.all(promises);
};

export const extractLinksFromDirectory = (dirPath, options) => {
  return new Promise((resolve, reject) => {
    readDir(dirPath).then((files) => {
      const promises = files.map((file) => {
        const filePath = pathModule.join(dirPath, file);

        return new Promise((resolve, reject) => {
          getStats(filePath).then((stats) => {
            if (stats.isDirectory()) {
              // Si el archivo es un directorio, llamamos recursivamente a extractLinksFromDirectory
              extractLinksFromDirectory(filePath, options)
                .then((links) => resolve(links))
                .catch(() => resolve([]));
            } else if (stats.isFile() && pathModule.extname(file) === ".md") {
              // Si el archivo es un archivo Markdown, llamamos a extractLinksFromFile
              extractLinksFromFile(filePath, options)
                .then((links) => resolve(links))
                .catch(() => reject(new Error(`La ruta ${filePath} no es md`)));
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






// export const extractLinksFromFile = (filePath, options) => {
//   return new Promise((resolve, reject) => {
//     readFile(filePath)
//       .then((content) => {
//         const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gm;
//         const links = [];

//         let match;
//         while ((match = regex.exec(content)) !== null) {
//           const link = {
//             href: match[2],
//             text: match[1],
//             file: filePath,
//           };
//           links.push(link);
//         }

//         if (options && options.validate) {
//           const promises = links.map((link) => {
//             return new Promise((resolve) => {
//               fetch(link.href)
//                 .then((res) => {
//                   link.status = res.status;
//                   link.ok = res.statusText;
//                   resolve(link);
//                 })
//                 .catch((err) => {
//                   if (err.response) {
//                     link.status = err.response.status;
//                     link.ok = err.response.statusText;
//                   } else {
//                     link.status = 500;
//                     link.ok = "Internal Server Error";
//                   }
//                   resolve(link);
//                 });
//             });
//           });

//           Promise.all(promises)
//             .then((validatedLinks) => {
//               if (options && options.stats) {
//                 const stats = {
//                   Total: validatedLinks.length,
//                   Unique: new Set(validatedLinks.map((link) => link.href)).size,
//                   Broken: validatedLinks.filter((link) => link.status !== 200).length,
//                 };
//                 resolve(stats);
//               } else {
//                 resolve(validatedLinks);
//               }
//             })
//             .catch((err) => reject(err));
//         } else if (options && options.stats) {
//           const stats = {
//             Total: links.length,
//             Unique: new Set(links.map((link) => link.href)).size,
//           };
//           resolve(stats);
//         } else {
//           resolve(links);
//         }
//       })
//       .catch((err) => reject(err));
//   });
// };