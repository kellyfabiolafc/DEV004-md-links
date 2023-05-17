import {mdLinks}   from './md-Links.js';
import chalk from 'chalk';


const ruta = './README.md';
 
const opciones = { validate: true };

console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));
//
mdLinks(ruta , opciones)
  .then((links) => console.log(links))
  .catch((err) => console.error(err));
  // .then((links) => {
  //   links.forEach((link) => {
  //     console.log(chalk.blue(link.href)); // Imprimir el enlace en color azul
  //     console.log(chalk.gray(link.text)); // Imprimir el texto del enlace en color gris
  //     console.log(chalk.green(link.file)); // Imprimir el estado del enlace en color verde
  //     console.log(''); // Imprimir una línea en blanco entre cada enlace
  //   });
  // })