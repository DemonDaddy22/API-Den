if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const jwt = require('jsonwebtoken');
const { FOGIT_USER_COOKIE, FOGIT_TOKEN_COOKIE, COOKIE_MAX_AGE } = require('../constants/constants');
const GitHubError = require('../errors/GitHubError');
const { getGitHubUser } = require('../helpers/GitHub');

const getUserProfile = (req, res, next) => {
    const cookie = req.cookies?.[FOGIT_USER_COOKIE];

    try {
        const userData = jwt.verify(cookie, process.env.SECRET);

        if (!userData) {
            const error = new GitHubError('No user info found');
            throw error;
        }

        // TODO - set user data in app context
        res.status(200).send({
            status: true,
            error: null,
            data: {
                username: userData.login,
                avatar: userData.avatar_url,
                url: userData.url,
            }
        });
    } catch (err) {
        next(err);
    }
};

const getUserData = async (req, res, next) => {
    const cookie = req.cookies?.[FOGIT_USER_COOKIE];
    const token = req.cookies?.[FOGIT_TOKEN_COOKIE];

    try {
        const userData = jwt.verify(cookie, process.env.SECRET);
        const tokenData = jwt.verify(token, process.env.SECRET);

        if (!userData || !tokenData) {
            const error = new GitHubError('No user info found');
            throw error;
        }

        const { followers = 0, following = 0 } = userData;
        // TODO - create util to get list of followers and following
        /*
        const supporters = differenceBy(followers.data, following.data, 'id');
        const leaders = differenceBy(following.data, followers.data, 'id');
        const mutual = intersectionBy(followers.data, following.data, 'id');
        */
        next();
    } catch (err) {
        next(err);
    }
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
        next(error);
    }
};

module.exports = {
    getUserProfile,
    getUserData,
    getFogitGitHubAuthCode,
};
