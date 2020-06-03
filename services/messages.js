const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  fs = require("fs");

var https = require('https');

const request = require('request'); 
const FaceRecAPI = require('./FaceRecAPI');

 global.firstImage = null;
 global.secondImage = null;
 global.count = 1;

module.exports = class messages{
// Handles messages events
static handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text === 'RealIdInfo') {    

   // Create the payload for a basic text message
		response = { "text" : "Here is the link that will be useful : https://www.youtube.com/watch?v=trAxYk7Xduo",
                    "quick_replies":[
								      {
								        "content_type":"text",
								        "title":"Apply",
								        "payload":"<POSTBACK_PAYLOAD>"
								      }
    								]
 				       }      
  }
  else if (received_message.text === "Apply")
  {
  	response = { "text" : "Awesome Lets get started!! Here is Step 1, Fill the online application at : https://www.dmv.ca.gov/portal/dmv/detail/forms/dl/dl44?_gl=1*vloqmz*_gcl_aw*R0NMLjE1ODQxNDA2NjEuQ2owS0NRanczcXp6QlJEbkFSSXNBRUNtcnlyUFMteGozMTRId3NJWjRTMGJtOWF6MUhqTTdNNWJ2bnZoS0RmY2pQUWtSdGZVLVZPcFkya2FBc2dxRUFMd193Y0I.&_ga=2.114083790.852798284.1584140651-192178571.1583455513&_gac=1.255727098.1584140661.Cj0KCQjw3qzzBRDnARIsAECmryrPS-xj314HwsIZ4S0bm9az1HjM7M5bvnvhKDfcjPQkRtfU-VOpY2kaAsgqEALw_wcB ",
  				"quick_replies":[
								      {
								        "content_type":"text",
								        "title":"Step 1 Done",
								        "payload":"<POSTBACK_PAYLOAD>"
								      }
    							]
  				}
  }
  else if(received_message.text === "Step 1 Done")
  {
         response = {"text": "Please upload photo Id and Your Selfie" }
  }

  else if (received_message.attachments) {
  
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    

    
    
   request.get(attachment_url , function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log('content-type:', response.headers['content-type']);
       // var data = new Buffer.from(body).toString('base64');

       // var length = body.length;
       // var imageBytes = new ArrayBuffer(length);
       // var data = new Uint8Array(imageBytes);
       // for(var i = 0; i < length; i++){
       //  data[i]=body.charCodeAt(i);
       // }

       // var data = imageBytes;      
        if(global.count === 1)
        {
          
          global.firstImage = new Buffer(body,'base64');
          global.count = 2;
        }
        else if(global.count === 2)
        {
          
          global.secondImage = new Buffer(body, 'base64');
          global.count = 1;
          FaceRecAPI.faceRecAPI(global.firstImage, global.secondImage);
        }
       }       
    
  });
  
   if(global.count === 1)
        {
          response = {"text" : "Upload Photo ID"}
        }
    else if(global.count ===2 )
        {
          response = {"text" : "Processing Images"}
        }

  //    response = {
  //     "attachment": {
  //       "type": "template",
  //       "payload": {
  //         "template_type": "generic",
  //         "elements": [{
  //           "title": "Photo Id ",
  //           "subtitle": "Please upload your face picture",
  //           "image_url": attachment_url,
  //           "buttons": [
  //             {
  //               "type": "postback",
  //               "title": "Yes",
  //               "payload": "secondImage",
  //             }    
  //           ],
  //         }]
  //       }
  //     }
  //   }
  // }  
  else{
  	response = {"text" : "Sorry I am not able to understand your response: Please text Apply or RealIdInfo"}
  } 
  
  // Sends the response message
    
}
return response; 
}
// Handles messaging_postbacks events
static handlePostback(sender_psid, received_postback) {
	let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'GET_STARTED') {
    response = {
    "text": "Welcome, I can help you with RealIdInfo or RealIdApplication",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"RealIdInfo",
        "payload":"<POSTBACK_PAYLOAD>",
      },{
        "content_type":"text",
        "title":"RealIdApplication",
        "payload":"<POSTBACK_PAYLOAD>",
      }
    ]
  }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }

  else if(payload === "secondImage")
  {
    console.log(received_postback);
  }
  // Send the message to acknowledge the postback
  return response;
  }

};


