if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getLoremIpsum } = require('./controllers/LoremController.js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`> Serving on port ${PORT}`));

app.get('/api/v1/lorem/', getLoremIpsum);
