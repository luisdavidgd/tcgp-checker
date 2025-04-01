const { selectCSVFile } = require('./collection');
const { selectDeckFile } = require('./deck');
const { compareCollections } = require('./compare');

// Main function to run the process
async function run() {
    try {
        const collectionFile = await selectCSVFile(); // User selects CSV from the 'data/' directory
        const deckFile = await selectDeckFile(); // User selects deck .txt from the 'decks/' directory

        await compareCollections(collectionFile, deckFile);
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
