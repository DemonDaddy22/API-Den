const WORDS = require('../constants/words');
const capitalize = require('./capitalize');

const generateRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const pluckRandomWord = () => {
    const min = 0;
    const max = WORDS.length - 1;
    const index = generateRandomInteger(min, max);
    return WORDS[index];
};

const generateRandomWords = (num, wordsPerSentence = { min: 6, max: 16 }) => {
    const { min, max } = wordsPerSentence;
    const length = num > 0 ? num : generateRandomInteger(min, max);
    return Array.from(Array(length)).map(_ => pluckRandomWord()).join(' ');
};

const generateRandomSentence = num => {
    return `${capitalize(generateRandomWords(num))}.`;
};

const generateRandomSentences = (num, wordsPerSentence = { min: 6, max: 16 }) => {
    const { min, max } = wordsPerSentence;
    const length = num > 0 ? num : generateRandomInteger(min, max);
    return Array.from(Array(length)).map(_ => generateRandomSentence()).join(' ').trim();
};

const generateRandomParagraphs = (num, sentencesPerParagraph = { min: 4, max: 8 }) => {
    const { min, max } = sentencesPerParagraph;
    const length = num > 0 ? num : generateRandomInteger(min, max);
    return Array.from(Array(length)).map(_ => generateRandomSentences());
};

module.exports = {
    generateRandomInteger,
    generateRandomParagraphs,
    generateRandomSentence,
    generateRandomSentences,
    generateRandomWords,
};
