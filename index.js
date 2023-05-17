import {mdLinks}   from './md-Links.js';
import chalk from 'chalk';


const ruta = './README.md';
 


console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));
//
mdLinks(ruta )
  .then((links) => console.log(links))
  .catch((err) => console.error(err));
