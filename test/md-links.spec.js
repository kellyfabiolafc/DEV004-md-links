import { mdLinks } from '../src/md-Links.js'; // Replace 'your-module' with the actual path to your module
import {  extractLinksFromFile, } from '../src/api-file.js'
import {
    extractLinksFromDirectory,
    getAbsolutePath,
    getStats,
  } from '../src/api-md.js'; // Reemplaza 'your-module' con la ruta real de tu módulo
  

  
    // Simula las funciones del módulo
    jest.mock('../src/api-file.js', () => ({
      extractLinksFromFile: jest.fn(),
    }));
    
  // Simula las funciones del módulo
  jest.mock('../src/api-md.js', () => ({
    extractLinksFromDirectory: jest.fn(),
    getAbsolutePath: jest.fn(),
    getStats: jest.fn(),
  }));
  describe('mdLinks', () => {
    //// Limpia todos los mocks después de cada prueba
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('debería resolver con un array de enlaces para un archivo', () => {
      const path = '/ruta/al/archivo.md';
      const options = {};
  
      const stats = { isFile: () => true };
      const links = [{ url: 'https://example.com', text: 'Ejemplo' }];
  
      // Simula el comportamiento de las funciones llamadas en la prueba
      getAbsolutePath.mockReturnValue('/ruta/al/archivo.md');
      getStats.mockResolvedValue(stats);
      extractLinksFromFile.mockResolvedValue(links);
  
      return mdLinks(path, options).then((result) => {
        expect(result).toEqual(links);
        expect(getAbsolutePath).toHaveBeenCalledWith(path); // Verifica que se llamó a getAbsolutePath con la ruta correcta
        expect(getStats).toHaveBeenCalledWith('/ruta/al/archivo.md'); // Verifica que se llamó a getStats con la ruta correcta
        expect(extractLinksFromFile).toHaveBeenCalledWith('/ruta/al/archivo.md', options); // Verifica que se llamó a extractLinksFromFile con los parámetros correctos
      });
    });
  
    test('debería resolver con un array de enlaces para un directorio', () => {
      const path = '/ruta/al/directorio';
      const options = {};
  
      const stats = { isFile: () => false, isDirectory: () => true };
      const links = [{ url: 'https://example.com', text: 'Ejemplo' }];
  
      // Simula el comportamiento de las funciones llamadas en la prueba
      getAbsolutePath.mockReturnValue('/ruta/al/directorio');
      getStats.mockResolvedValue(stats);
      extractLinksFromDirectory.mockResolvedValue(links);
  
      return mdLinks(path, options).then((result) => {
        expect(result).toEqual(links);
        expect(getAbsolutePath).toHaveBeenCalledWith(path); // Verifica que se llamó a getAbsolutePath con la ruta correcta
        expect(getStats).toHaveBeenCalledWith('/ruta/al/directorio'); // Verifica que se llamó a getStats con la ruta correcta
        expect(extractLinksFromDirectory).toHaveBeenCalledWith('/ruta/al/directorio', options); // Verifica que se llamó a extractLinksFromDirectory con los parámetros correctos
      });
    });
  
    test('debería rechazar con un error para una ruta inválida', () => {
      const path = '/ruta/invalida';
      const error = new Error(`La ruta ${path} no existe`);
  
      // Simula el comportamiento de las funciones llamadas en la prueba
      getAbsolutePath.mockReturnValue('/ruta/invalida');
      getStats.mockRejectedValue(error);
  
      return mdLinks(path).catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(`La ruta ${path} no es un archivo ni un directorio`);
        expect(getAbsolutePath).toHaveBeenCalledWith(path); // Verifica que se llamó a getAbsolutePath con la ruta correcta
        expect(getStats).toHaveBeenCalledWith('/ruta/invalida'); // Verifica que se llamó a getStats con la ruta correcta
      });
    });
  });
  