import {mdLinks}   from './md-Links.js';
import chalk from 'chalk';
import ora from 'ora';

const ruta = 'C:/Users/CRISTEL/Desktop/DEV004-md-links/archi.md';
const opciones = { validate:true , stats:false };

console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));

const spinner = ora({
  text: chalk.hex('#975AB6')('Cargando...'),
  spinner: 'moon'
}).start();

//Llamamos a la funcion y pasamos los parametros correspondientes
mdLinks(ruta, opciones)
  .then((links) => {
    if (opciones.stats) {
      const statsText = chalk.bgHex('#FFD700').hex('#010101').bold(' Stats:  ') + '\n';
      const totalText = chalk.hex('#FFD700').bold('Total:   ') + ' ' + links.Total;
      const uniqueText = chalk.hex('#FFD700').bold('Unique:  ') + ' ' + links.Unique;
      let result = statsText + totalText + '\n' + uniqueText;

      if (opciones.validate) {
        const brokenText = chalk.hex('#FFD700').bold('Broken:  ') + ' ' + links.Broken;
        result += '\n' + brokenText;
      }

      console.log(result);
    } else {
      links.forEach((link) => {
        const hrefText = chalk.bgHex('#92B06C').hex('#010101').bold(' Href:   ') + '  \u2192  ' + chalk.hex('#92B06C').bold(link.href);
        const textText = chalk.bgHex('#A3C47A').hex('#010101').bold(' Text:   ') + '  \u2192  ' + chalk.hex('#A3C47A').bold(link.text);
        const fileText = chalk.bgHex('#C5D6AF').hex('#010101').bold(' File:   ') + '  \u2192  ' + chalk.hex('#C5D6AF').bold(link.file);
        console.log(hrefText);
        console.log(textText);
        console.log(fileText);

        if (opciones.validate) {
          const statusText = chalk.bgHex('#FFB347').hex('#010101').bold(' Status: ') + '  \u2192  ' + chalk.hex('#FFB347').bold(link.status);
          const okText = chalk.bgHex('#FFDAB9').hex('#010101').bold(' OK:     ') + '  \u2192  ' + chalk.hex('#FFDAB9').bold(link.ok);
          console.log(statusText);
          console.log(okText);
        }

        console.log(); // línea vacía
      });
    }
  })
  .catch((err) => {
    spinner.stop(); // Detener el spinner en caso de error
    console.log(err);
  });

