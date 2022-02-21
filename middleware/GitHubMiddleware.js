if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const jwt = require('jsonwebtoken');
const { FOGIT_USER_COOKIE, FOGIT_TOKEN_COOKIE } = require("../constants/constants");
const GitHubError = require('../errors/GitHubError');

const isUserAuthenticated = (req, res, next) => {
    try {
        const cookie = req.cookies?.[FOGIT_USER_COOKIE];
        const token = req.cookies?.[FOGIT_TOKEN_COOKIE];

        const userData = jwt.verify(cookie, process.env.SECRET);
        const tokenData = jwt.verify(token, process.env.SECRET);

        if (!userData || !tokenData) {
            const err = new GitHubError('Unauthenticated access');
            throw err;
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    isUserAuthenticated,
}