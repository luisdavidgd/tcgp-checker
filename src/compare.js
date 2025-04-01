const { readCollectionCSV } = require('./collection');
const { readDeck } = require('./deck');

// Compare collections and deck
async function compareCollections(collectionFile, deckFile) {
    try {
        const collection = await readCollectionCSV(collectionFile);
        const deck = await readDeck(deckFile);

        const missingCards = [];

        // Iterate through deck and find missing cards
        Object.entries(deck).forEach(([key, { quantity, name }]) => {
            const owned = collection[key]?.count || 0;
            if (owned < quantity) {
                const suggested = [];

                // Add suggested cards if available in other sets
                Object.entries(collection).forEach(([k, card]) => {
                    if (card.name === name && card.count > 0 && k != key) {
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
