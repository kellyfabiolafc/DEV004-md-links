
import { mdLinks } from '../md-Links.js';
import { getAbsolutePath } from '../utils.js';
import pathModule from 'path';

describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});

describe('getAbsolutePath', () => {
  it('returns the absolute path for an absolute path argument', () => {
    const pathArg = '/Users/username/Documents/file.md';
    expect(getAbsolutePath(pathArg)).toBe(pathArg);
  });

  it('returns the absolute path for a relative path argument', () => {
    const pathArg = 'file.md';
    const expectedPath = pathModule.resolve(process.cwd(), pathArg);
    expect(getAbsolutePath(pathArg)).toBe(expectedPath);
  });
});
