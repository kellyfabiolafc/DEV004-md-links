
import fs from "fs";
import pathModule from "path";
import 'whatwg-fetch';
import { extractLinksFromFile } from "./api-file.js";
//funcion que debería devolver una ruta absoluta
export const getAbsolutePath = (pathArg) => {
  return pathModule.isAbsolute(pathArg) ? pathArg : pathModule.resolve(pathArg);
};

//funcion que obtiene las estadísticas de un archivo o directorio especificado por la ruta absoluta. 
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

//Funcion para comprobar si la ruta es un archivo
export const isFile = (stats) => {
  return stats.isFile();
};


//Función para verificar si el archivo es de extension md
export const isMarkdownFile = (file) => {
  return pathModule.extname(file) === ".md";
};

//La función readFile lee un archivo en formato UTF-8 y devuelve su contenido como una promesa.
export const readFile = (filePath) => {
  //retronar una promesa
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

//La función findLinks encuentra y devuelve una lista de enlaces en un contenido dado.
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




//función se utiliza para realizar solicitudes HTTP a enlaces y obtener su estado y estado de texto. 
export const fetchLinkStatus = (link) => {
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

// calcula estadísticas sobre los enlaces, incluyendo el total de enlaces, enlaces únicos y enlaces rotos (si se realiza la validación).
export const getLinkStats = (links, options) => {
  const stats = {
    Total: links.length,
    Unique: new Set(links.map((link) => link.href)).size,
  };

  if (options.validate) {
    stats.Broken = links.filter((link) => link.status !== 200).length;
  }

  return stats;
};


//funcion para extraer links de un directorio en caso se encuentren archivos
export const extractLinksFromDirectory = (dirPath, options) => {
  return new Promise((resolve, reject) => {
    readDir(dirPath).then((files) => {
      const promises = files.map((file) => {
        const filePath = pathModule.join(dirPath, file);
        return new Promise((resolve) => {
          getStats(filePath).then((stats) => {
            if (isDirectory(stats)) {
              // Si el archivo es un directorio, llamamos recursivamente a extractLinksFromDirectory
              extractLinksFromDirectory(filePath, options)
                .then((links) => resolve(links))
                .catch(() => resolve([]));
            } else if (isFile(stats)) {
              // Si el archivo es un archivo Markdown, llamamos a extractLinksFromFile
              extractLinksFromFile(filePath, options)
                .then((links) => resolve(links))
                .catch((err) => resolve(err));
            } 
          });
        });
      });
      Promise.all(promises)
      .then((results) => {
        const links = results.flat();
        try {
          const validatedLinks = checkMdFilesWithLinks(links);
          resolve(validatedLinks);
        } catch (error) {
          reject(error);
        }
      })
      .catch((err) => reject(err));
  })
  .catch((err) => reject(err));
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


//Funcion para comprobar si la ruta es un directorio
export const isDirectory = (stats) => {
  return stats.isDirectory();
};

//función para verificar si hay enlaces válidos en una lista y manejar adecuadamente el caso en el que no se encuentren enlaces
export const checkMdFilesWithLinks = (links) => {
  const noMdFiles = links.every((link) => link instanceof Error);
  if (noMdFiles) {
    throw new Error("No se encontraron archivos Markdown con enlaces en el directorio");
  }
  return links;
};