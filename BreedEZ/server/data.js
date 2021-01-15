// scripting file to handle postgres queries and export modules. due to lack of knowledge on alternative setup methods, 
// code here is adapted from staged-simple-message-board, 
// including all async functions, code to setup the postgres client, and module export methods 
// psql commands were written by me

// sets up a connection to a postgres database
const Client = require('pg').Client;
const config = require('./conf');
const psql = new Client(config);
psql.connect();

// query function to submit login request data
async function loginRequest(ownerName, ownerPass) {
    const query = 'select * from ownerData where ownerName = $1 and ownerPass = $2;';
    const data = await psql.query(query, [ownerName, ownerPass]);
    return data.rows[0];
}

// query function to retrieve all appropriate user data once login is successful
async function loginSuccess(ownerID) {
    const query = 'select ownerData.ownerID, ownerData.ownerName, ownerData.ownerLocation, dogData.dogID, dogData.dogName, dogData.dogAbout, dogData.dogAge, dogData.dogSex, dogData.dogBreed, dogData.dogOwner from ownerData inner join dogData on ownerData.ownerID = dogData.dogOwner where ownerID = $1;';
    const data = await psql.query(query, [ownerID]);
    return data;
}

// query function to send data when user creates a profile
async function addNewUser(ownerID, ownerName, ownerPass, ownerLocation) {
    const query = 'insert into ownerData (ownerID, ownerName, ownerPass, ownerLocation) values ($1, $2, $3, $4);';
    await psql.query(query, [ownerID, ownerName, ownerPass, ownerLocation]);
    return;
}

// query function to add a dog and link it to a user
async function addNewDog(dogID, dogName, dogAbout, dogAge, dogSex, dogBreed, dogOwner) {
    const query = 'insert into dogData (dogID, dogName, dogAbout, dogAge, dogSex, dogBreed, dogOwner) values ($1, $2, $3, $4, $5, $6, $7);';
    await psql.query(query, [dogID, dogName, dogAbout, dogAge, dogSex, dogBreed, dogOwner]);
    return;
}

// query function to get data for the profile browser screen
async function listProfiles() {
    const query = 'select ownerData.ownerID, ownerData.ownerName, ownerData.ownerLocation, dogData.dogID, dogData.dogName, dogData.dogAbout, dogData.dogAge, dogData.dogSex, dogData.dogBreed, dogData.dogOwner from ownerData inner join dogData on ownerData.ownerID = dogData.dogOwner;';
    const data = await psql.query(query);
    return data.rows;
}

// query function to update user profile with new information
async function updateOwnerInfo(ownerID, ownerName, ownerLocation) {
    const query = 'update ownerData set ownerName = $1, ownerLocation = $2 where ownerID = $3;';
    await psql.query(query, [ownerName, ownerLocation, ownerID]);
    return;
}

// query function to update user profile with new information
async function updateDogInfo(dogID, dogName, dogAbout, dogAge, dogSex, dogBreed) {
    const query = 'update dogData set dogName = $1, dogAbout = $2, dogAge = $3, dogSex = $4, dogBreed = $5 where dogID = $6;';
    await psql.query(query, [dogName, dogAbout, dogAge, dogSex, dogBreed, dogID]);
    return;
}

// query function to get data for the message browser screen
async function listMessages(clientID) {
    const query = 'select * from messageData where messageSender = $1 or messageReceiver = $1 order by messageTime desc;';
    const data = await psql.query(query, [clientID]);
    return data.rows;
}

// query function to send conversation message data to another user and the database
async function sendMessage(messageContent, clientID, profileID) {
    const query = 'insert into messageData (messageContent, messageSender, messageReceiver) values ($1, $2, $3);';
    await psql.query(query, [messageContent, clientID, profileID]);
    return;
}

// query function to get data for an individual, selected conversation
async function getConvoData(clientID, profileID) {
    const query = 'select * from messageData where (messageSender = $1 and messageReceiver = $2) or (messageSender = $2 and messageReceiver = $1) order by messageTime asc;';
    const data = await psql.query(query, [clientID, profileID]);
    return data.rows;
}

// query function to add in example message on new user creation
async function welcomeMessage(clientID) {
    const query = 'insert into messageData (messageContent, messageSender, messageReceiver) values (\'Welcome to BreedEZ! If you message other users, your conversations will appear here. This is a default profile set up by the app, so I can`t reply to you. Feel free to message other users! Go make your dog some new friends!\', 6784329, $1);';
    await psql.query(query, [clientID]);
    return;
}

// query function to list breeds on the profile editing screen
async function getBreeds() {
    const query = 'select * from breedData order by breedName asc;';
    const data = await psql.query(query);
    return data.rows;
}

// query function to list locations and calculate distances on certain screens
async function getLocations() {
    const query = 'select * from locationData order by locationName asc;';
    const data = await psql.query(query);
    return data.rows;
}

module.exports = {
    listProfiles,
    listMessages,
    getConvoData,
    sendMessage,
    addNewUser,
    updateOwnerInfo,
    addNewDog,
    updateDogInfo,
    loginRequest,
    loginSuccess,
    getBreeds,
    getLocations,
    welcomeMessage,
};