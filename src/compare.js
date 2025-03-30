const { readCollectionCSV } = require('./collection');
const { readDeckRecommendations } = require('./recommendations');

// Compare collections and recommendations
async function compareCollections(collectionFile, recommendationFile) {
    try {
        const collection = await readCollectionCSV(collectionFile);
        const recommendations = await readDeckRecommendations(recommendationFile);

        const missingCards = [];

        // Iterate through recommendations and find missing cards
        Object.entries(recommendations).forEach(([key, { quantity, name }]) => {
            const owned = collection[key]?.count || 0;
            if (owned < quantity) {
                const suggested = [];

                // Add suggested cards if available in other sets
                Object.entries(collection).forEach(([k, card]) => {
                    if (card.name === name && owned === 0) {
                        suggested.push({ key: k, set: k.split('-')[0], number: k.split('-')[1], name: card.name });
                    }
                });

                missingCards.push({
                    key,
                    name,
                    needed: quantity,
                    owned,
                    missing: quantity - owned,
                    suggested: suggested.length ? suggested : 'No suggestions available'
                });
            }
        });

        console.log('Missing Cards:', missingCards);

        // Print results with more readable suggested cards
        missingCards.forEach(card => {
            console.log(`Missing Card: ${card.name} (${card.key})`);
            console.log(`Needed: ${card.needed}, Owned: ${card.owned}, Missing: ${card.missing}`);
            if (Array.isArray(card.suggested)) {
                console.log('Suggested Cards:');
                card.suggested.forEach(suggestion => {
                    console.log(`  - ${suggestion.name} (Set: ${suggestion.set}, Number: ${suggestion.number})`);
                });
            } else {
                console.log(card.suggested); // If no suggestions
            }
            console.log('---');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { compareCollections };
