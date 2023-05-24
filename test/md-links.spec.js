import { mdLinks } from "../md-Links.js";
import { getAbsolutePath, getStats ,readDir} from "../utils.js";
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

describe('readDir', () => {
  it('se resuelve con un array de nombres de archivos cuando el directorio existe', () => {
    const testDir = './directorio-de-prueba';
    const archivosEsperados = ['archivo1.txt', 'archivo2.txt'];

    // Mock de fs.readdir para simular la lectura del directorio
    fs.readdir = jest.fn((dirPath, callback) => {
      callback(null, archivosEsperados);
    });

    return readDir(testDir).then((archivos) => {
      expect(archivos).toEqual(archivosEsperados);
    });
  });

  it('se rechaza con un error cuando el directorio no existe', () => {
    const directorioNoExistente = './directorio-no-existente';

    // Mock de fs.readdir para simular un error al leer el directorio
    fs.readdir = jest.fn((dirPath, callback) => {
      const error = new Error('Directorio no encontrado');
      callback(error, null);
    });

    return expect(readDir(directorioNoExistente)).rejects.toThrow('Directorio no encontrado');
  });
});