const express = require('express'); 
const cors = require('cors');
const app = express(); 
const port = 3031;
const bodyParser = require('body-parser');
const yt = require('./queries.js');


app.use(cors());
app.use(bodyParser.json());

app.get('/', (request, response) => { response.json({ info: 'Here is a list of my current Favorate Youtubers.(Do /youtubers to see)'}) })

app.get('/youtubers', yt.getYoutubers);
app.post('/youtubers', yt.addYoutubers);
app.delete("/youtubers/:id", yt.deleteYoutuber);
app.get('/youtubers', yt.getYoutuber);
app.put('/youtubers', yt.updateYoutubers);


app.listen(port, () => { console.log(`App running on port ${port}.`) })