import {mdLinks}   from './md-Links.js';
import chalk from 'chalk';
import ora from 'ora';

const ruta = 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archi.md';
const opciones = { validate: false};

console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));

const spinner = ora({
  text: chalk.hex('#975AB6')('Cargando...'),
  spinner: 'moon'
}).start();

//Llamamos a la funcion y pasamos los parametros correspondientes
// Llamamos a la función y pasamos los parámetros correspondientes
mdLinks(ruta, opciones)
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    spinner.stop(); // Detener el spinner en caso de error
    console.log(err);
  });