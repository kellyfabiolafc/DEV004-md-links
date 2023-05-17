
import { mdLinks } from '../md-Links.js';
import { getAbsolutePath } from '../utils.js';
import pathModule from 'path';

describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});

describe('getAbsolutePath', () => {
  it('devuelve la ruta absoluta para un argumento de ruta absoluta', () => {
    const pathArg = '/Users/username/Documents/file.md';
    expect(getAbsolutePath(pathArg)).toBe(pathArg);
  });

  it('devuelve la ruta absoluta para un argumento de ruta relativa', () => {
    const pathArg = 'file.md';
    const expectedPath = pathModule.resolve(process.cwd(), pathArg);
    expect(getAbsolutePath(pathArg)).toBe(expectedPath);
  });
});
