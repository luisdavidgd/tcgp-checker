const path = require('path');
const { readCollectionCSV } = require('./collection');
const { readDeck } = require('./deck');

// Function to check if a line has a valid format
function isValidCardLine(line) {
    return /^\d+\s/.test(line); // Must start with a number followed by a space
}

// Compare collections and deck
async function compareCollections(collectionFile, deckFile) {
    try {
        const collection = await readCollectionCSV(collectionFile);
        const deck = await readDeck(deckFile);

        const deckName = path.basename(deckFile, '.txt'); // Extract deck name
        const missingCards = [];
        let totalNeeded = 0;
        let totalOwned = 0;

        console.log(`Deck: ${deckName}`);
        console.log('---------------------- Card List ----------------------');

        // Iterate through the deck and print only valid card lines
        Object.entries(deck).forEach(([key, { quantity, name }]) => {
            if (isValidCardLine(`${quantity} ${name} ${key}`)) {
                console.log(`${quantity} ${name} ${key.split('-')[0]} ${key.split('-')[1]}`);
            }
        });

        console.log('------------------------------------------------------------');

        // Find missing cards
        Object.entries(deck).forEach(([key, { quantity, name }]) => {
            const owned = collection[key]?.count || 0;

            // Ensure quantity and owned are valid numbers
            const needed = parseInt(quantity, 10);
            const ownedCount = parseInt(owned, 10);

            if (isNaN(needed) || isNaN(ownedCount)) return;

            totalNeeded += needed;
            totalOwned += Math.min(ownedCount, needed);

            if (ownedCount < needed) {
                const suggested = [];

                // Find alternative sets for the missing card
                Object.entries(collection).forEach(([k, card]) => {
                    if (card.name === name && card.count > 0 && k !== key) {
                        suggested.push({ 
                            name: card.name, 
                            set: k.split('-')[0], 
                            number: k.split('-')[1], 
                            quantity: card.count 
                        });
                    }
                });

                missingCards.push({
                    key,
                    name,
                    needed,
                    owned: ownedCount,
                    missing: needed - ownedCount,
                    suggested
                });
            }
        });

        console.log(`\nYou got ${totalOwned}/${totalNeeded} cards for this deck.`);
        if (totalNeeded === totalOwned) {
            console.log('\x1b[32mDeck complete! You have all the cards! 🎉\x1b[0m');
        } else {
            console.log('\x1b[33mYou still need more cards to complete the deck.\x1b[0m');

            // Display missing cards
            console.log('\n---------------------- Missing Cards ----------------------');
            missingCards.forEach(card => {
                console.log(`${card.missing} ${card.name} ${card.key.split('-')[0]} ${card.key.split('-')[1]}`);
            });
            console.log('------------------------------------------------------------');

            // Display suggestions
            console.log('Suggestions:');
            let hasSuggestions = false;
            missingCards.forEach(card => {
                if (card.suggested.length > 0) {
                    card.suggested.forEach(suggestion => {
                        console.log(`  - ${suggestion.name} ${suggestion.set} ${suggestion.number} (${suggestion.quantity})`);
                        hasSuggestions = true;
                    });
                }
            });

            if (!hasSuggestions) {
                console.log('  No alternative cards found.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { compareCollections };
