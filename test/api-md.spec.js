import {
  getAbsolutePath,
  getStats,
  readDir,
  findLinks,
  fetchLinkStatus,
  readFile,
  isDirectory,
  isMarkdownFile,
  getLinkStats,
  isFile,
  checkMdFilesWithLinks,
} from "../src/api-md.js";
import pathModule from "path";
import fs from "fs";
import fetchMock from "jest-fetch-mock";

import "whatwg-fetch";
jest.mock("fs");
jest.mock("whatwg-fetch");

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
  it("debería resolver la promesa con los stats si la ruta existe", () => {
    const route = "/ruta/existente";
    const mockStats = { size: 100, isFile: () => true }; // Mock de los stats
    fs.stat.mockImplementation((path, callback) => {
      callback(null, mockStats);
    });

    return expect(getStats(route)).resolves.toEqual(mockStats); // Verificar que se resuelva con los stats esperados
  });

  it("debería rechazar la promesa con un error si la ruta no existe", () => {
    const route = "/ruta/inexistente";
    const mockError = new Error(`La ruta ${route} no existe`);
    fs.stat.mockImplementation((path, callback) => {
      callback(mockError);
    });

    return expect(getStats(route)).rejects.toThrow(mockError); // Verificar que se rechace la promesa con el error esperado
  });
});

describe("readDir", () => {
  it("se resuelve con un array de nombres de archivos cuando el directorio existe", () => {
    const testDir = "./directorio-de-prueba";
    const archivosEsperados = ["archivo1.txt", "archivo2.txt"];

    // Mock de fs.readdir para simular la lectura del directorio
    fs.readdir = jest.fn((dirPath, callback) => {
      callback(null, archivosEsperados);
    });

    return readDir(testDir).then((archivos) => {
      expect(archivos).toEqual(archivosEsperados);
    });
  });

  it("se rechaza con un error cuando el directorio no existe", () => {
    const directorioNoExistente = "./directorio-no-existente";

    // Mock de fs.readdir para simular un error al leer el directorio
    fs.readdir = jest.fn((dirPath, callback) => {
      const error = new Error("Directorio no encontrado");
      callback(error, null);
    });

    return expect(readDir(directorioNoExistente)).rejects.toThrow(
      "Directorio no encontrado"
    );
  });
});

describe("findLinks", () => {
  it("debería devolver un array de enlaces encontrados en el contenido", () => {
    const content =
      "Este es un [enlace](https://example.com) a un sitio web de ejemplo.";
    const filePath = "/ruta/al/archivo.md";

    const expectedLinks = [
      {
        href: "https://example.com",
        text: "enlace",
        file: "/ruta/al/archivo.md",
      },
    ];

    const result = findLinks(content, filePath);
    expect(result).toEqual(expectedLinks);
  });

  it("debería devolver un array vacío cuando no se encuentren enlaces en el contenido", () => {
    const content = "Este es un texto normal sin enlaces.";
    const filePath = "/ruta/al/archivo.md";

    const result = findLinks(content, filePath);
    expect(result).toEqual([]);
  });
});

describe("isDirectory", () => {
  it("debería devolver true si los stats indican que es un directorio", () => {
    const stats = {
      isDirectory: () => true,
    };

    const result = isDirectory(stats);
    expect(result).toBe(true);
  });

  it("debería devolver false si los stats no indican que es un directorio", () => {
    const stats = {
      isDirectory: () => false,
    };

    const result = isDirectory(stats);
    expect(result).toBe(false);
  });
});

describe("getLinkStats", () => {
  it("debería devolver las estadísticas totales y únicas de los enlaces", () => {
    const links = [
      { href: "https://example.com/page1", status: 200 },
      { href: "https://example.com/page2", status: 200 },
      { href: "https://example.com/page3", status: 200 },
    ];
    const options = { validate: false };

    const expectedStats = {
      Total: 3,
      Unique: 3,
    };

    const result = getLinkStats(links, options);
    expect(result).toEqual(expectedStats);
  });

  it('debería devolver las estadísticas totales, únicas y rotas de los enlaces cuando la opción "validate" es true', () => {
    const links = [
      { href: "https://example.com/page1", status: 200 },
      { href: "https://example.com/page2", status: 404 },
      { href: "https://example.com/page3", status: 200 },
    ];
    const options = { validate: true };

    const expectedStats = {
      Total: 3,
      Unique: 3,
      Broken: 1,
    };

    const result = getLinkStats(links, options);
    expect(result).toEqual(expectedStats);
  });

  it('debería devolver las estadísticas totales y únicas de los enlaces cuando no se proporciona la opción "validate"', () => {
    const links = [
      { href: "https://example.com/page1", status: 200 },
      { href: "https://example.com/page2", status: 200 },
      { href: "https://example.com/page3", status: 200 },
    ];
    const options = {};

    const expectedStats = {
      Total: 3,
      Unique: 3,
    };

    const result = getLinkStats(links, options);
    expect(result).toEqual(expectedStats);
  });
});

