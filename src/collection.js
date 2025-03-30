const fs = require('fs');
const csv = require('csv-parser');
const inquirer = require('inquirer'); // Asegúrate de importar inquirer aquí
const path = require('path');

// Read CSV file (collection) from data folder
function readCollectionCSV(filePath) {
    return new Promise((resolve, reject) => {
        const collection = {};
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const key = `${row.Set}-${row.Number}`;
                collection[key] = {
                    count: parseInt(row.Normal, 10) || 0,
                    name: row.Name
                };
            })
            .on('end', () => resolve(collection))
            .on('error', reject);
    });
}

// Ask user which CSV file to read from the data folder
function selectCSVFile() {
    const dataDir = path.join(__dirname, '../data');
    return new Promise((resolve, reject) => {
        fs.readdir(dataDir, (err, files) => {
            if (err) return reject(err);

            // Filter CSV files
            const csvFiles = files.filter(file => file.endsWith('.csv'));

            // Ask user to select a file
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'fileName',
                    message: 'Select a CSV file to read:',
                    choices: csvFiles
                }
            ]).then(answers => {
                resolve(path.join(dataDir, answers.fileName)); // Ensure the full path is resolved
            }).catch(reject);
        });
    });
}

module.exports = { readCollectionCSV, selectCSVFile };
