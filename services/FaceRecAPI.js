

// Use dotenv to read .env vars into Node
require("dotenv").config();

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server



const request = require('request'); 
var AWS = require('aws-sdk');

var fs = require("fs");


// fs.readFile('./Aviary Photo_131583238625977289.png', (err, data)=>{

//   //error handle
//         if(err) res.status(500).send(err);

// //combine all strings
//         let base64Image = new Buffer(data, 'binary').toString('base64');

//         //console.log(data);

//         global.firstImage = data;
// });

// fs.readFile('./Aviary Photo_131583238625977289.png', (err, data)=>{

//   //error handle
//         if(err) res.status(500).send(err);

// //combine all strings
//         let base64Image = new Buffer(data, 'binary').toString('base64');

//         //console.log(data);

//         global.secondImage = data;

//         faceRecAPI(global.firstImage, global.secondImage);
// });


function faceRecAPI(firstImage, secondImage) {
  const AWSParameters = {
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey,
    "region": process.env.region
}

var rekognition = new AWS.Rekognition(AWSParameters);

console.log(firstImage);
console.log(secondImage);

var params = {
    SimilarityThreshold: 90,
    SourceImage: {
        Bytes : firstImage
    },
    TargetImage : {
      Bytes: secondImage
    },
    QualityFilter : 'NONE'

}

rekognition.compareFaces(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful 
});
}



module.exports.faceRecAPI = faceRecAPI;








