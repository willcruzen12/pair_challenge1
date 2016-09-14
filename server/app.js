var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var port = process.env.PORT || 8080;
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/koalaHolla'
    // static folder
app.use(express.static('public'));

// spin up server
app.listen(port, function() {
    console.log('server up on', port);
});

// base url
app.get('/', function(req, res) {
    console.log('base url hit');
    res.sendFile('index.html');
});

// get koalas
app.get('/getKoalas', function(req, res) {
    console.log('getKoalas route hit');
    pg.connect(connectionString, function(err, client, done) {
        //if err
        if (err) {
            console.log(err);
        } // if error connecting
        else {
            console.log('connected to db');
            // array to hold our results
            var resultArray = [];
            // query call to db table
            var queryResults = client.query('SELECT * FROM koalas');
            queryResults.on('row', function(row) {
                // runs for each row in the query result
                resultArray.push(row);
            }); // end on row
            queryResults.on('end', function() {
                // we're done
                done();
                // return result as a json version of array
                return res.json(resultArray);
            });
        } // end no error
    }); //end pg connect
});// end getKoalas

// add koala
app.post('/addKoala', urlencodedParser, function(req, res) {
    console.log('addKoala route hit');
      // array to hold our results
      var resultArray = [];
      var data = {name: req.body.name,
                  age: req.body.age,
                  sex: req.body.sex,
                  readyForTransfer: req.body.readyForTransfer,
                  notes: req.body.notes
                };
      pg.connect(connectionString, function(err, client, done) {
          //if err
          if (err) {
              console.log(err);
          } // if error connecting
          else {
              console.log('connected to db');
              // query call to db table
              client.query('INSERT INTO koalas (name, age, sex, ready_for_transfer, notes) VALUES ($1, $2, $3, $4, $5)', [data.name, data.age, data.sex, data.readyForTransfer, data.notes]);
              var query = client.query("SELECT * FROM koalas ORDER BY id DESC");
              console.log(query);
          // Stream results back one row at a time
          query.on('row', function(row) {
              resultArray.push(row);
          });
          // After all data is returned, close connection and return results
          query.on('end', function() {
              done();
              return res.json(resultArray);
          });
        }
      }); //end pg connect
    // //assemble object to send
    // var objectToSend = {
    //     response: 'from addKoala route'
    // }; //end objectToSend
    // //send info back to client
    // res.send(objectToSend);
});// end addKoala

// edit koala
app.post('/editKoala', urlencodedParser, function(req, res) {
    console.log('editKoala route hit');
    //assemble object to send
    var objectToSend = {
        response: 'from editKoala route'
    }; //end objectToSend
    //send infoback to client
    res.send(objectToSend);
});
