// Final for CS50
//Spirit Animal
//Determins users spirit animal based off of birth month
'use strict';


// Import the Dialogflow module from the Actions on Google client library.
// const {dialogflow} = require('actions-on-google');
const {
    dialogflow,
    BasicCard,
    Permission,
  } = require('actions-on-google');


// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

//import the firebase database requriments
const admin = require('firebase-admin');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

//initalized the app
admin.initializeApp();

//variables for database
const db =admin.firestore();
const collectionRef = db.collection('animals');

//global variables for code
var animalnumber;
var personalanimal;
// Handle the Dialogflow intent named 'spirit animal'.
// The intent collects a parameter named 'date_period'.
app.intent('spirit animal', (conv, {date_period}) => {
    animalnumber = date_period["startDate"].split("-")[1];
      // It is weird to keep saying the persons name
      // asks second question to get better result
      conv.ask(`<speak> Ok, what's your favorite color. </speak>`);
   });

// asks for favortie color
//takes the length of the string color and adds to the birth month to get personalized number
app.intent('fave color', (conv, {color}) => {
    const spiritnumber = Number(color.length) + Number(animalnumber);
    if (spiritnumber == 6) {
        personalanimal = "wolf"
    } else if (spiritnumber == 7) {
        personalanimal = "bat"
    } else if (spiritnumber == 8) {
        personalanimal = "cat"
    } else if (spiritnumber == 9) {
        personalanimal = "deer"
    } else if (spiritnumber == 10) {
        personalanimal = "dog"
    } else if (spiritnumber == 11) {
        personalanimal = "owl"
    } else if (spiritnumber == 12) {
        personalanimal = "raccoon"
    } else if (spiritnumber == 13) {
        personalanimal = "jaguar"
    } else if (spiritnumber == 14) {
        personalanimal = "whale"
    } else if (spiritnumber == 15) {
        personalanimal = "dragon"
    } else if (spiritnumber == 16) {
        personalanimal == "hawk"
    } else if (spiritnumber == 17) {
        personalanimal = "hedgehog"
    } else {
        personalanimal = "bear"
    }
    if (conv.data.userName) {
      conv.ask(`<speak>${conv.data.userName}, your spirit animal is a ` +
      `${personalanimal}. ` +
      `Would you like to hear about your spirit animal?</speak>`);
    } else {
      conv.ask(`<speak>Your spirit animal is a ${personalanimal}. ` +
      `Would you like to hear about your spirit animal?</speak>`);
    }
   });

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new Permission({
      context: 'Hello! To get to know you better',
      permissions: 'NAME'
    }));
  });

  // Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
      conv.ask(`Alright, no problem. What's your birth month?`);
    } else {
      conv.data.userName = conv.user.name.display;
      conv.ask(`Cool, ${conv.data.userName}. What's your birth month?`);
    }
  });

// no idea that I am doing here, besides trying to get into database
var termRef = collectionRef.doc('${personalanimal}');

// var answerFact;
// var answerTraits;

// how about if not this then do the other .replace sizeMap
  app.intent('choice', (conv, {choice}) => {
    const term = choice.toLowerCase();
    const termRef = collectionRef.doc(`${personalanimal}`);
    return termRef.get()
    .then((snapshot) => {
        const {fact, traits} = snapshot.data();
        // answerFact = ${fact};
        // answerTraits = ${traits};
        if (term == 'fact'){
            conv.close(`${fact}`);
        } else{
            conv.close(`${traits}`);
        }
        
    })
    .catch((e) =>{
        console.log('error: ', e);
        conv.close('Sorry, no idea what you are talking about');
    })
    
  });
// Define a mapping of TEST TEST color strings to basic card objects.
// const sizeMap = {
//     'fact': new BasicCard({
//       title: 'fact',
//       image: {
//         url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
//         accessibilityText: 'DO I NEED THIS',
//       },
//       display: 'WHITE',
//     }),
//     'medium': new BasicCard({
//       title: 'Medium',
//       image: {
//         url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
//         accessibilityText: 'DO I NEED THIS',
//       },
//       display: 'WHITE',
//     }),
//     'large': new BasicCard({
//       title: 'Large',
//       image: {
//         url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
//         accessibilityText: 'DO I NEED This',
//       },
//       display: 'WHITE',
//     }),
//     };
    
    