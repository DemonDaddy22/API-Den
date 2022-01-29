if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const GitHubError = require('../errors/GitHubError');
const { getGitHubUser } = require('../helpers/GitHub');

const getFogitGitHubAuthCode = async (req, res, next) => {
    try {
        const { code } = req.query || {};

        if (!code) {
            const err = new GitHubError('No auth code provided');
            throw err;
        }

        const user = await getGitHubUser(code);
        if (!user) {
            const err = new GitHubError('No user info found');
            throw err;
        }

        return res.redirect(
            `${process.env.REDIRECT_PATH}?username=${user.login}`
            || '/'
        );
    } catch (error) {
        return res.status(400).send({ err: { isError: true, name: error.name, message: error.message } });
    }
};

module.exports = { getFogitGitHubAuthCode };
