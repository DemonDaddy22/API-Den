const { generateLoremIpsum } = require('../services/loremIpsum.js');

const getLoremIpsum = (req, res, next) => {
    const { q, count } = req.query;
    try {
        const data = generateLoremIpsum(q, typeof count === 'number' ? count : parseInt(count));
        res.status(200).send({ data });
    } catch (err) {
        res.status(400).send({ err });
    }
};

module.exports = { getLoremIpsum };
