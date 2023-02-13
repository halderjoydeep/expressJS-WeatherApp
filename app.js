const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  let cityName = req.body.cityName;
  const units = 'metric';
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  https
    .get(url, (response) => {
      // console.log(response.statusCode);
      response.on('data', (data) => {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageUrl = `http://openweathermap.org/img/w/${icon}.png`;
        res.write(`<h1>Temp in ${cityName} is ${temp} degree Celcius</h1>`);
        res.write(`<p>The weather is currently ${description}</p>`);
        res.write(`<img src=${imageUrl}>`);
        res.send();
      });
    })
    .on('error', (e) => {
      console.error(e);
    });
});

app.listen(3000, () => {
  console.log('Server started at port 3000');
});
