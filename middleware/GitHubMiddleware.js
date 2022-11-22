import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import { FOGIT_USER_COOKIE, FOGIT_TOKEN_COOKIE } from '../constants/constants';
import GitHubError from '../errors/GitHubError';

export const isUserAuthenticated = (req, res, next) => {
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
