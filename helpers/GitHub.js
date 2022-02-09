if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const axios = require('axios');
const { GITHUB_AUTH_URL, GITHUB_USER_URL, GITHUB_USERS_URL, GITHUB_PAGE_SIZE } = require('../constants/constants');
const GitHubError = require('../errors/GithubError');
const createListOfSize = require('../utils/createListOfSize');

const getGitHubUser = async (code) => {
    try {
        const githubTokenResponse = await axios.post(`${GITHUB_AUTH_URL}?client_id=${process.env.FOGIT_CLIENT_ID}&client_secret=${process.env.FOGIT_CLIENT_SECRET}&code=${code}`);
        const githubToken = githubTokenResponse.data;
        const params = new URLSearchParams(githubToken);
        const accessToken = params.get('access_token');

        if (!accessToken) {
            const err = new GitHubError('No access token found');
            throw err;
        }

        const userResponse = await axios.get(GITHUB_USER_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = userResponse.data;
        return {
            user,
            accessToken,
        };
    } catch (err) {
        return err;
    }
};

const getUserFollowers = async (username, followersCount, accessToken) => {
    const pages = Math.ceil(followersCount / GITHUB_PAGE_SIZE);
    const pageList = createListOfSize(pages);
    try {
        const pagesData = await Promise.all(
            pageList.map((page) =>
                axios.get(`${GITHUB_USERS_URL}/${username}/followers`, {
                    params: { page, per_page: GITHUB_PAGE_SIZE },
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            )
        );
        
        return pagesData?.[0]?.data || [];
    } catch (error) {
        return error;
    }
};

const getUserFollowing = async (username, followingCount, accessToken) => {
    const pages = Math.ceil(followingCount / GITHUB_PAGE_SIZE);
    const pageList = createListOfSize(pages);
    try {
        const pagesData = await Promise.all(
            pageList.map((page) =>
                axios.get(`${GITHUB_USERS_URL}/${username}/following`, {
                    params: { page, per_page: GITHUB_PAGE_SIZE },
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            )
        );
        
        return pagesData?.[0]?.data || [];
    } catch (error) {
        return error;
    }
};

module.exports = {
    getGitHubUser,
    getUserFollowers,
    getUserFollowing,
};
