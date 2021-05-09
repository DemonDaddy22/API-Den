const { generateRandomWords, generateRandomSentences, generateRandomParagraphs } = require('../utils/loremIpsum');

const generateLoremIpsum = (units, count) => {
    switch (units) {
        case 'words':
            return [generateRandomWords(count)];
        case 'sentences':
        default:
            return [generateRandomSentences(count)];
        case 'paragraphs':
            return generateRandomParagraphs(count);
    }
};

module.exports = { generateLoremIpsum };
