const { selectCSVFile } = require('./collection');
const { selectRecommendationFile } = require('./recommendations');
const { compareCollections } = require('./compare');

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
