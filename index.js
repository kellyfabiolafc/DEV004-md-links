import {mdLinks}   from './md-Links.js';
import chalk from 'chalk';
import ora from 'ora';

const ruta = './archivoPrueba';
const opciones = { validate: false };

console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));

const spinner = ora({
  text: chalk.hex('#975AB6')('Cargando...'),
  spinner: 'moon'
}).start();


//Llamamos a la funcion y pasamos los parametros correspondientes
mdLinks(ruta, opciones )
.then((links) => { 
  spinner.stop(); // Detener el spinner
  console.log(chalk.hex('#975AB6').bold('Links encontrados' +  '\u2193'));// Mostrar mensaje de carga exitosa
  console.log('-'.repeat(100)); // Imprime una línea de guiones repetidos
    links.forEach((link) => {
      
      const hrefText = chalk.bgHex('#B6E2D3').hex('#E95F83').bold(' Href:   ') + '  \u2192  ' + chalk.hex('#B6E2D3')(link.href);
      const textText = chalk.bgHex('#FFB7C9').hex('#FFFFFF').bold(' Text:   ') + '  \u2192  ' + chalk.hex('#FFB7C9')(link.text);
      const fileText = chalk.bgHex('#FDE2CD').hex('#FFFFFF').bold(' File:   ') + '  \u2192  ' + chalk.hex('#FDE2CD')(link.file);
      console.log(hrefText);
      console.log(textText);
      console.log(fileText);

      // Verificar si se deben mostrar los campos status y ok
      if (link.status !== undefined && link.ok !== undefined) {
        const statusText = chalk.bgHex('#EF7C8E').bold(' Status: ') + '  \u2192  '+chalk.hex('#E95F83')(link.status);
        const okText = chalk.bgHex('#616D69').bold(' Message:') +'  \u2192  '+  chalk.hex('#616D69')(link.ok);
        console.log(statusText);
        console.log(okText);
      }
      console.log('-'.repeat(100)); // Imprime una línea de guiones repetidos
    });
    console.log(); // línea vacía
console.log(chalk.hex('#975AB6').bold('\t\t\t\t  Peticion cargada con exito! \n'));// Mostrar mensaje de carga exitosa
})
.catch((err) => {
  spinner.stop(); // Detener el spinner en caso de error
  console.error(err);
});

