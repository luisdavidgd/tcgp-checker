const { selectCSVFile } = require('./collection');
const { selectDeckFile } = require('./deck');
const { compareCollections } = require('./compare');
const { formatResults } = require('./formatResults');

// Main function to run the process
async function run() {
    try {
        const collectionFile = await selectCSVFile(); // User selects CSV from the 'data/' directory
        const deckFile = await selectDeckFile(); // User selects deck .txt from the 'decks/' directory

        const result = await compareCollections(collectionFile, deckFile);
        if (result) {
            formatResults(result);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
