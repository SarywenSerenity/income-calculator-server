'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var form = require('./form.js');

var app = express();

var port = 1152;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/start', function (request, response) {
    response.send('Working');
});

// app.get('/calculator', function (request, response) {
//     response.send('calculator');
// });

// app.get('/calculator/:paystub', function (request, response) {
//     // let paystub = request.params.paystub;
//     // response.send(paystub);
// });

app.post('/calculator/refundOrPayment', function(request, response){
    form.calculateForm(request, function(err, data){
        if(err){
            response.status(404).send(err);
        } else {
            response.send(data);
        }
    })
})

console.log('Listening on: ', port);
app.listen(port);

