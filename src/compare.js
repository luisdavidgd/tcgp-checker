const path = require('path');
const { readCollectionCSV } = require('./collection');
const { readDeck } = require('./deck');

async function compareCollections(collectionFile, deckFile) {
    try {
        const collection = await readCollectionCSV(collectionFile);
        const deck = await readDeck(deckFile);
        const deckName = path.basename(deckFile, '.txt'); // Extract deck name

        const missingCards = [];
        const deckList = [];
        let totalNeeded = 0;
        let totalOwned = 0;

        // Iterate through deck and find missing cards
        Object.entries(deck).forEach(([key, { quantity, name }]) => {
            const owned = collection[key]?.count || 0;
            const needed = parseInt(quantity, 10);
            const ownedCount = parseInt(owned, 10);

            if (isNaN(needed) || isNaN(ownedCount)) return;

            totalNeeded += needed;
            totalOwned += Math.min(ownedCount, needed);

            // Store deck list info
            deckList.push({ key, name, needed, owned: ownedCount });

            // Track missing cards
            if (ownedCount < needed) {
                const suggested = [];
                Object.entries(collection).forEach(([k, card]) => {
                    if (card.name === name && card.count > 0 && k !== key) {
                        suggested.push({ name: card.name, set: k.split('-')[0], number: k.split('-')[1], quantity: card.count });
                    }
                });

                missingCards.push({ key, name, needed, owned: ownedCount, missing: needed - ownedCount, suggested });
            }
        });

        return { deckName, totalNeeded, totalOwned, missingCards, deckList };

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

module.exports = { compareCollections };
