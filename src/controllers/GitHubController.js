import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import pkg from 'lodash';
import { FOGIT_USER_COOKIE, FOGIT_TOKEN_COOKIE, COOKIE_MAX_AGE } from '../constants/constants';
import GitHubError from '../errors/GitHubError';
import { getGitHubUser, getUserFollowers, getUserFollowing } from '../helpers/GitHub';

const { differenceBy, intersectionBy } = pkg;

export const verifyAuthenticatedUser = async (req, res, next) => {
    try {
        const cookie = req.cookies?.[FOGIT_USER_COOKIE];
        const userData = jwt.verify(cookie, process.env.SECRET);

        res.status(200).send({
            status: true,
            error: null,
            data: !!userData?.login,
        });
    } catch (err) {
        next(err);
    }
}

export const getUserProfile = (req, res, next) => {
    try {
        const cookie = req.cookies?.[FOGIT_USER_COOKIE];
        const userData = jwt.verify(cookie, process.env.SECRET);

        if (!userData) {
            const error = new GitHubError('No user info found');
            throw error;
        }

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

export const getUserData = async (req, res, next) => {
    try {
        const cookie = req.cookies?.[FOGIT_USER_COOKIE];
        const token = req.cookies?.[FOGIT_TOKEN_COOKIE];

        const userData = jwt.verify(cookie, process.env.SECRET);
        const tokenData = jwt.verify(token, process.env.SECRET);

        if (!userData || !tokenData) {
            const error = new GitHubError('No user info found');
            throw error;
        }

        const {
            followers = 0,
            following = 0,
            login,
        } = userData;

        const followersList = await getUserFollowers(login, followers, tokenData);
        const followingList = await getUserFollowing(login, following, tokenData);

        const supporters = differenceBy(followersList, followingList, 'id');
        const leaders = differenceBy(followingList, followersList, 'id');
        const mutual = intersectionBy(followersList, followingList, 'id');

        res.status(200).send({
            status: true,
            error: null,
            data: {
                supporters,
                leaders,
                mutual,
            }
        });
    } catch (err) {
        next(err);
    }
};

// TODO - Create an API to follow a supporter
    // - check if user is authenticated
    // - if status code is 204, return true, else return false

// TODO - Create an API to unfollow a leader or a mutual friend
    // - check if user is authenticated
    // - if status code is 204, return true, else return false

export const getFogitGitHubAuthCode = async (req, res, next) => {
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
