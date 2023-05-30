import { extractLinksFromFile } from '../src/api-file.js';
import * as apiMd from '../src/api-md.js';

jest.mock('../src/api-md.js', () => ({
  isMarkdownFile: jest.fn((filePath) => {
    return true;
  }),
  readFile: jest.fn((filePath) => {
    return Promise.resolve('Contenido del archivo');
  }),
  findLinks: jest.fn((content, filePath) => {
    return ['<https://www.ejemplo.com>', '<https://www.otroejemplo.com>'];
  }),
  fetchLinkStatus: jest.fn((link) => {
    return Promise.resolve({ link, status: 200 });
  }),
  getLinkStats: jest.fn((links, options) => {
    return { total: links.length, unique: 2 };
  }),
}));

describe('extractLinksFromFile', () => {
  test('extrae enlaces de un archivo Markdown', () => {
    const filePath = '/ruta/al/archivo.md';
    const options = { validate: true, stats: true };

    return extractLinksFromFile(filePath, options).then((result) => {
      expect(result).toEqual({ total: 2, unique: 2 });
      expect(apiMd.isMarkdownFile).toHaveBeenCalledWith(filePath);
      expect(apiMd.readFile).toHaveBeenCalledWith(filePath);
      expect(apiMd.findLinks).toHaveBeenCalledWith('Contenido del archivo', filePath);
      expect(apiMd.fetchLinkStatus).toHaveBeenCalledTimes(2);
      expect(apiMd.getLinkStats).toHaveBeenCalledWith(
        [
          { link: '<https://www.ejemplo.com>', status: 200 },
          { link: '<https://www.otroejemplo.com>', status: 200 },
        ],
        options
      );
    });
  });

  test('rechaza si el archivo no es un archivo Markdown', () => {
    const filePath = '/ruta/al/archivo.js';
    const options = { validate: true, stats: true };

    apiMd.isMarkdownFile.mockReturnValue(false);

    return expect(extractLinksFromFile(filePath, options)).rejects.toThrow(
      'La ruta no es un archivo Markdown (.md)'
    );
  });
  // test('rechaza si no se encuentran enlaces en la ruta', () => {
  //   const path = '/ruta/al/archivo.md';
  //   const options = { validate: true, stats: true };

  //   // Simula que no se encuentran enlaces en el contenido
  //   apiMd.findLinks.mockReturnValue([]);

  //   return expect(extractLinksFromFile(path, options)).rejects.toThrow('La ruta no contiene enlaces');
  // });

});

