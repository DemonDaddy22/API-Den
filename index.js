// TODO - add TS
// TODO - use modules
// TODO - add ESLint and Prettier
// TODO - update APIs

if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getLoremIpsum } = require('./controllers/LoremController');
const { getFogitGitHubAuthCode } = require('./controllers/GitHubController');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`> Serving on port ${PORT}`));

app.get('/api/v1/lorem/', getLoremIpsum);

app.get('/api/v1/fogit/auth/github', getFogitGitHubAuthCode);

app.get('/', (req, res) => res.send(`You're in the wrong place xD`));

app.get('*', (req, res) => res.redirect('/'));
