#!/usr/bin/env node
import { mdLinks } from "./md-Links.js";
import { argv } from "node:process";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";

const path = process.argv[2];
const validate = process.argv.includes("--validate");
const stats = process.argv.includes("--stats");
const help = argv.includes("--help");
const text = "      " + "Md.Links";
const messagePath = " Te mostrará los enlaces encontrados";
const messageValidate = ' Te mostrará los enlaces con estado "OK" o "FAIL"';
const messageStats = " Te mostrará el número total de enlaces y los enlaces únicos";
const messageValYStats =" Te mostrará estadísticas de enlaces totales, únicos y rotos";
const statsHeaderText = chalk.bgHex("#FFD700").hex("#010101").bold(" Stats:  ") + "\n";
const statsValidateHeaderText  = chalk.bgHex("#FFD700").hex("#010101").bold(" Stats && Validate : ") + "\n";
const successHeaderText = chalk.hex("#A7E9AF").bold("Links encontrados ") + "\u2193" + "\n";
const separatorLine  = chalk.hex("#A7E9AF").bold("⋆ ").repeat(58)+"\n";

figlet.text(
  text,
  {
    font: "Bloody",
    fontPath: "./figlet-fonts/",
    width: 130,
  },
  (err, data) => {
    if (err) {
      console.log("Error al generar el texto ASCII:", err);
      return;
    }
    console.log(); // Línea vacía
    console.log(); // Línea vacía
    const pastelPinkText = chalk.hex("#A7E9AF")(data);
    console.log(pastelPinkText);
    console.log(
      chalk.hex("#487C5B").bold("\t\t\t\t\t\t\t   By Fabiola Flores\n")
    );
    console.log(); // Línea vacía

    if (help) {

    console.log(chalk.hex("#FFB7C9").bold("Instrucciones de uso:"));
    console.log(); // Línea vacía
    console.log(chalk.hex("#799352").bold("Para ejecutar md-link, utiliza el siguiente formato:"));
    console.log(); // Línea vacía
    console.log(chalk.hex("#DFB98F").bold("  md-links <path-to-file> [--validate] [--stats]"));
    console.log(); // Línea vacía
    console.log( `${chalk.hex("#799352").bold("A continuación, puedes utilizar las siguientes opciones:\n")}
    ${chalk.hex("#658239").inverse("      Sin Opciones    ")} ${chalk.hex("#658239").bold(messagePath)}
    ${chalk.hex("#799352").inverse('     "--validate"     ')} ${chalk.hex("#799352").bold(messageValidate)}
    ${chalk.hex("#B3C58B").inverse('      "--stats"       ')} ${chalk.hex("#B3C58B").bold(messageStats)}
    ${chalk.hex("#D9E0B7").inverse(' "--validate --stats" ')} ${chalk.hex("#D9E0B7").bold(messageValYStats)}
    `);

    } else if (path && !validate && !stats) {

      const spinner = ora({
        text: chalk.hex("#A7E9AF")("Cargando..."),
        spinner: "moon",
       }).start();

       mdLinks(path, { validate: false })
        .then((links) => {
          spinner.stop();
          console.log(successHeaderText); // Mostrar mensaje de carga exitosa
          console.log(separatorLine ); // Imprime una línea de guiones repetidos
          links.forEach((link) => {
          const hrefText = chalk.bgHex("#92B06C").hex("#010101").bold(" Href:   ")+"  ➺  "+chalk.hex("#92B06C").bold(link.href);
          const textText =chalk.bgHex("#A3C47A").hex("#010101").bold(" Text:   ")+"  ➺  "+chalk.hex("#A3C47A").bold(link.text);
          const fileText =chalk.bgHex("#C5D6AF").hex("#010101").bold(" File:   ")+"  ➺  "+chalk.hex("#C5D6AF").bold(link.file);
          console.log(hrefText);
          console.log(textText);
          console.log(fileText);
          console.log();
          console.log(separatorLine ); // Imprime una línea de guiones repetidos
          });
        })
        .catch((err) => {
          spinner.stop();
          console.error(err);
        });
    } else if (path && validate && !stats) {

      const spinner = ora({
        text: chalk.hex("#A7E9AF")("Cargando..."),
        spinner: "moon",
      }).start();

      mdLinks(path, { validate: true })
        .then((links) => {
          spinner.stop();
          console.log(successHeaderText); // Mostrar mensaje de carga exitosa
          console.log(separatorLine ); // Imprime una línea de guiones repetidos
          links.forEach((link) => {
            const hrefText =chalk.bgHex("#92B06C").hex("#010101").bold(" Href:   ") +"  ➺  " +chalk.hex("#92B06C").bold(link.href);
            const textText =chalk.bgHex("#A3C47A").hex("#010101").bold(" Text:   ") +"  ➺  " +chalk.hex("#A3C47A").bold(link.text);
            const fileText =chalk.bgHex("#C5D6AF").hex("#010101").bold(" File:   ") +"  ➺  " +chalk.hex("#C5D6AF").bold(link.file);
            const statusText =chalk.bgHex("#EF7C8E").bold(" Status: ") +"  ➺  " +chalk.hex("#E95F83")(link.status);
            const okText =chalk.bgHex("#616D69").bold(" Message:") +"  ➺  " +chalk.hex("#616D69")(link.ok);
            console.log(hrefText);
            console.log(textText);
            console.log(fileText);
            console.log(statusText);
            console.log(okText);
            console.log();
            console.log(separatorLine ); // Imprime una línea de guiones repetidos
          });
        })
        .catch((err) => {
          spinner.stop();
          console.error(err);
        });

    } else if (path && !validate && stats) {

      const spinner = ora({
        text: chalk.hex("#A7E9AF")("Cargando..."),
        spinner: "moon",
      }).start();

       mdLinks(path, { validate: false })
        .then((links) => {
          spinner.stop();
          console.log(statsHeaderText);
          const totalText =chalk.hex("#FFD700").bold("Total:   ") + " " + links.length;
          const uniqueText =chalk.hex("#FFD700").bold("Unique:  ") +" " +[...new Set(links.map((link) => link.href))].length;
          console.log(totalText);
          console.log(uniqueText);
          console.log(); // Línea vacía
        })
        .catch((err) => {
          spinner.stop();
          console.error(err);
        });

    } else if (path && validate && stats) {

      const spinner = ora({
        text: chalk.hex("#A7E9AF")("Cargando..."),
        spinner: "moon",
      }).start();

      mdLinks(path, { validate: true })
        .then((links) => {
          spinner.stop();
          console.log(statsValidateHeaderText ); // Mostrar mensaje de carga exitosa
          const totalText =chalk.hex("#FFD700").bold("Total:   ") + " " + links.length;
          const uniqueText =chalk.hex("#FFD700").bold("Unique:  ") +" " + [...new Set(links.map((link) => link.href))].length;
          const brokenText =chalk.hex("#FFD700").bold("Broken:  ") +" " + links.filter((link) => link.status !== 200).length;
          console.log(totalText);
          console.log(uniqueText);
          console.log(brokenText);
          console.log(); // Línea vacía
        })
        .catch((err) => {
          spinner.stop();
          console.error(err);
        });

    } else {

      const primaryColor = "#A7D2CB";
      const secondaryColor = "#D61355";
      const helpText = '"--help"';
      const messagePart1 = chalk.hex(primaryColor)("Por favor, ingrese una ruta o escriba ");
      const messagePart2 = chalk.hex(secondaryColor).bold(helpText);
      const messagePart3 = chalk.hex(primaryColor)(" para ver las instrucciones");
      const message = messagePart1 + messagePart2 + messagePart3;
      console.log(message);
      console.log(); // Línea vacía
    }

  }
);
