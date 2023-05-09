import { mdLinks } from "./mdlinks.js";
import chalk from 'chalk';


const ruta = './DEV004-MD-LINKS';
const opciones = { validate: true };


console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));
//
mdLinks(ruta, opciones)
  .then((links) => console.log(links))
  .catch((err) => console.error(err));
