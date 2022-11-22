// TODO - add TS
// TODO - use modules
// TODO - add ESLint and Prettier
// TODO - update APIs

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { getLoremIpsum } from './controllers/LoremController';
import { getFogitGitHubAuthCode, getUserData, getUserProfile, verifyAuthenticatedUser } from './controllers/GitHubController';
import asyncErrorHandler from './utils/asyncErrorHandler';

// TODO - set cookie in express session

const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`> Serving on port ${PORT}`));

app.get('/api/v1/lorem/', asyncErrorHandler(getLoremIpsum));

app.get('/api/v1/fogit/authenticate', asyncErrorHandler(verifyAuthenticatedUser));

app.get('/api/v1/fogit/user/profile', asyncErrorHandler(getUserProfile));

app.get('/api/v1/fogit/user/data', asyncErrorHandler(getUserData));

app.get('/api/v1/fogit/auth/github', asyncErrorHandler(getFogitGitHubAuthCode));

app.get('/', (_, res) => res.send(`You're in the wrong place xD`));

app.get('*', (_, res) => res.redirect('/'));

// Error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = 'Internal Server Error', name = 'ServerError' } = err;
    res.status(status).send({
        status: false,
        data: null,
        error: {
            name,
            message,
        },
    });
});