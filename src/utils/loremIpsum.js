import WORDS from '../constants/words';
import capitalize from './capitalize';

export const generateRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const pluckRandomWord = () => {
    const min = 0;
    const max = WORDS.length - 1;
    const index = generateRandomInteger(min, max);
    return WORDS[index];
};

export const generateRandomWords = (num, wordsPerSentence = { min: 6, max: 16 }) => {
    const { min, max } = wordsPerSentence;
    const length = num > 0 ? num : generateRandomInteger(min, max);
    return Array.from(Array(length))
        .map(_ => pluckRandomWord())
        .join(' ');
};

export const generateRandomSentence = (shouldCapitalize, num) => {
    return `${shouldCapitalize ? capitalize(generateRandomWords(num)) : generateRandomWords(num)}.`;
};

export const generateRandomSentences = (num, startWithLorem, wordsPerSentence = { min: 6, max: 16 }) => {
    const { min, max } = wordsPerSentence;
    const length = num > 0 ? num : generateRandomInteger(min, max);
    return Array.from(Array(length))
        .map((_, i) => `${i === 0 && startWithLorem ? 'Lorem ipsum ' : ''}${generateRandomSentence(!(i === 0 && startWithLorem))}`)
        .join(' ')
        .trim();
};

export const generateRandomParagraphs = (num, startWithLorem, sentencesPerParagraph = { min: 4, max: 8 }) => {
    const { min, max } = sentencesPerParagraph;
    const length = num > 0 ? num : generateRandomInteger(min, max);
    return Array.from(Array(length)).map((_, i) => generateRandomSentences(generateRandomInteger(min, max), i === 0 && startWithLorem));
};
