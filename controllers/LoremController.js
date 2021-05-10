const { generateLoremIpsum } = require('../services/loremIpsum.js');

const getLoremIpsum = (req, res, next) => {
    const { q, count, startWithLorem = false } = req.query;
    if (isNaN(count) || count <= 0)
        return res.status(400).send({ err: new Error('Count must be an integer greater than 0') });
    try {
        const data = generateLoremIpsum(q, typeof count === 'number' ? count : parseInt(count), startWithLorem);
        res.status(200).send({ data });
    } catch (err) {
        res.status(500).send({ err });
    }
};

module.exports = { getLoremIpsum };
