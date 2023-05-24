
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
      const links = findLinks(content, filePath)
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


const fetchLinkStatus = (link) => {
  return new Promise((resolve) => {
    fetch(link.href)
      .then((res) => {
        link.status = res.status;
        link.ok = res.statusText;
        resolve(link);
      })
      .catch((err) => {
        link.status = err.status || 500;
        link.ok = err.statusText || "Internal Server Error";
        resolve(link);
      });
  });
};

const getLinkStats = (links, options) => {
  const stats = {
    Total: links.length,
    Unique: new Set(links.map((link) => link.href)).size,
  };

  if (options.validate) {
    stats.Broken = links.filter((link) => link.status !== 200).length;
  }

  return stats;
};
export const extractLinksFromDirectory = (dirPath, options) => {
  return new Promise((resolve, reject) => {
    readDir(dirPath)
      .then((files) => {
        const promises = files.map((file) => {
          const filePath = pathModule.join(dirPath, file);

          return getStats(filePath)
            .then((stats) => {
              if (isDirectory(stats)) {
                return extractLinksFromDirectory(filePath, options)
                  .then((links) => links)
                  .catch(() => []);
              } else if (isMarkdownFile(file)) {
                return extractLinksFromFile(filePath, options)
                  .then((links) => links)
                  .catch(() => {
                    throw new Error(`La ruta ${filePath} no es md`);
                  });
              } else {
                return [];
              }
            })
            .catch((err) => {
              throw err;
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

const isMarkdownFile = (file) => {
  return pathModule.extname(file) === ".md";
};



const isDirectory = (stats) => {
  return stats.isDirectory();
};
