import { mdLinks } from "../md-Links.js";
import { getAbsolutePath, getStats } from "../utils.js";
import pathModule from "path";
import fs from "fs";
import "whatwg-fetch";
jest.mock("fs");
describe("mdLinks", () => {
  it("should...", () => {
    console.log("FIX ME!");
  });
});

describe("getAbsolutePath", () => {
  it("debería devolver la ruta absoluta si se proporciona una ruta absoluta", () => {
    const absolutePath = getAbsolutePath("/ruta/absoluta");
    expect(absolutePath).toBe("/ruta/absoluta"); // Verificar que se devuelva la ruta absoluta sin cambios
  });

  it("debería devolver la ruta absoluta si se proporciona una ruta relativa", () => {
    const relativePath = "./ruta/relativa";
    const expectedAbsolutePath = pathModule.resolve(relativePath);
    const absolutePath = getAbsolutePath(relativePath);
    expect(absolutePath).toBe(expectedAbsolutePath); // Verificar que se devuelva la ruta absoluta correcta
  });
});

describe("getStats", () => {
  it("debería resolver la promesa con los stats si la ruta existe", async () => {
    const route = "/ruta/existente";
    const mockStats = { size: 100, isFile: () => true }; // Mock de los stats
    fs.stat.mockImplementation((path, callback) => {
      callback(null, mockStats);
    });

    await expect(getStats(route)).resolves.toEqual(mockStats); // Verificar que se resuelva con los stats esperados
    expect(fs.stat).toHaveBeenCalledWith(route, expect.any(Function)); // Verificar que fs.stat se haya llamado con la ruta correcta
  });

  it("debería rechazar la promesa con un error si la ruta no existe", async () => {
    const route = "/ruta/inexistente";
    const mockError = new Error(`La ruta ${route} no existe`);
    fs.stat.mockImplementation((path, callback) => {
      callback(mockError);
    });

    await expect(getStats(route)).rejects.toThrow(mockError); // Verificar que se rechace la promesa con el error esperado
    expect(fs.stat).toHaveBeenCalledWith(route, expect.any(Function)); // Verificar que fs.stat se haya llamado con la ruta correcta
  });
});




describe('mdLinks', () => {
  it('debería devolver los links de un archivo', async () => {
    const path = '../archi.md';
    const expected = [
      {
        Href: 'https://es.wikipedia.org/wiki/Markdown',
        Text: 'Markdown',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archi.md'
      },
      {
        Href: 'https://nodejsKELYYYYYYYYYYYYYYYYYYYYYY.org/es/',
        Text: 'Node.js',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archi.md'
      },
      {
        Href: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions',
        Text: 'Funciones — bloques de código reutilizables - MDN',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archi.md'
      },
      {
        Href: 'https://curriculum.laboratoria.la/es/topics/javascript/04-arrays',
        Text: 'Arreglos',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archi.md'
      }
    ];

    const result = await mdLinks(path);
    expect(result).toEqual(expected);
  });

  it('debería devolver los links de un directorio', async () => {
    const path = './archivoPrueba';
    const expected = [
      {
        Href: 'https://es.wikipedia.org/wiki/Markdown',
        Text: 'Markdown',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archivoPrueba/ARCHIVO.md'
      },
      {
        Href: 'https://nodejsKELYYYYYYYYYYYYYYYYYYYYYY.org/es/',
        Text: 'Node.js',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archivoPrueba/ARCHIVO.md'
      },
      {
        Href: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions',
        Text: 'Funciones — bloques de código reutilizables - MDN',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archivoPrueba/ARCHIVO.md'
      },
      {
        Href: 'https://curriculum.laboratoria.la/es/topics/javascript/04-arrays',
        Text: 'Arreglos',
        File: 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archivoPrueba/ARCHIVO.md'
      }
    ];

    const result = await mdLinks(path);
    expect(result).toEqual(expected);
  });

  it('debería devolver un error si la ruta no es un archivo ni un directorio', async () => {
    const path = 'C:/Users/CRISTEL/Desktop/DEV004-md-links/cli.js';
   
    await expect(mdLinks(path)).rejects.toThrow(
      'La ruta C:/Users/CRISTEL/Desktop/DEV004-md-links/cli.js no es un archivo ni un directorio'
    );
  });
});