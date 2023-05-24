#!/usr/bin/env node
import { mdLinks } from "./md-Links.js";
import chalk from "chalk";
import { argv } from 'node:process';
import ora from 'ora';
import figlet from 'figlet';
const path = argv[2];
const validate = argv[3] === '--validate';
const stats = argv[3] === '--stats';
const statsValidate = argv[3] === '--stats' && argv[4] === '--validate';
const help = argv.includes('--help');
const text = '      '+'Md.Links'
const txtPath=' Te mostrará los enlaces encontrados';
const txtValidate=' Te mostrará los enlaces con estado "OK" o "FAIL"';
const txtStats=' Te mostrará el número total de enlaces y los enlaces únicos';
const txtValYStats=' Te mostrará estadísticas de enlaces totales, únicos y rotos';
// const text = '            '+'Md.Links';

figlet.text(text, {
  font: 'Bloody',
  fontPath: './figlet-fonts/',
  width: 130,
}, (err, data) => {
  if (err) {
    console.log('Error al generar el texto ASCII:', err);
    return;
  }

  console.log(); // Línea vacía
  console.log(); // Línea vacía
  const pastelPinkText = chalk.hex('#A7E9AF')(data);
  console.log(pastelPinkText);
  console.log(chalk.hex('#487C5B').bold('\t\t\t\t\t\t\t\   By Fabiola Flores\n'))
  console.log(); // Línea vacía

  if (!path || !validate ) {
    console.log(
      chalk.hex('#A7D2CB')(`Por favor, ingrese una ruta o escriba ${chalk.hex('#D61355').bold('"--help"')} para ver las instrucciones`)
    );
    console.log(); // Línea vacía
  } 
  else if (help) {
console.log(chalk.hex('#FFB7C9').bold('Instrucciones de uso:'));
console.log();// Línea vacía
console.log(chalk.hex('#799352').bold('Para ejecutar md-link, utiliza el siguiente formato:'));
console.log();// Línea vacía
console.log(chalk.hex('#DFB98F').bold('  md-link <ruta-del-archivo> [opciones]'));
    console.log();// Línea vacía
    console.log(
`${chalk.hex('#799352').bold('A continuación, puedes utilizar las siguientes opciones:\n')}
${chalk.hex('#658239').inverse('      Sin Opciones    ')} ${chalk.hex('#658239').bold(`${txtPath}`)}
${chalk.hex('#799352').inverse('     "--validate"     ')} ${chalk.hex('#799352').bold(`${txtValidate}`)}
${chalk.hex('#B3C58B').inverse('      "--stats"       ')} ${chalk.hex('#B3C58B').bold(`${txtStats}`)}
${chalk.hex('#D9E0B7').inverse(' "--validate --stats" ')} ${chalk.hex('#D9E0B7').bold(`${txtValYStats}`)}
`);
  }
    if (path && validate) {
   //------------------------------------------
    const spinner = ora({
      text: chalk.hex('#975AB6')('Cargando...'),
      spinner: 'line'
    }).start();
   // ------------------------------------------
    mdLinks(path , { validate : true })
      .then((links) => {
        spinner.stop(); // Detener el spinner
        console.log(chalk.hex('#1A3F13').bold('Links encontrados' + '  \u2193')); // Mostrar mensaje de carga exitosa
        console.log('-'.repeat(100)); // Imprime una línea de guiones repetidos
        links.forEach((link) => {

          const hrefText = chalk.bgHex('#92B06C').hex('#010101').bold(' Href:   ') + '  \u2192  ' + chalk.hex('#92B06C').bold(link.href);
          const textText = chalk.bgHex('#A3C47A').hex('#010101').bold(' Text:   ') + '  \u2192  ' + chalk.hex('#A3C47A').bold(link.text);
          const fileText = chalk.bgHex('#C5D6AF').hex('#010101').bold(' File:   ') + '  \u2192  ' + chalk.hex('#C5D6AF').bold(link.file);
          console.log(hrefText);
          console.log(textText);
          console.log(fileText);

          // Verificar si se deben mostrar los campos status y ok
          if (link.status !== undefined && link.ok !== undefined) {
            const statusText = chalk.bgHex('#EF7C8E').bold(' Status: ') + '  \u2192  ' + chalk.hex('#E95F83')(link.status);
            const okText = chalk.bgHex('#616D69').bold(' Message:') + '  \u2192  ' + chalk.hex('#616D69')(link.ok);
            console.log(statusText);
            console.log(okText);
          }
          console.log('-'.repeat(100)); // Imprime una línea de guiones repetidos
        });
        console.log(); // Línea vacía
        console.log(chalk.hex('#1A3F13').bold('\t\t\t\t  Peticion cargada con exito! \n')); // Mostrar mensaje de carga exitosa
      })
      .catch((err) => {
        spinner.stop(); // Detener el spinner en caso de error
        console.error(err);
      });
  }
});
