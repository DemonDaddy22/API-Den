// TODO - add TS
// TODO - use modules
// TODO - add ESLint and Prettier
// TODO - update APIs

if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { getLoremIpsum } = require('./controllers/LoremController');
const { getFogitGitHubAuthCode, getUserData, getUserProfile } = require('./controllers/GitHubController');
const { isUserAuthenticated } = require('./middleware/GitHubMiddleware');
const asyncErrorHandler = require('./utils/asyncErrorHandler');

const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`> Serving on port ${PORT}`));

app.get('/api/v1/lorem/', asyncErrorHandler(getLoremIpsum));

app.get('/api/v1/fogit/user/profile', asyncErrorHandler(getUserProfile));

app.get('/api/v1/fogit/user/data', isUserAuthenticated, asyncErrorHandler(getUserData));

app.get('/api/v1/fogit/auth/github', asyncErrorHandler(getFogitGitHubAuthCode));

app.get('/', (req, res) => res.send(`You're in the wrong place xD`));

app.get('*', (req, res) => res.redirect('/'));

// Error middleware
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