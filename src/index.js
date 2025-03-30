const fs = require('fs');
const csv = require('csv-parser');
const inquirer = require('inquirer');
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

// Ask user which CSV file to read from the data folder
function selectCSVFile() {
    const dataDir = path.join(__dirname, '../data'); // Cambié de 'src/data' a '../data'
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

// Compare collections and recommendations
async function compareCollections(collectionFile, recommendationFile) {
    try {
        const collection = await readCollectionCSV(collectionFile);
        const recommendations = await readDeckRecommendations(recommendationFile);
        
        const missingCards = [];
        
        Object.entries(recommendations).forEach(([key, { quantity, name }]) => {
            const owned = collection[key]?.count || 0;
            if (owned < quantity) {
                missingCards.push({ key, name, needed: quantity, owned, missing: quantity - owned });
            }
        });
        
        console.log('Missing Cards:', missingCards);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Main function to run the process
async function run() {
    try {
        const collectionFile = await selectCSVFile(); // User selects CSV from the 'data/' directory
        const recommendationFile = await selectRecommendationFile(); // User selects recommendation .txt from the 'recommendations/' directory

        await compareCollections(collectionFile, recommendationFile);
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
