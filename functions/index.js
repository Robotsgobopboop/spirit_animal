// Final for CS50
//Spirit Animal
//Determins users spirit animal based off of birth month
//heather martin: martin.heatherd@gmail.com
'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    BasicCard,
    Permission,
  } = require('actions-on-google');


// Import the firebase-functions package 
const functions = require('firebase-functions');

//import the firebase database requriments
const admin = require('firebase-admin');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

//initalized the app
admin.initializeApp();

//variables for database animals
const db =admin.firestore();
const collectionRef = db.collection('animals');

//global variables to gain personal number and animal associated with animal number
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
    // hard coded animals
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
    // returns the animal and continues converstation with follow up question
    if (conv.data.userName) {
      conv.ask(`<speak>${conv.data.userName}, your spirit animal is a ` +
      `${personalanimal}. ` +
      `Would you like to hear about your spirit animal?</speak>`);
    } else {
      conv.ask(`<speak>Your spirit animal is a ${personalanimal}. ` +
      `Would you like to hear about your spirit animal?</speak>`);
    }
   });

// Set the DialogflowApp object to handle HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

// Handle the Dialogflow intent named 'Default Welcome Intent'.
// this was borrowed from google development training
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new Permission({
      context: 'Hi! To get to know you better',
      permissions: 'NAME'
    }));
  });

  // this is the permission intent. if users allows or does not allow permission
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
      conv.ask(`Alright, no problem. What's your birth month?`);
    } else {
      conv.data.userName = conv.user.name.display;
      conv.ask(`Cool, ${conv.data.userName}. What's your birth month?`);
    }
  });

// creates a global variable used to search database for animal
var termRef = collectionRef.doc('${personalanimal}');

// uses choice intent to answer follow up
// this is where the database intor will be used
  app.intent('choice', (conv, {choice}) => {
    const term = choice.toLowerCase();
    const termRef = collectionRef.doc(`${personalanimal}`);
    return termRef.get()
    .then((snapshot) => {
        const {fact, traits} = snapshot.data();
        if (term == 'fact'){
            conv.close(`${fact}`);
        } else{
            conv.close(`${traits}`);
        }
        
    }) //this is to handle database error
    .catch((e) =>{
        console.log('error: ', e);
        conv.close('Sorry, no idea what you are talking about');
    })
    
  });

    
    