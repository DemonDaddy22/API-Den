if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const axios = require('axios');
const { GITHUB_AUTH_URL, GITHUB_USER_URL } = require('../constants/constants');
const GitHubError = require('../errors/GithubError');

const getGitHubUser = async (code) => {
    try {
        const githubTokenResponse = await axios.post(`${GITHUB_AUTH_URL}?client_id=${process.env.FOGIT_CLIENT_ID}&client_secret=${process.env.FOGIT_CLIENT_SECRET}&code=${code}`);
        const githubToken = githubTokenResponse.data;
        const params = new URLSearchParams(githubToken);
        const accessToken = params.get('access_token');

        // TODO - set access token in request
        if (!accessToken) {
            const err = new GitHubError('No access token found');
            throw err;
        }

        const userResponse = await axios.get(GITHUB_USER_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userData = userResponse.data;
        return userData;
    } catch (err) {
        return err;
    }
};

module.exports = { getGitHubUser };
