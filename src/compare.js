const path = require('path');
const { readCollectionCSV } = require('./collection');
const { readDeck } = require('./deck');

// ANSI color codes for terminal output
const colors = {
    reset: "\x1b[0m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m"
};

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
        const deckList = [];
        let totalNeeded = 0;
        let totalOwned = 0;

        console.log(`Deck: ${deckName}`);

        // Find missing cards and prepare the deck list
        Object.entries(deck).forEach(([key, { quantity, name }]) => {
            const owned = collection[key]?.count || 0;

            // Ensure quantity and owned are valid numbers
            const needed = parseInt(quantity, 10);
            const ownedCount = parseInt(owned, 10);

            if (isNaN(needed) || isNaN(ownedCount)) return;

            totalNeeded += needed;
            totalOwned += Math.min(ownedCount, needed);

            // Determine line color based on availability
            let color = colors.reset;
            if (ownedCount === 0) {
                color = colors.red; // Completely missing cards
            } else if (ownedCount < needed) {
                color = colors.yellow; // Partially owned cards
            }

            deckList.push(`${color}${quantity} ${name} ${key.split('-')[0]} ${key.split('-')[1]} (You own: ${ownedCount})${colors.reset}`);

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
            console.log(colors.green + 'Deck complete! You have all the cards! 🎉' + colors.reset);
        } else {
            console.log(colors.yellow + 'You still need more cards to complete the deck.' + colors.reset);

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

        // Display deck list at the end with color-coded ownership
        console.log('\n---------------------- Lista de Cartas ----------------------');
        deckList.forEach(cardLine => console.log(cardLine));
        console.log('------------------------------------------------------------');

    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { compareCollections };
