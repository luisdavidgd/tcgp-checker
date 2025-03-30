const fs = require('fs');
const inquirer = require('inquirer'); // Asegúrate de importar inquirer aquí
const path = require('path');

// Read the deck recommendation file
function readDeckRecommendations(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return reject(err);
            
            const lines = data.split('\n').filter(line => line.trim() && !line.startsWith('Supporter') && !line.startsWith('Item'));
            const recommendations = {};
            
            lines.forEach(line => {
                const parts = line.split(' ');
                const quantity = parseInt(parts[0], 10);
                const name = parts.slice(1, parts.length - 2).join(' ');
                const set = parts[parts.length - 2];
                const number = parts[parts.length - 1];
                const key = `${set}-${number}`;
                recommendations[key] = { quantity, name };
            });
            
            resolve(recommendations);
        });
    });
}

// Ask user which .txt file to read from the recommendations folder
function selectRecommendationFile() {
    const recommendationsDir = path.join(__dirname, '../recommendations'); // Cambié de 'src/recommendations' a '../recommendations'
    return new Promise((resolve, reject) => {
        fs.readdir(recommendationsDir, (err, files) => {
            if (err) return reject(err);

            // Filter .txt files
            const txtFiles = files.filter(file => file.endsWith('.txt'));

            // Ask user to select a file
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'fileName',
                    message: 'Select a recommendations .txt file:',
                    choices: txtFiles
                }
            ]).then(answers => {
                resolve(path.join(recommendationsDir, answers.fileName)); // Resolve full path
            }).catch(reject);
        });
    });
}

module.exports = { readDeckRecommendations, selectRecommendationFile };
