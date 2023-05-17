import {mdLinks}   from './md-Links.js';
import { showLoading } from './utils.js'
import chalk from 'chalk';

// 'C:/Users/CRISTEL/Desktop/DEV004-md-links'
const ruta = './README.md';
 
const opciones = { validate: true };

console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));


const loadingInterval = showLoading(); // Mostrar mensaje de carga

mdLinks(ruta, opciones )
.then((links) => { 
  clearInterval(loadingInterval);
  process.stdout.clearLine(); // Limpiar la línea actual en la consola
  process.stdout.cursorTo(0); // Mover el cursor al principio de la línea
  links.forEach((link) => {
    console.log(chalk.hex('#FF69B4')(`Href: ${chalk.blue(link.href)}`)); // Imprimir el enlace en color azul
    console.log(chalk.hex('#FF69B4')(`Text: ${chalk.blue(link.text)}`)); 
    console.log(chalk.hex('#FF69B4')(`File: ${chalk.blue(link.file)}`)); 
 

    // Verificar si se deben mostrar los campos status y ok
    if (link.status !== undefined && link.ok !== undefined) {
      console.log(chalk.hex('#FF69B4')(`Status: ${chalk.green(link.status)}`)); // Imprimir el status del enlace en color rosa
      console.log(chalk.hex('#FF69B4')(`Ok: ${chalk.green(link.ok)}`)); // Imprimir el campo ok del enlace en color rosa
    }

    console.log(''); // Imprimir una línea en blanco entre cada enlace
  });

  console.log(chalk.bgHex('#7FFF7F').hex('#FFFFFF')('\t\t\t\t\t Peticion cargada con exito! \n\n'));// Mostrar mensaje de carga exitosa
})
.catch((err) => console.error(err));




  // .then((links) => {
  //   links.forEach((link) => {
  //     console.log(chalk.blue(link.href)); // Imprimir el enlace en color azul
  //     console.log(chalk.gray(link.text)); // Imprimir el texto del enlace en color gris
  //     console.log(chalk.green(link.file)); // Imprimir el estado del enlace en color verde
  //     console.log(''); // Imprimir una línea en blanco entre cada enlace
  //   });
  // })