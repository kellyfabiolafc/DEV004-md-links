import https from "https";
import fs from "fs";
import pathModule from "path";
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
    //leer el archivo especificado en formato UTF-8. Si hay un error, se rechaza la promesa con el error.
    readFile(filePath).then((content) => {
      // busca enlaces dentro del contenido del archivo utilizando una expresión regular.
      const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gm;

      const links = [];

      let match;
      while ((match = regex.exec(content)) !== null) {
        links.push({
          href: match[2], // url encontrada
          text: match[1], // texto que representa el enlace
          file: filePath, // archivo en el que se encontró el enlace
        });
      }
      // si se especifica la opción "validate", se valida cada enlace encontrado haciendo una solicitud HTTP.
      if (options && options.validate) {
        const promises = links.map((url) => {
          return new Promise((resolve) => {
            
            https.get(url, (res) => {
                url.status = res.statusCode; // código de estado HTTP de la respuesta
                url.ok = res.statusCode >= 200 && res.statusCode < 300; // si el código de estado está entre 200 y 299 (éxito), la propiedad ok es true, de lo contrario es false.
                resolve(links);
              })
              .on("error", () => {
                url.status = "Error"; // si hay un error al hacer la solicitud HTTP, se almacena el mensaje de error en la propiedad status.
                url.ok = false; // la propiedad ok es false cuando hay un error.
                resolve(url);
              });
          });
        });
        // espera a que todas las promesas se resuelvan y devuelve los resultados.
        Promise.all(promises)
          .then((links) => {
            resolve(links);
          })
          .catch((err) => reject(err));
      } else {
        //// si no se especifica la opción "validate", se devuelve solo el arreglo de enlaces encontrados.
        resolve(links);
      }
    });
  });
};

/* Esta función recibe una ruta de un directorio y opciones, y retorna una promesa que resuelve a un array
   de objetos con información de los links encontrados en los archivos Markdown del directorio y sus subdirectorios.*/
   export const extractLinksFromDirectory = (dirPath, options) => {
    return new Promise((resolve, reject) => {
        readDir(dirPath).then((files) => {
            const promises = files.map((file) => {
                const filePath = pathModule.join(dirPath, file);
        
                return new Promise((resolve) => {
                  fs.stat(filePath, (err, stats) => {
                    if (err) {
                      // Si hay un error al leer el archivo, simplemente lo ignoramos
                      resolve("Error al leer el archivo");
                    } else if (stats.isDirectory()) {
                      // Si el archivo es un directorio, llamamos recursivamente a extractLinksFromDirectory
                      extractLinksFromDirectory(filePath, options)
                        .then((links) => resolve(links))
                        .catch(() => resolve([]));
                    } else if (stats.isFile() && pathModule.extname(file) === ".md") {
                      // Si el archivo es un archivo Markdown, llamamos a extractLinksFromFile
                      extractLinksFromFile(filePath, options)
                        .then((links) => resolve(links))
                        .catch(() => resolve([]));
                    } else {
                      // Si el archivo no es un archivo Markdown, simplemente lo ignoramos
                      resolve([]);
            }
              Promise.all(promises)
                .then((results) => {
                  const links = results.flat();
                  resolve(links);
                })
                .catch((err) => reject(err));
         
            })
        });
      });
    })
})
  };
     
  
        
  const readDir = (dirPath) => {
      return new Promise ((resolve, reject )=> {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
              // Si hay un error al leer el directorio, se rechaza la promesa con un error.
              reject(err);
            }
            resolve(files)
      })
  })};