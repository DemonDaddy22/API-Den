if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const jwt = require('jsonwebtoken');
const { FOGIT_USER_COOKIE, FOGIT_TOKEN_COOKIE, COOKIE_MAX_AGE } = require('../constants/constants');
const GitHubError = require('../errors/GitHubError');
const { getGitHubUser } = require('../helpers/GitHub');

const getUserData = async (req, res, next) => {
    res.send('hello');
};

const getFogitGitHubAuthCode = async (req, res, next) => {
    try {
        const { code } = req.query || {};

        if (!code) {
            const err = new GitHubError('No auth code provided');
            throw err;
        }

        const userResponse = await getGitHubUser(code);
        const { user, accessToken } = userResponse || {};
        
        if (!user) {
            const err = new GitHubError('No user info found');
            throw err;
        }

        const userToken = jwt.sign(user, process.env.SECRET);
        const fogitToken = jwt.sign(accessToken, process.env.SECRET);

        res.cookie(FOGIT_USER_COOKIE, userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_MAX_AGE,
        });
        
        res.cookie(FOGIT_TOKEN_COOKIE, fogitToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_MAX_AGE,
        });

        return res.redirect(
            `${process.env.REDIRECT_PATH}?username=${user.login}`
            || '/'
        );
    } catch (error) {
        return res.status(400).send({ err: { isError: true, name: error.name, message: error.message } });
    }
};

module.exports = {
    getUserData,
    getFogitGitHubAuthCode,
};
