const { generateRandomWords, generateRandomSentences, generateRandomParagraphs } = require('../utils/loremIpsum');

const generateLoremIpsum = (units, count, startWithLorem) => {
    switch (units) {
        case 'words':
            return [generateRandomWords(count)];
        case 'sentences':
        default:
            return [generateRandomSentences(count, startWithLorem)];
        case 'paragraphs':
            return generateRandomParagraphs(count, startWithLorem);
    }
};

module.exports = { generateLoremIpsum };
