const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

// Read the deck file
function readDeck(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return reject(err);

            const lines = data.split('\n').filter(line => line.trim() && !line.startsWith('Supporter') && !line.startsWith('Item'));
            const deck = {};

            lines.forEach(line => {
                const parts = line.split(' ');
                const quantity = parseInt(parts[0], 10);
                const name = parts.slice(1, parts.length - 2).join(' ');
                const set = parts[parts.length - 2];
                const number = parts[parts.length - 1];
                const key = `${set}-${number}`;
                deck[key] = { quantity, name };
            });

            resolve(deck);
        });
    });
}

// Get a list of subdirectories in the decks folder
function getSubdirectories(dir) {
    return fs.readdirSync(dir)
        .filter(file => fs.statSync(path.join(dir, file)).isDirectory())
        .map(folder => ({ name: `📂 ${folder}`, value: folder }));
}

// Get a list of .txt files in a given directory
function getTxtFiles(dir) {
    return fs.readdirSync(dir)
        .filter(file => file.toLowerCase().endsWith('.txt'))
        .map(file => ({ name: `📄 ${file}`, value: file }));
}

// Ask user to select a deck file from a chosen subdirectory (or main folder)
async function selectDeckFile() {
    const decksDir = path.join(__dirname, '../decks');
    let selectedDir = decksDir;

    while (true) {
        const subdirs = getSubdirectories(selectedDir);
        const txtFiles = getTxtFiles(selectedDir);

        let choices = [];

        // Si estamos dentro de una subcarpeta, agregar opción para regresar
        if (selectedDir !== decksDir) {
            choices.push({ name: '🔙 Go Back', value: '[Go Back]' });
        } else {
            choices.push({ name: '🏠 Main Folder', value: '[Main Folder]' });
        }

        // Agregar subdirectorios y archivos `.txt` como opciones
        choices = choices.concat(subdirs, txtFiles);

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'Select a deck category or file:',
                choices
            }
        ]);

        // Manejar navegación
        if (answer.selection === '[Go Back]') {
            selectedDir = path.dirname(selectedDir); // Volver al directorio padre
        } else if (answer.selection === '[Main Folder]') {
            selectedDir = decksDir; // Volver al directorio principal
        } else if (subdirs.some(item => item.value === answer.selection)) {
            selectedDir = path.join(selectedDir, answer.selection); // Entrar a la subcarpeta
        } else {
            return path.join(selectedDir, answer.selection); // Es un archivo `.txt`, lo retornamos
        }
    }
}

module.exports = { readDeck, selectDeckFile };