describe("isMarkdownFile", () => {
  it('debería devolver true si el archivo tiene extensión ".md"', () => {
    const file = "archivo.md";

    const result = isMarkdownFile(file);
    expect(result).toBe(true);
  });

  it('debería devolver false si el archivo no tiene extensión ".md"', () => {
    const file = "documento.txt";

    const result = isMarkdownFile(file);
    expect(result).toBe(false);
  });
});

describe("readFile", () => {
  it("debería leer el contenido del archivo y resolver con los datos", () => {
    const filePath = "/ruta/al/archivo.txt";
    const fileContent = "Contenido del archivo";

    fs.readFile.mockImplementation((path, options, callback) => {
      expect(path).toBe(filePath);
      expect(options).toBe("utf8");
      callback(null, fileContent);
    });

    return readFile(filePath).then((result) => {
      expect(result).toBe(fileContent);
    });
  });

  it("debería rechazar con el error si ocurre algún problema al leer el archivo", () => {
    const filePath = "/ruta/al/archivo.txt";
    const error = new Error("Error al leer el archivo");

    fs.readFile.mockImplementation((path, options, callback) => {
      expect(path).toBe(filePath);
      expect(options).toBe("utf8");
      callback(error);
    });

    return expect(readFile(filePath)).rejects.toThrow(error);
  });
});
describe("fetchLinkStatus", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("debería realizar la solicitud HTTP y resolver con el estado y el texto de respuesta del enlace", () => {
    const link = {
      href: "https://example.com",
    };
    const response = {
      status: 200,
      statusText: "OK",
    };

    fetchMock.mockResponse(JSON.stringify(response));

    return fetchLinkStatus(link).then((result) => {
      expect(result.status).toBe(response.status);
      expect(result.ok).toBe(response.statusText);
    });
  });

  it("debería resolver con un estado y texto de respuesta personalizados cuando ocurre un error en la solicitud HTTP", () => {
    const link = {
      href: "https://example89.com444",
    };
    const error = new Error("Error de conexión");

    fetchMock.mockReject(error);

    return fetchLinkStatus(link).then((result) => {
      expect(result.status).toBe(500);
      expect(result.ok).toBe("Internal Server Error");
    });
  });
});
describe("isFile", () => {
  test("debería devolver true para un objeto de estadísticas de archivo", () => {
    const statsArchivo = { isFile: () => true };
    expect(isFile(statsArchivo)).toBe(true);
  });

  test("debería devolver false para un objeto de estadísticas de directorio", () => {
    const statsDirectorio = { isFile: () => false };
    expect(isFile(statsDirectorio)).toBe(false);
  });
});

describe("checkMdFilesWithLinks", () => {
  it("debería devolver los enlaces si existen archivos Markdown con enlaces", () => {
    const enlaces = [
      {
        href: "https://example.com",
        text: "Enlace de ejemplo",
        file: "archivo1.md",
      },
      { href: "https://google.com", text: "Google", file: "archivo2.md" },
    ];

    const resultado = checkMdFilesWithLinks(enlaces);

    expect(resultado).toEqual(enlaces);
  });

  it("debería lanzar un error si no hay archivos Markdown con enlaces", () => {
    const enlaces = [
      new Error("No se encontraron enlaces en el archivo"),
      new Error("No se encontraron enlaces en el archivo"),
    ];

    expect(() => {
      checkMdFilesWithLinks(enlaces);
    }).toThrowError(
      "No se encontraron archivos Markdown con enlaces en el directorio"
    );
  });
});
