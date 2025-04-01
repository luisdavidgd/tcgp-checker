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

// Ask user which .txt file to read from the decks folder
function selectDeckFile() {
    const decksDir = path.join(__dirname, '../decks');
    return new Promise((resolve, reject) => {
        fs.readdir(decksDir, (err, files) => {
            if (err) return reject(err);

            // Filter .txt files
            const txtFiles = files.filter(file => file.endsWith('.txt'));

            // Ask user to select a file
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'fileName',
                    message: 'Select a deck .txt file:',
                    choices: txtFiles
                }
            ]).then(answers => {
                resolve(path.join(decksDir, answers.fileName)); // Resolve full path
            }).catch(reject);
        });
    });
}

module.exports = { readDeck, selectDeckFile };
