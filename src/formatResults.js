const colors = {
    reset: "\x1b[0m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m"
};

function formatResults({ deckName, totalNeeded, totalOwned, missingCards, deckList }) {
    console.log(`Deck: ${deckName}\n`);

    // Display deck list with color coding
    console.log('\n---------------------- Cards List ----------------------');
    deckList.forEach(card => {
        let color = colors.reset;
        if (card.owned === 0) {
            color = colors.red; // Completely missing cards
        } else if (card.owned < card.needed) {
            color = colors.yellow; // Partially owned cards
        } else if (card.owned >= card.needed) {
            color = colors.green;
        }
        console.log(`${color}${card.needed} ${card.name} ${card.key.split('-')[0]} ${card.key.split('-')[1]} (You own: ${card.owned})${colors.reset}`);
    });
    console.log('------------------------------------------------------------');

    console.log(`You got ${totalOwned}/${totalNeeded} cards for this deck.`);
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


}

module.exports = { formatResults };
