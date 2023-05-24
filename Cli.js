#!/usr/bin/env node
import { mdLinks } from "./md-Links.js";
import chalk from "chalk";
import { argv } from 'node:process';
import ora from 'ora';
import figlet from 'figlet';


const path = process.argv[2];
const validate = process.argv.includes('--validate');
const stats = process.argv.includes('--stats');
const help = argv.includes('--help');
const text = '      '+'Md.Links';
const txtPath=' Te mostrará los enlaces encontrados';
const txtValidate=' Te mostrará los enlaces con estado "OK" o "FAIL"';
const txtStats=' Te mostrará el número total de enlaces y los enlaces únicos';
const txtValYStats=' Te mostrará estadísticas de enlaces totales, únicos y rotos';

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

  if (!path) {
    console.log(
      chalk.hex('#A7D2CB')(`Por favor, ingrese una ruta o escriba ${chalk.hex('#D61355').bold('"--help"')} para ver las instrucciones`)
    );
    console.log(); // Línea vacía
  } else if (help) {console.log(chalk.hex('#FFB7C9').bold('Instrucciones de uso:'));
  console.log();// Línea vacía
  console.log(chalk.hex('#799352').bold('Para ejecutar md-link, utiliza el siguiente formato:'));
  console.log();// Línea vacía
  console.log(chalk.hex('#DFB98F').bold('md-links <path-to-file> [--validate] [--stats]'));
      console.log();// Línea vacía
      console.log(
  `${chalk.hex('#799352').bold('A continuación, puedes utilizar las siguientes opciones:\n')}
  ${chalk.hex('#658239').inverse('      Sin Opciones    ')} ${chalk.hex('#658239').bold(`${txtPath}`)}
  ${chalk.hex('#799352').inverse('     "--validate"     ')} ${chalk.hex('#799352').bold(`${txtValidate}`)}
  ${chalk.hex('#B3C58B').inverse('      "--stats"       ')} ${chalk.hex('#B3C58B').bold(`${txtStats}`)}
  ${chalk.hex('#D9E0B7').inverse(' "--validate --stats" ')} ${chalk.hex('#D9E0B7').bold(`${txtValYStats}`)}
  `);
  }
  if (path && !validate && !stats) {
    mdLinks(path, { validate: false })
      .then((links) => {
        links.forEach((link) => {
          const hrefText = chalk.bgHex('#92B06C').hex('#010101').bold(' Href:   ') + '  \u2192  ' + chalk.hex('#92B06C').bold(link.href);
          const textText = chalk.bgHex('#A3C47A').hex('#010101').bold(' Text:   ') + '  \u2192  ' + chalk.hex('#A3C47A').bold(link.text);
          const fileText = chalk.bgHex('#C5D6AF').hex('#010101').bold(' File:   ') + '  \u2192  ' + chalk.hex('#C5D6AF').bold(link.file);
          console.log(hrefText);
          console.log(textText);
          console.log(fileText);
          console.log('-'.repeat(100)); // Imprime una línea de guiones repetidos
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (path && validate && !stats) {
    mdLinks(path, { validate: true })
      .then((links) => {
        links.forEach((link) => {
          const hrefText = chalk.bgHex('#92B06C').hex('#010101').bold(' Href:   ') + '  \u2192  ' + chalk.hex('#92B06C').bold(link.href);
          const textText = chalk.bgHex('#A3C47A').hex('#010101').bold(' Text:   ') + '  \u2192  ' + chalk.hex('#A3C47A').bold(link.text);
          const fileText = chalk.bgHex('#C5D6AF').hex('#010101').bold(' File:   ') + '  \u2192  ' + chalk.hex('#C5D6AF').bold(link.file);
          const statusText = chalk.bgHex('#EF7C8E').bold(' Status: ') + '  \u2192  ' + chalk.hex('#E95F83')(link.status);
          const okText = chalk.bgHex('#616D69').bold(' Message:') + '  \u2192  ' + chalk.hex('#616D69')(link.ok);
          console.log(hrefText);
          console.log(textText);
          console.log(fileText);
          console.log(statusText);
          console.log(okText);
          console.log('-'.repeat(100)); // Imprime una línea de guiones repetidos
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (path && !validate && stats) {
    mdLinks(path, { validate: false })
      .then((links) => {
        const totalText = chalk.hex('#FFD700').bold('Total:   ') + ' ' + links.length;
        const uniqueText = chalk.hex('#FFD700').bold('Unique:  ') + ' ' + [...new Set(links.map((link) => link.href))].length;
        console.log(totalText);
        console.log(uniqueText);
        console.log(); // Línea vacía
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (path && validate && stats) {
    mdLinks(path, { validate: true })
      .then((links) => {
        const totalText = chalk.hex('#FFD700').bold('Total:   ') + ' ' + links.length;
        const uniqueText = chalk.hex('#FFD700').bold('Unique:  ') + ' ' + [...new Set(links.map((link) => link.href))].length;
        const brokenText = chalk.hex('#FFD700').bold('Broken:  ') + ' ' + links.filter((link) => link.ok === 'Fail').length;
        console.log(totalText);
        console.log(uniqueText);
        console.log(brokenText);
        console.log(); // Línea vacía
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    console.log('Usage:');
    console.log('md-links <path-to-file> [--validate] [--stats]');
  }
});
