// scripting file built to handle server requests. all code in this script is adapted from 
// staged-simple-message-board because i was unsure of other ways to set up the requests.
// this includes all async functions listed, the get/put/post requests at the bottom of the file, 
// and the setup code/variables for the express server 

const express = require('express');
const serv = express();
serv.use(express.static('client'));
const mod = require('./data');

async function listProfiles(request, resolve) {
    resolve.json(await mod.listProfiles());
}

async function loginRequest(request, resolve) {
  const success = await mod.loginRequest(request.query.ownerName, request.query.ownerPass);
  if (!success) {
    resolve.status(404).send('Incorrect details. Please try again');
    return;
  }
  resolve.json(success);
}

// get request to get 
async function loginSuccess(request, resolve) {
  const success = await mod.loginSuccess(request.query.ownerID);
  resolve.json(success);
}

// get request function to retrieve all data from the location table in the database
async function getLocations(request, resolve) {
    resolve.json(await mod.getLocations());
}

// get request function to get all data from the breeds table in the database
async function getBreeds(request, resolve) {
    resolve.json(await mod.getBreeds());
}

// post request to send a new user's information to the database
async function addNewUser(request, resolve) {
    const newUser = await mod.addNewUser(request.query.ownerID, request.query.ownerName, request.query.ownerPass, request.query.ownerLocation);
    resolve.json(newUser);
}

// post request to send a new user's dog information to the database
async function addNewDog(request, resolve) {
  const newDog = await mod.addNewDog(request.query.dogID, request.query.dogName, request.query.dogAbout, request.query.dogAge, request.query.dogSex, request.query.dogBreed, request.query.dogOwner);
  resolve.json(newDog);
}

// put request function to update client's profile information
async function updateOwnerInfo(request, resolve) {
  const updateUser = await mod.updateOwnerInfo(request.query.ownerID, request.query.ownerName, request.query.ownerLocation);
  resolve.json(updateUser);
}

// put request function to update the client's dog information
async function updateDogInfo(request, resolve) {
  const updateDog = await mod.updateDogInfo(request.query.dogID, request.query.dogName, request.query.dogAbout, request.query.dogAge, request.query.dogSex, request.query.dogBreed);
  resolve.json(updateDog);
}

// get request function to list all message involving the client
async function listMessages(request, resolve) {
  const success = await mod.listMessages(request.query.clientID);
  resolve.json(success);
}

// get request function to retrieve data from a conversation with a selected user
async function getConvoData(request, resolve) {
  const convo = await mod.getConvoData(request.query.clientID, request.query.profileID);
  resolve.json(convo);
}

// post request function to send message from client to another user
async function sendMessage(request, resolve) {
  const message = await mod.sendMessage(request.query.messageContent, request.query.clientID, request.query.profileID);
  resolve.json(message);
}

// post request function to send message to client from admin profile
async function welcomeMessage(request, resolve) {
  const message = await mod.welcomeMessage(request.query.clientID);
  resolve.json(message);
}

// error handling function for async operations, adapted from staged-simple-message-board 
function asyncErrorHandler(operation) {
    return (request, resolve, next) => {
      Promise.resolve(operation(request, resolve, next))
        .catch((error) => next(error || new Error()));
    };
  }

// list of request denotations
serv.get('/dogs/', asyncErrorHandler(listProfiles));
serv.get('/messages/', asyncErrorHandler(listMessages));
serv.get('/convo/', asyncErrorHandler(getConvoData))
serv.get('/ownercheck/', asyncErrorHandler(loginRequest));
serv.get('/clientinfo/', asyncErrorHandler(loginSuccess));
serv.get('/locations/', asyncErrorHandler(getLocations));
serv.get('/breeds/', asyncErrorHandler(getBreeds));
serv.put('/ownerupdate/', express.json(), asyncErrorHandler(updateOwnerInfo));
serv.put('/dogupdate/', express.json(), asyncErrorHandler(updateDogInfo)); 
serv.post('/owner/', express.json(), asyncErrorHandler(addNewUser));
serv.post('/dogadd/', express.json(), asyncErrorHandler(addNewDog));
serv.post('/sendmessage/', express.json(), asyncErrorHandler(sendMessage));
serv.post('/welcome/', express.json(), asyncErrorHandler(welcomeMessage));

serv.listen(8080);
