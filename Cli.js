#!/usr/bin/env node
import { mdLinks } from "./md-Links.js";
import chalk from "chalk";
import {argv } from 'node:process';
import ora from 'ora';
console.log(); // línea vacía
console.log(chalk.hex('#FF69B4').bold('\t\t\t\t\t     Md Links \n'));
console.log(chalk.hex('#A9D6E5').bold('\t\t\t\t\t De Fabiola Flores \n\n'));

  
const path = argv[2];
const validate = argv[3] === '--validate';
const stats = argv[3] === '--stats';
const statsValidate = argv[3] === '--stats' && argv[4] === '--validate';
// const validateStats = argv[3] === '--validate' && argv[4] === '--stats';
const help = argv.includes('--help');
if (!path) {
    console.log(
        chalk.white(`Por favor, ingrese una ruta o escriba  ${chalk.hex('#D61355').bold('"--help"')} para ver las instrucciones`)
    );
} 
else if (help) {
    console.log(
        `${chalk.white.bold('YOU CAN USE THE FOLLOWING OPTIONS:')}
${chalk.hex('#A7D2CB').inverse('      Solo ruta       ')} ${chalk.hex('#A7D2CB').bold('Te mostrará los links')}
${chalk.hex('#F2D388').inverse('     "--validate"     ')} ${chalk.hex('#F2D388').bold('Te mostrará los links con  status ok or fail.')}
${chalk.hex('#C98474').inverse('      "--stats"       ')} ${chalk.hex('#C98474').bold('Te mostrará el total y unique links.')}
${chalk.hex('#874C62').inverse(' "--validate --stats" ')} ${chalk.hex('#874C62').bold('Te mostrará las estadísticas de enlaces totales, únicos y rotos..')}`);
}
else if (path) {
    const spinner = ora({
        text: chalk.hex('#975AB6')('Cargando...'),
        spinner: 'line'
      }).start();

    mdLinks(path , {validate:true})
    .then((links) => { 
      spinner.stop(); // Detener el spinner
      console.log(chalk.hex('#975AB6').bold('Links encontrados' +  '\u2193' ));// Mostrar mensaje de carga exitosa
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
    
}