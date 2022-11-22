import {
    generateRandomWords, generateRandomSentences, generateRandomParagraphs,
} from '../utils/loremIpsum';

export const generateLoremIpsum = (units, count, startWithLorem) => {
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
