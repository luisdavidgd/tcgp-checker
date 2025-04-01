# Pokemon Deck Checker

This project helps you compare your Pokémon TCG card collection against a set of deck. It reads data from CSV files containing your collection and TXT files for the deck cards.

## How It Works

1. **Reads your collection from a CSV file** (`collection.csv`).

   - This file must contain columns: `Normal`, `Foil`, `Name`, `Set`, and `Number`.
   - Only `Set`, `Number`, and `Normal` (card quantity) are used.
   - Use this links as a reference: https://ptcgpocket.gg/collection/

2. **Reads a list of recommended cards** from a text file (`deck.txt`).

   - Cards must be formatted as: `Quantity Name Set Number`.
   - Only `Quantity`, `Set`, and `Number` are used.

3. **Compares both lists** to determine which cards are missing.

   - If you have fewer cards than needed in the desired deck, they will be listed as "missing".

## Installation and Usage

### 1. Clone the repository

```sh
 git clone <repository>
 cd pokemon-deck-checker
```

### 2. Install dependencies

```sh
npm install
```

### 3. Expected File Structure

```
tcgp-checker/
│── data/
│   │── collection.csv      # Your card collection
│── decks/
│   │── deck1.txt           # Recommended deck list
│── src/
│   │── collection.js
│   │── compare.js
│   │── index.js            # Main script
│   │── deck.js
│── package.json            # npm configuration
│── package-lock.json       # Version lock file
│── .gitignore              # Files to ignore
```

### 4. ## How to Run

1. Place your **collection CSV files** in the `data/` folder and your **decks `.txt` files** in the `decks/` folder.
2. Run the main script:
```sh
node src/index.js
```
3. The script will prompt you to select the CSV file for your collection and a .txt deck file. It will then compare your collection with the selected deck and display the missing cards.

## File Format

### Collection CSV

The collection file should be in CSV format with the following columns:

- **Normal**: The number of normal cards you own (integer).
- **Foil**: This column is ignored for the comparison.
- **Name**: The name of the Pokémon (also ignored in the comparison).
- **Set**: The set the card belongs to (e.g., A1, A2b, etc.).
- **Number**: The card number in the set (e.g., 1, 2, 3, etc.).

#### Example of a collection CSV:
| Normal | Foil | Name       | Set | Number |
|--------|------|------------|-----|--------|
| 3      | 0    | Bulbasaur  | A1  | 1      |
| 1      | 0    | Ivysaur    | A1  | 2      |
| 4      | 0    | Venusaur   | A1  | 3      |
| 1      | 0    | Caterpie   | A1  | 5      |
| 2      | 0    | Metapod    | A1  | 6      |
| ...    | ...  | ...        | ... | ...    |

#### Deck Text File
The deck file is a .txt file containing the following format:

- The first value is the quantity of cards needed for the deck.
- The second value is the name of the Pokémon (ignored in the comparison).
- The third value is the set the card belongs to.
- The fourth value is the card number in the set.

#### Example:
```
Pokemon
2 Weedle A2b 1
2 Kakuna A2b 2
1 Beedrill ex A2b 3
1 Pinsir A2b 4
2 Sprigatito A2b 5
2 Floragato A2b 6
1 Meowscarada A2b 7
2 Buneary A2b 66
1 Lopunny A2b 67

Supporter
1 Red A2b 71
2 Professor’s Research PROMO 7

Item
1 X Speed PROMO 2
2 Poké Ball PROMO 5
```

## Expected Output

The program will print a list of missing cards, for example:

```
Missing Cards: [
  { key: 'A2b-1', name: 'Weedle', needed: 2, owned: 0, missing: 2 },
  { key: 'A2b-2', name: 'Kakuna', needed: 2, owned: 1, missing: 1 }
]
```

This means you need to obtain 2 Weedle from set A2b and 1 Kakuna from the same set.

## Future Improvements

- Export the missing cards list to a file.
- Support for additional input formats.

Hope this helps you optimize your collection! 😊

