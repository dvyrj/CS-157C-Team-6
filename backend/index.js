const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');
app.use(userRoutes);


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));