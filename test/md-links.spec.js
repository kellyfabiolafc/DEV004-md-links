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
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('debería resolver con un array de enlaces para un archivo', () => {
      const path = '/ruta/al/archivo.md';
      const options = {};
  
      const stats = { isFile: () => true };
      const links = [{ url: 'https://example.com', text: 'Ejemplo' }];
  
      getAbsolutePath.mockReturnValue('/ruta/al/archivo.md');
      getStats.mockResolvedValue(stats);
      extractLinksFromFile.mockResolvedValue(links);
  
      return mdLinks(path, options).then((result) => {
        expect(result).toEqual(links);
        expect(getAbsolutePath).toHaveBeenCalledWith(path);
        expect(getStats).toHaveBeenCalledWith('/ruta/al/archivo.md');
        expect(extractLinksFromFile).toHaveBeenCalledWith('/ruta/al/archivo.md', options);
      });
    });
  
    test('debería resolver con un array de enlaces para un directorio', () => {
      const path = '/ruta/al/directorio';
      const options = {};
  
      const stats = { isFile: () => false, isDirectory: () => true };
      const links = [{ url: 'https://example.com', text: 'Ejemplo' }];
  
      getAbsolutePath.mockReturnValue('/ruta/al/directorio');
      getStats.mockResolvedValue(stats);
      extractLinksFromDirectory.mockResolvedValue(links);
  
      return mdLinks(path, options).then((result) => {
        expect(result).toEqual(links);
        expect(getAbsolutePath).toHaveBeenCalledWith(path);
        expect(getStats).toHaveBeenCalledWith('/ruta/al/directorio');
        expect(extractLinksFromDirectory).toHaveBeenCalledWith('/ruta/al/directorio', options);
      });
    });
  
    test('debería rechazar con un error para una ruta inválida', () => {
      const path = '/ruta/invalida';
      const error = new Error('Ruta inválida');
  
      getAbsolutePath.mockReturnValue('/ruta/invalida');
      getStats.mockRejectedValue(error);
  
      return mdLinks(path).catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Ruta inválida');
        expect(getAbsolutePath).toHaveBeenCalledWith(path);
        expect(getStats).toHaveBeenCalledWith('/ruta/invalida');
      });
    });
  });