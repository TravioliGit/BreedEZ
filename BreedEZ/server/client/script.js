// i tried my best to organise the order of the functions themselves; the upper third contains functions designed to build and populate the page
// the lower third contains functions designed solely to submit, retrieve and manipulate data to/from the database
// the middle third contains functions designed to use data gatheredfrom the lower third functions to use/manipulate the upper third functions to build the pages
// bespoke references are found within the code (anything specific to one function)
// code for get, put and post requests adapted from staged-simple-message-board
// a large amount of this file is just DOM we learned in class and get/put/post requests

// global variables. will track page number, if user is new, override value for page loading, user id, filter values, index values
let pageNumber = 0;
let userCreateCheck = false;
let pageOverride;
let globalInt = 0;
let filterAge;
let filterBreed;
let filterLocation;
let convoIndex;
let filterIndex = 0;
window.addEventListener('load', pageLoader(pageNumber));

// page loader index. for use with the page header icons
function pageLoader(numb) {
    switch (numb) { 
        case 0:
            showStartPage();
            break;
        case 1:
            loadProfileEditor();
            break;
        case 2:
            loadProfileBrowser();
            break;
        case 3:
            loadMessageScreen();
            break;
        case 4:
            loadFilterMenu();
            break;        
        default:
            console.log('where the hell did you tap for this');
    }
}

// function to change page header from logo to header links
function enableHeader() {
    // clears logo, loads assets
    const images = ['/images/edit-profile.png', '/images/browse-dogs.png', '/images/messages.png', '/images/filter.png'];
    const headerAnchor = document.querySelector('ul');
    headerAnchor.innerHTML = '';

    // adds assets to header
    for (const item in images) {
        const header = document.createElement('li');
        const headerImg = document.createElement('img');
        header.id = header+item;  
        headerImg.src = images[item]; 
        header.append(headerImg);
        headerAnchor.append(header);
    }

    // adds click events
    const headerLinks = document.querySelectorAll('li');
    for (let i=0; i<headerLinks.length; i++) {
        headerLinks[i].addEventListener('click', clickEvent => {
            pageLoader(i+1);
        });
    }
}

// function to clear main of ancillary functions, such as buttons
function clearMain() {
    const main = document.querySelector('main');
    try {
        const updateDogButton = document.querySelectorAll('#submitButton');
        for (const item in updateDogButton) {
            main.removeChild(updateDogButton[item]);
        }
    } catch { }
    try {
        const label = document.querySelectorAll('#startLabel');
        for (const item in label) {
            main.removeChild(label[item]);
        }
    } catch { }
}

// sets up and attaches a paragraph element to the page (id: fieldlabel)
function fieldLabel(str) {
    const start = document.querySelector('#startPage');
    const label = document.createElement('p');
    label.id = 'fieldLabel';
    label.textContent = str;
    start.append(label); 
}

// sets up and attaches a paragraph element to the page (id: startlabel)
function startLabel(str) {
    const start = document.querySelector('#startPage');
    const label = document.createElement('p');
    label.id = 'startLabel';
    label.textContent = str;
    start.append(label); 
}

// displays the startup  page of the app
async function showStartPage() {
    // sets up the create button click event
    const createButton = document.querySelector('#showCreate');
    createButton.addEventListener('click', clickEvent => {
        userCreateCheck = true;
        getLocations();
    });

    // sets up the login button click event
    const loginButton = document.querySelector('#showLogin');
    loginButton.addEventListener('click', clickEvent => {
        showLoginPage();
    });    
}

// function to build up the user info editing fields on the page. called to stop repeat code, used on the user create and profile editing screen
function buildUserEditInfo(locations) {
    // sets handle for page, enables page break for styling use
    const start = document.querySelector('#startPage');
    const br = document.createElement('br');
    br.id = 'br';
    let label;

    // adds the name entry field to the page
    label = 'Enter your name:';
    fieldLabel(label);
    const nameEntry = document.createElement('input');
    nameEntry.id = 'nameEntry';
    nameEntry.type = 'text';
    nameEntry.autocomplete = false;
    nameEntry.maxLength = 30;
    nameEntry.placeholder = 'Username...';
    start.append(nameEntry);
    start.append(br);

    // only enables the password entry field if new user is being created
    if (userCreateCheck == true) {
        // adds the password entry field
        label = 'Enter a password:';
        fieldLabel(label);
        const passEntry = document.createElement('input');
        passEntry.id = 'passEntry';
        passEntry.type = 'text';
        passEntry.autocomplete = false;
        passEntry.maxLength = 30;
        passEntry.placeholder = 'Password...';
        start.append(passEntry);
        start.append(br.cloneNode(true));
    }

    // sets up a drop down to choose a city
    label = 'Choose the city you live in (typing your name into the list will help you find it):';
    fieldLabel(label);
    const locationEntry = document.createElement('select');
    locationEntry.id = 'locationDropDown';
    let placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Click here for city list';

    // adds list of cities to drop down list
    start.append(locationEntry);
    start.append(br.cloneNode(true));
    locationEntry.append(placeholder);
    for (const item in locations) {
        let opt = document.createElement('option');
        opt.textContent = locations[item].locationname;
        opt.value = locations[item].locationid;
        locationEntry.append(opt);
    }
}

// function to build up the dog info editing fields on a page.
function buildDogEditInfo(breeds) {
    // adds the name entry field to the page, sets up a page break for styling use, and sets up field-identifier labels
    const start = document.querySelector('#startPage');
    const br = document.createElement('br');
    br.id = 'br';
    let label;

    // adds the dog name entry field
    label = 'Enter dog name:'
    fieldLabel(label);
    const nameEntry = document.createElement('input');
    nameEntry.id = 'dogNameEntry';
    nameEntry.type = 'text';
    nameEntry.autocomplete = false;
    nameEntry.maxLength = 20;
    nameEntry.placeholder = 'Dog name...';
    start.append(nameEntry);
    start.append(br);

    // adds the about entry field to the page
    label = 'About your dog:';
    fieldLabel(label);
    const aboutEntry = document.createElement('textarea');
    aboutEntry.id = 'aboutEntry';
    aboutEntry.type = 'text';
    aboutEntry.rows = 5;
    aboutEntry.cols = 50;
    aboutEntry.maxLength = 500;
    aboutEntry.placeholder = 'About your dog...';
    start.append(aboutEntry);
    start.append(br.cloneNode(true));

    // sets up a drop down to set dog age
    label = 'Set your dog\'s age:';
    fieldLabel(label);
    const ageEntry = document.createElement('select');
    ageEntry.id = 'ageDropDown';
    let placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Set your dog\'s age';
    start.append(ageEntry);
    start.append(br.cloneNode(true));
    ageEntry.append(placeholder);
    // loop to populate dropdown
    for (i=0; i<11; i++) {
        let opt = document.createElement('option');
        opt.textContent = i;
        opt.value = i;
        ageEntry.append(opt);
    }

    // sets up a drop down to set dog sex. i am not mature enough for this
    label = 'Choose your dog\'s sex:';
    fieldLabel(label);
    const sexEntry = document.createElement('select');
    sexEntry.id = 'sexDropDown';
    let placeholder2 = document.createElement('option');
    placeholder2.value = '';
    placeholder2.textContent = 'Set your dog\'s sex';
    start.append(sexEntry);
    start.append(br.cloneNode(true));
    sexEntry.append(placeholder2);
    // cannot concisely set up with loop so went with a more verbose approach
    let optM = document.createElement('option');
    optM.textContent = 'Male';
    optM.value = 'Male';
    sexEntry.append(optM);
    let optF = document.createElement('option');
    optF.textContent = 'Female';
    optF.value = 'Female';
    sexEntry.append(optF);
    

    // sets up a drop down to choose a breed
    label = 'Set your dog\'s breed:';
    fieldLabel(label);
    const breedEntry = document.createElement('select');
    breedEntry.id = 'breedDropDown';
    let placeholder3 = document.createElement('option');
    placeholder3.value = '';
    placeholder3.textContent = 'Click here for breed list';
    start.append(breedEntry);
    start.append(br.cloneNode(true));
    // populates breed list
    breedEntry.append(placeholder3);
    for (const item in breeds) {
        let opt = document.createElement('option');
        opt.textContent = breeds[item].breedname;
        opt.value = breeds[item].breedid;
        breedEntry.append(opt);
    }

    // function to display relevant breed image on the page when the user selects a breed from the drop down list
    let breedIcon = document.createElement('img');
    breedIcon.id = 'breedImage';
    start.append(breedIcon);   
    breedEntry.addEventListener("change", clickEvent => {
        try {
            // this attempts to remove the placeholder image on user login 
            let template = document.querySelector('#breedImagePlaceholder');
            start.removeChild(template);
        } catch { }

        // if statement prevents dom crash incase breed-- is -1
        let breed = breedEntry.value;
        breed--;
        if (breed == -1) {
            start.removeChild(breedIcon);
        } else {
            breedIcon.src = breeds[breed].breedimage;
            start.append(breedIcon);
            start.append(br.cloneNode(true)); 
        }
    });
}

// displays form for existing login
function showLoginPage(str) {
    const start = document.querySelector('#startPage');
    start.innerHTML = '';

    // manipulates helper text
    const startLabel = document.createElement('p');
    startLabel.id = 'startLabel';
    if (!str) {
        startLabel.textContent = 'Please enter your username and password.';
    } else {
        startLabel.textContent = str;
    }
    start.append(startLabel);
    
    // adds the name entry field to the page
    label = 'Enter username:';
    fieldLabel(label);
    const nameEntry = document.createElement('input');
    nameEntry.id = 'nameEntry';
    nameEntry.type = 'text';
    nameEntry.autocomplete = false;
    nameEntry.placeholder = 'Username...';
    start.append(nameEntry);

    // adds the password entry field
    label = 'Enter password:';
    fieldLabel(label);
    const passEntry = document.createElement('input');
    passEntry.id = 'passEntry';
    passEntry.type = 'text';
    passEntry.autocomplete = false;
    passEntry.placeholder = 'Password...';
    start.append(passEntry);

    // adds the submit button, sets up click event to transfer login data
    label = ' ';
    fieldLabel(label);
    const submit = document.createElement('input');
    submit.id = 'submitLogin';
    submit.type = 'submit';
    submit.value = 'Login';
    start.append(submit);

    submit.addEventListener('click', clickEvent => {
        const loginCheck = { ownerName: nameEntry.value, ownerPass: passEntry.value };
        submitLoginData(loginCheck);
    });
}

// displays page for new user creation
function showNewUserPage(locations) {
    const start = document.querySelector('#startPage');
    start.innerHTML = '';

    // manipulates helper text
    const startLabel = document.createElement('p');
    startLabel.textContent = 'Please create a username and password, then tell us what city you\'re from!';
    startLabel.id = 'startLabel';
    start.append(startLabel);

    buildUserEditInfo(locations);

    // adds the submit button, sets up click event to transfer login data
    const submit = document.createElement('input');
    submit.id = 'submitButton';
    submit.type = 'submit';
    submit.value = 'Create User';
    start.append(submit);

    let nameEntry = document.querySelector('#nameEntry');
    let passEntry = document.querySelector('#passEntry');
    let locationEntry = document.querySelector('#locationDropDown')
    submit.addEventListener('click', clickEvent => {
        // adds check that the fields aren't empty. if full, assigns user an ID, calls function to submit data to database
        if (nameEntry.value !== '' && passEntry.value !== '' && locationEntry.value !== '') {
            // code for random integer generator adapted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            const userid = Math.floor(Math.random() * Math.floor(2000000000));
            globalInt = userid;
            const newUserInfo = { ownerID: userid, ownerName: nameEntry.value, ownerPass: passEntry.value, ownerLocation: locationEntry.value };
            submitUserCreateData(newUserInfo);
        } else {
            startLabel.textContent = 'Please fill in all fields before continuing.';
            return;
        }
    });
}

// function to display dog creation page
function showDogCreatePage(breeds) {
    const start = document.querySelector('#startPage');
    const main = document.querySelector('main');
    start.innerHTML = '';

    // manipulates helper text
    const startLabel = document.createElement('p');
    startLabel.id = 'startLabel';
    startLabel.textContent = 'Now set up a profile for your dog! This will be how you appear to other users on the site.';
    start.append(startLabel);

    // calls page template setter
    buildDogEditInfo(breeds);

    // adds the submit button, sets up click event to transfer login data
    const submit = document.createElement('input');
    submit.id = 'submitButton';
    submit.type = 'submit';
    submit.value = 'Create Dog';
    main.append(submit);

    // sets up handlers to pass parameters to a click event   
    let nameEntry = document.querySelector('#dogNameEntry');
    let aboutEntry = document.querySelector('#aboutEntry');
    let ageDrop = document.querySelector('#ageDropDown');
    let sexDrop = document.querySelector('#sexDropDown');
    let breedDrop = document.querySelector('#breedDropDown');

    submit.addEventListener('click', clickEvent => {
        // adds check that the fields aren't empty. if full, assigns user an ID, calls function to submit data to database
        if (nameEntry.value !== '' && aboutEntry.value !== '' && ageDrop.value !== '' && sexDrop.value !== '' && breedDrop.value !== '') {
            // code for random integer generator adapted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            const dogid = Math.floor(Math.random() * Math.floor(2000000000));
            const dogowner = globalInt;
            const newDogInfo = { dogID: dogid, dogName: nameEntry.value, dogAbout: aboutEntry.value, dogAge: ageDrop.value, dogSex: sexDrop.value, dogBreed: breedDrop.value, dogOwner: dogowner };
            userCreateCheck = false;
            pageNumber = 1;
            submitNewDogData(newDogInfo);
        } else {
            startLabel.textContent = 'Please fill in all fields before continuing.';
            return;
        }
    });
}

// The below function or two will be built to handle loading information about the user's profile when entering the 'create profile' sceen
// the below function in particular builds the page after retrieving lists of breeds and locations
function loadProfileEditor() {
    // locks the button that navigates to this page (stops duplicating page information)
    if (pageNumber == 1 && pageOverride == false) { 
        return;
    }
    pageNumber = 1;
    const start = document.querySelector('#startPage');
    start.innerHTML = '';
    clearMain();
    if (pageOverride == true) {
        pageOverride = false;
        const main = document.querySelector('main');
        const label = document.createElement('p');
        label.id = 'startLabel';
        label.textContent = 'Changes saved!';
        main.append(label);
    }
    const str = 'Edit your and your dogs\' information here. Remember to click save once you\'re done!';
    startLabel(str);
    getLocations();
}

// this function manipulates the profile editor screen based on the information retrieved about the client
async function showProfileEditor(breeds) {
    const start = document.querySelector('#startPage');
    const main = document.querySelector('main');

    // fetches client info
    const id = globalInt;
    const client = await fetch(`clientinfo/?ownerID=${id}`);
    let data;
    if (client.ok) {
        data = await client.json();
    } else {
        console.error();
    }
    // sets handles, uses retrieved client values to populate elements
    // setting it up as such prevents user from changing all values to null on clicking the submit button
    // by using their data as placeholder data on the form. i also couldn't figure out a more elegant way to do this, but that might just be me being not-so-smart
    let nameEntry = document.querySelector('#nameEntry');
    nameEntry.value = data.rows[0].ownername;
    let locationEntry = document.querySelector('#locationDropDown');
    locationEntry.value = data.rows[0].ownerlocation;
    let dogNameEntry = document.querySelector('#dogNameEntry');
    dogNameEntry.value = data.rows[0].dogname;
    let aboutEntry = document.querySelector('#aboutEntry');
    aboutEntry.value = data.rows[0].dogabout;
    let ageDrop = document.querySelector('#ageDropDown');
    ageDrop.value = data.rows[0].dogage;
    let sexDrop = document.querySelector('#sexDropDown');
    sexDrop.value = data.rows[0].dogsex;
    let breedDrop = document.querySelector('#breedDropDown');
    breedDrop.value = data.rows[0].dogbreed;

    // function to display relevant breed image on the page when the user selects a breed from the drop down list (and on page load)
    let breedIconTemplate = document.createElement('img');
    breedIconTemplate.id = 'breedImagePlaceholder';
    let value = breedDrop.value;
    // minus one to skirt around 0indexing
    value--;
    breedIconTemplate.src = breeds[value].breedimage;
    start.append(breedIconTemplate);

    // sets up the submit button and click event
    const submit = document.createElement('input');
    submit.id = 'submitButton';
    submit.type = 'submit';
    submit.value = 'Save Changes';
    main.append(submit);
    submit.addEventListener('click', clickEvent => {
        // adds check that the fields aren't empty. if full, calls functions to submit data to database
        if (nameEntry.value !== '' && locationEntry.value !== '' && dogNameEntry.value !== '' && aboutEntry.value !== '' && ageDrop.value !== '' && sexDrop.value !== '' && breedDrop.value !== '') {
            const ownerInfo = { ownerID: globalInt, ownerName: nameEntry.value, ownerLocation: locationEntry.value };
            const dogid = data.rows[0].dogid;
            const dogInfo = { dogID: dogid, dogName: dogNameEntry.value, dogAbout: aboutEntry.value, dogAge: ageDrop.value, dogSex: sexDrop.value, dogBreed: breedDrop.value };
            updateOwnerInfo(ownerInfo);
            updateDogInfo(dogInfo);
            // override allows page loader to bypass the check at the start of the loading function
            pageOverride = true;
            loadProfileEditor();
        } else {
            const errorLabel = document.querySelector('p');
            errorLabel.id = 'errorLabel';
            errorLabel.textContent = 'Please fill in all fields before continuing.';
            main.append(errorLabel);
            return;
        }
    });
}

// loads the data for the profile browser screen
async function loadProfileBrowser() {
    // locks the button that navigates to this page (stops duplicating page information)
    if (pageNumber === 2) { 
        return;
    }
    pageNumber = 2;
    clearMain();
    getLocations();
}

// displays the profile browser screen
async function showProfileBrowser(breeds, locations) { 
    // clears containers, sets up the main container for profile space
    const start = document.querySelector('#startPage');
    start.innerHTML = '';
    clearMain();
    const profileList = document.createElement('div');
    profileList.id = 'profileList';
    start.append(profileList);

    // adds helper text
    const label = document.createElement('p');
    label.id = 'startLabel';
    label.textContent = 'Click a dog to find out more!'
    profileList.append(label);

    // grabs all profile info from the database 
    const response = await fetch(`dogs`);
    let profiles;
    if (response.ok) {
        profiles = await response.json();
    }
    else {
        console.error();
    }
    
    // isolates client info from retrieved list (this was far more of a bitch than it should have been but discovering the .find funciton just about saved my sanity)
    // code for finding object in array of objects adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    const clientInfo = profiles.find( ({ownerid}) => ownerid === globalInt);
    const clientLatLon = locations.find( ({locationid}) => locationid === clientInfo.ownerlocation);
    const clientLat = parseFloat(clientLatLon.locationlat);
    const clientLon = parseFloat(clientLatLon.locationlon);
    // removes client and admin profile from list of profiles to avoid its inclusion in calculation/display
    // code to remove object from array of objects by index adapted from https://stackoverflow.com/questions/16491758/remove-objects-from-array-by-object-property
    let removeIndex = profiles.map(function(item) { return item.ownerid; })
                       .indexOf(globalInt);
    ~removeIndex && profiles.splice(removeIndex, 1);
    removeIndex = profiles.map(function(item) { return item.ownerid; })
                       .indexOf(6784329);
    ~removeIndex && profiles.splice(removeIndex, 1);


    // calculates distance between client location and all profile locations. places them into tempArray alongside dogname and breedimage
    // then tempArray will be pushed into distArray for use in building the page
    const distArray = [];
    for (const item in profiles) {
        let tempArray = [];
        let profileLatLon = locations.find( ({locationid}) => locationid === profiles[item].ownerlocation);
        profileLat = parseFloat(profileLatLon.locationlat);
        profileLon = parseFloat(profileLatLon.locationlon);
        // haversine formula used and calculation code adapted from: https://www.movable-type.co.uk/scripts/latlong.html
        const R = 6371000; // metres (radius of earth)
        const φ1 = clientLat * Math.PI/180; // φ, λ in radians
        const φ2 = profileLat * Math.PI/180;
        const Δφ = (profileLat-clientLat) * Math.PI/180;
        const Δλ = (profileLon-clientLon) * Math.PI/180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const result = R * c; // in metres

        const dogimage = breeds.find( ({breedid}) => breedid === profiles[item].dogbreed);
        // filters dogs by gender; client will only see dogs of opposite sex
        if (clientInfo.dogsex !== profiles[item].dogsex) {
            let filterLocationInt = parseInt(filterLocation);
            // switch case to filter results based from fitler menu options. this took me too long to suss out
            // since there's only 3 filter options, it's feasible to iterate through the options based on how many are selected (filterIndex)
            // as long as all option scenarios are covered. so a mess of ifs will work
            switch (filterIndex) {
                case 0:
                    tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                    distArray.push(tempArray);
                    break;
                case 1:
                    if (filterAge == profiles[item].dogage) {
                        tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                        distArray.push(tempArray);
                    } else if (filterBreed == profiles[item].dogbreed) {
                        tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                        distArray.push(tempArray);
                    } else if (filterLocationInt == profiles[item].ownerlocation) {
                        tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                        distArray.push(tempArray);
                    } else {
                    }
                    break;
                case 2:
                    if (filterAge == profiles[item].dogage && filterBreed == profiles[item].dogbreed) {
                        tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                        distArray.push(tempArray);
                    } else if (filterAge == profiles[item].dogage && filterLocationInt == profiles[item].ownerlocation) {
                        tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                        distArray.push(tempArray);
                    } else if (filterBreed == profiles[item].dogbreed && filterLocationInt == profiles[item].ownerlocation) {
                        tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                        distArray.push(tempArray);
                    } else {
                    }
                    break;
                case 3:
                    if (filterAge == profiles[item].dogage && filterBreed == profiles[item].dogbreed && filterLocationInt == profiles[item].ownerlocation) {
                        tempArray = [profiles[item].ownerid, result, profiles[item].dogname, dogimage.breedimage];
                        distArray.push(tempArray);
                    } else {
                    }
                    break;
            }   
        }
    }

    // code to sort 2d array adapted from: https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
    distArray.sort(function(a,b) {
        return a[1]-b[1]
    });
    console.log(distArray); // leaving the console log to prove the distance sorting works to the metre because i was (and am) too proud of getting the whole thing working

    // loop to set up the page and display organised elements
    for (const item in distArray) { 
        // sets up and appends the profile space 
        const profileContent = document.createElement('div');
        profileContent.id = 'profileContent';    
        profileList.append(profileContent);
        profileContent.addEventListener('click', clickEvent => {
            let id = distArray[item][0];
            loadProfileInspect(id, breeds, locations);
        });   

        // sets up and adds the image holder on the profile
        const dogImage = document.createElement('img');
        dogImage.id = 'dogImage';
        dogImage.src = distArray[item][3];
        profileContent.append(dogImage);  

        // sets up and adds the name field on the profile
        const dogName = document.createElement('div');
        dogName.id = 'dogName';
        dogName.textContent = distArray[item][2];
        profileContent.append(dogName);   
    }    

    const emptyCheck = document.querySelectorAll('#profileContent');
    if (emptyCheck.length == 0) {
       label.textContent = 'No dogs were found that matched your filter criteria. Try different or fewer options'; 
    }
}

// loads any necessary data for the message list screen
async function loadMessageScreen() {
 // locks the button that navigates to this page (stops duplicating page information)
    if (pageNumber === 3) {
      return;
    }
    pageNumber = 3;
    clearMain();
    const start = document.querySelector('#startPage');
    start.innerHTML = '';
    getLocations();
}

// uses data gathered from the relevant loading function to build the message list screen
async function showMessageScreen(breeds, messages) {
   const start = document.querySelector('#startPage');
   clearMain();
     // sets up the main container div and some handlers
    const label = 'Click on a message to chat!';
    startLabel(label);
    const messageList = document.createElement('div');
    messageList.id = 'messageList';
    start.append(messageList);

    // grabs all profile info from the database 
    const response = await fetch(`dogs`);
    let profiles;
    if (response.ok) {
        profiles = await response.json();
    }
    else {
        console.error();
    }

    // the below code will help to organise gathered message data into unique thumbnails and templates.
    // the process will be to go through every retrieved message object, find anyone who isn't the user, and only include them in the page-building loop once
    // loop will iterate through messages. all unique profiles that aren't the user get stored into compArray for use in comparison with following messages
    // then loop will push all good messages into tempArray and discard all duplicate users, then push the arrays into excArray
    // not necessary to sort by time as the list was retrieved in desc order, which is beneficial to this setup as it's sorted already
    let excArray = [];
    let compArray = [];
    // tried to set it up as a for-each loop but it wasn't playing nice. got this setup working though
    for (let item = 0; item < messages.length; item++) {
        let tempArray = [];
        // two nested if statements used to filter through results, since user's id could be either messagesender or messageretriever
        if (messages[item].messagesender == globalInt) {
            if (compArray.includes(messages[item].messagereceiver)) {
            } else {
                // also retrieves the uesr's name and dog breed for image placement purposes
                let profileinfo = profiles.find( ({ownerid}) => ownerid === messages[item].messagereceiver);
                let dogimage = breeds.find( ({breedid}) => breedid === profileinfo.dogbreed);
                tempArray = [profileinfo.ownerid, profileinfo.ownername, messages[item].messagecontent, dogimage.breedimage];
                compArray.push(messages[item].messagereceiver);
                excArray.push(tempArray);
            }
        }
        // second nest
        if (messages[item].messagereceiver == globalInt) {
            if (compArray.includes(messages[item].messagesender)){
            } else {
                let profileinfo = profiles.find( ({ownerid}) => ownerid === messages[item].messagesender);
                let dogimage = breeds.find( ({breedid}) => breedid === profileinfo.dogbreed);
                tempArray = [profileinfo.ownerid, profileinfo.ownername, messages[item].messagecontent, dogimage.breedimage];
                compArray.push(messages[item].messagesender);
                excArray.push(tempArray);
            }
        }
    }

    // loop to set up the page. again, tried a for-each loop but it wasn't having it
    for (let i=0; i<excArray.length; i++) { 
        // sets up and appends the listed message space. adds click event to load conversation
        const messageInfo = document.createElement('div');
        messageInfo.id = 'messageInfo';    
        messageList.append(messageInfo);
        messageInfo.addEventListener('click', clickEvent => {
            // assigns profile id to global variable
            convoIndex = excArray[i][0];
            loadChatScreen();
        });   

        // sets up and adds the image of the listed message's sender
        const messageImage = document.createElement('img');
        messageImage.id = 'messageImage';
        console.log(excArray);
        messageImage.src = excArray[i][3];
        messageInfo.append(messageImage);  

        // sets up the div for the listed message information
        const messageContent = document.createElement('div');
        messageContent.id = 'messageContent';
        messageInfo.append(messageContent);   

        // sets up and adds the name of the listed message's sender
        const messageName = document.createElement('div');
        messageName.id = 'messageName';
        messageName.textContent = excArray[i][1];
        messageContent.append(messageName);  

        // sets up and adds the most recent message from the listed message's sender
        const messagePreview = document.createElement('div');
        messagePreview.id = 'messagePreview';
        let str = excArray[i][2];
        let preview = str.slice(0, 50);
        messagePreview.textContent = 'Last message: '+preview+"...";
        messageContent.append(messagePreview);  
    }    
}

// function to retrieve data and load page elements for the filter screen
function loadFilterMenu() {
    // locks the button that navigates to this page (stops duplicating page information)
    if (pageNumber == 4 && pageOverride == false) { 
        return;
    }
    pageNumber = 4;
    const start = document.querySelector('#startPage');
    start.innerHTML = '';
    clearMain();
    if (pageOverride == true) {
        pageOverride = false;
        const main = document.querySelector('main');
        const label = document.createElement('p');
        label.id = 'startLabel';
        label.textContent = 'Filter saved and set!';
        main.append(label);
    }
    getLocations();
}

// function to set up the filter screen
function showFilterMenu(breeds, locations) {
    // sets up handles for page manipulation
    const main = document.querySelector('main');
    const start = document.querySelector('#startPage');
    const br = document.createElement('br');
    br.id = 'br';

    // adds helper text
    let label = 'You can use the options below to set filters for the Browse Profiles screen. You can filter using more than one criteria. If you want to remove a filter, set the option to \'No filter\'. Click save if you choose any!';
    startLabel(label);

    // sets up a drop down to set dog age
    label = 'Filter by age';
    fieldLabel(label);
    const ageEntry = document.createElement('select');
    ageEntry.id = 'ageDropDown';
    let placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'No filter';
    start.append(ageEntry);
    start.append(br);
    ageEntry.append(placeholder);
    // loop to populate dropdown
    for (i=0; i<11; i++) {
        let opt = document.createElement('option');
        opt.textContent = i;
        opt.value = i;
        ageEntry.append(opt);
    }

    // sets up a drop down to choose a city
    label = 'Filter by city:';
    fieldLabel(label);
    const locationEntry = document.createElement('select');
    locationEntry.id = 'locationDropDown';
    let placeholder2 = document.createElement('option');
    placeholder2.value = '';
    placeholder2.textContent = 'No filter';
    // adds list of cities to drop down list
    start.append(locationEntry);
    start.append(br.cloneNode(true));
    locationEntry.append(placeholder2);
    for (const item in locations) {
        let opt = document.createElement('option');
        opt.textContent = locations[item].locationname;
        opt.value = locations[item].locationid;
        locationEntry.append(opt);
    }

    // sets up the dropdown list for breed entry
    label = 'Filter by breed:';
    fieldLabel(label);
    const breedEntry = document.createElement('select');
    breedEntry.id = 'breedDropDown';
    let placeholder3 = document.createElement('option');
    placeholder3.value = '';
    placeholder3.textContent = 'No filter';
    start.append(breedEntry);
    start.append(br.cloneNode(true));
    // populates breed list
    breedEntry.append(placeholder3);
    for (const item in breeds) {
        let opt = document.createElement('option');
        opt.textContent = breeds[item].breedname;
        opt.value = breeds[item].breedid;
        breedEntry.append(opt);
    }

    // populates areas with pre-existing data if exists. sets index for use in display on browse screen
    filterIndex = 0;
    if (filterAge) {
        ageEntry.value = filterAge;
        filterIndex++;
    } else {}
    if (filterBreed) {
        breedEntry.value = filterBreed;
        filterIndex++;
    } else {}
    if (filterLocation) {
        locationEntry.value = filterLocation;
        filterIndex++;
    } else {}

    // sets up the save options button for the filter
    const submit = document.createElement('input');
    submit.id = 'submitButton';
    submit.type = 'submit';
    submit.value = 'Save Filter';
    main.append(submit);
    submit.addEventListener('click', clickEvent => {        
        filterAge = ageEntry.value;
        filterBreed = breedEntry.value;
        filterLocation = locationEntry.value;
        // override allows page loader to bypass the check at the start of the loading function
        pageOverride = true;
        loadFilterMenu();
    });
}

// function to load closeups on user profiles
async function loadProfileInspect(id, breeds, locations) {
    // locks the button that navigates to this page (stops duplicating page information)
    if (pageNumber === 5) { 
        return;
    }
    pageNumber = 5;
    // sets up some useful handles, clears the page and main containers
    const start = document.querySelector('#startPage');
    start.innerHTML = '';
    clearMain();
    const br = document.createElement('br');
    br.id = 'br';

    // fetches profile info. re-used the clientinfo fetch request from the login function because it gets all the info needed here
    const info = await fetch(`clientinfo/?ownerID=${id}`);
    let profile;
    if (info.ok) {
        profile = await info.json();
    } else {
        console.error();
    }

    // sets up the data to be inserted onto the page. set up in a loop to save lines
    const location = locations.find( ({locationid}) => locationid === profile.rows[0].ownerlocation);
    const image = breeds.find( ({breedid}) => breedid === profile.rows[0].dogbreed);
    const data = ['Owner Name: '+profile.rows[0].ownername, 'City: '+location.locationname, 'Dog Name: '+profile.rows[0].dogname, 'About '+profile.rows[0].dogname+': '+profile.rows[0].dogabout, 'Breed: '+image.breedname,
                  'Age: '+profile.rows[0].dogage, 'Sex: '+profile.rows[0].dogsex, 'Click the "Message" button to chat to '+profile.rows[0].ownername+' about '+profile.rows[0].dogname+'! Or click "Browse Profiles" to resume browsing.'];
    for (let item = 0; item <= data.length; item++) {
        label = data[item];
        fieldLabel(label);
    }

    // sets up the message button and click event. this will send them straight into a conversation with the user
    const submit = document.createElement('input');
    submit.id = 'submitButton';
    submit.type = 'submit';
    submit.value = 'Message';
    start.append(submit);
    start.append(br.cloneNode(true));
    submit.addEventListener('click', clickEvent => {     
        // assigns profile id to global variable 
        convoIndex = profile.rows[0].ownerid;
        loadChatScreen();
    });

    // places the breed image of the dog on the page
    const img = document.createElement('img');
    img.id = 'breedImage';
    img.src = image.breedimage;
    start.append(img);  
}

// function to load chat screen with selected conversation
async function loadChatScreen() {
    // locks the button that navigates to this page (stops duplicating page information)
    if (pageNumber == 6 && pageOverride == false) { 
        return;
    }
    pageNumber = 6;
    pageOverride = false;
    const start = document.querySelector('#startPage');
    start.innerHTML = '';
    clearMain();    
    getConversation();
}

// function to build the conversation screen using retrieved data
async function showChatScreen(conversation) {
    const start = document.querySelector('#startPage');
    // sets up the main container div and some handlers
    // fetches client and profile info. re-used the clientinfo fetch request from the login function because it gets all the info needed here
    const profileid = {profileID: convoIndex};
    const info = await fetch(`clientinfo/?ownerID=${profileid.profileID}`);
    let profile;
    if (info.ok) {
        profile = await info.json();
    } else {
        console.error();
    }
    
    // sets up the space for displayed messages
    const convoList = document.createElement('div');
    convoList.id = 'convoList';
    start.append(convoList);
    console.log(conversation[0].messagesender);
    // sets up containers to show messages. did the iterative loop because for some f-in reason for-each loops don't like me anymore
    for (let i=0; i<conversation.length; i++) {
        let index = conversation[i].messagesender;
        // settings for outbound messages
        if (index == globalInt) {
            // initiates main container
            let msg = document.createElement('div');
            msg.id = 'clientMessage';
            convoList.append(msg);
            // sets and attaches name
            let name = document.createElement('div');
            name.id = 'clientMessageName';
            name.textContent = 'You';
            msg.append(name);
            // sets and attaches text
            let content = document.createElement('div');
            content.id = 'clientMessageText';
            content.textContent = conversation[i].messagecontent;
            msg.append(content);
        }
        // settings for inbound messages
        if (index == convoIndex) {
            // sets up main container
            let msg = document.createElement('div');
            msg.id = 'profileMessage';
            convoList.append(msg);
            // sets up and attaches name
            let name = document.createElement('div');
            name.id = 'profileMessageName';
            name.textContent = profile.rows[0].ownername;
            msg.append(name);
            // sets up and attaches message content
            let content = document.createElement('div');
            content.id = 'profileMessageText';
            content.textContent = conversation[i].messagecontent;
            msg.append(content);
        }
    } 

    // sets up the space for the user to enter and send messages. adds click and keyup events 
    const convoFooter = document.createElement('div');
    convoFooter.id = 'convoFooter';
    start.append(convoFooter);

    // attaches the entry field for message sending
    const messageEntry = document.createElement('input');
    messageEntry.id = 'messageEntry';
    messageEntry.type = 'text';
    messageEntry.size = 100;
    messageEntry.autocomplete = false;
    messageEntry.placeholder = 'Type message here.';
    convoFooter.append(messageEntry);

    // adds the button and click events
    const messageSend = document.createElement('input');
    messageSend.id = 'messageSend';
    messageSend.type = 'submit';
    messageSend.value = 'Send';
    convoFooter.append(messageSend);
    messageSend.addEventListener('click', clickEvent => {
        if (messageEntry.value) {
            const message = {messageContent: messageEntry.value, clientID: globalInt, profileID: convoIndex};
            pageOverride = true;
            sendMessage(message);
        }
    });
}   

// function to send login data
async function submitLoginData(loginCheck) {
    let pass = loginCheck.ownerPass;
    let name = loginCheck.ownerName;
    // statement to pass data
    const check = await fetch(`ownercheck/?ownerName=${name}&ownerPass=${pass}`);

    if (check.ok) {
        const confirm = await check.json();
        if (loginCheck.ownerName == confirm.ownername && loginCheck.ownerPass == confirm.ownerpass ) {
            globalInt = confirm.ownerid;
            enableHeader();
            pageNumber = 1;
            loadProfileEditor();
            return;
        } else {
            let str = 'Incorrect details. Please try again. If problem persists, contact the developer. Not like he\'s doing anything important.';
            showLoginPage(str);
            return;
        }
    } else {
        let str = 'Failed to retrieve login data. Please try again. If problem persists, contact the developer. Not like he\'s doing anything important.';
        showLoginPage(str);
        return;
    }
}

// function to submit created user to the database
async function submitUserCreateData(newUserInfo) {
    // fetch request to post information to database
    const payload = newUserInfo;
     const submit = await fetch(`owner/?ownerID=${newUserInfo.ownerID}&ownerName=${newUserInfo.ownerName}&ownerPass=${newUserInfo.ownerPass}&ownerLocation=${newUserInfo.ownerLocation}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // check submission was accepted, moves on if so
    if (submit.ok) {
        getBreeds();
    } else {
        console.error();
        const startLabel = document.querySelector('#startLabel');
        startLabel.textContent = 'Error sending your information! Please try again. If problem persists, the guy who made this is out there, being useless.';
    }
}

// function for to send new dog. could have worded that better but it's not getting edited, so nyeh
async function submitNewDogData(newDogInfo) {
    // fetch request to post information to database
    const payload = newDogInfo;
     const submit = await fetch(`dogadd/?dogID=${newDogInfo.dogID}&dogName=${newDogInfo.dogName}&dogAbout=${newDogInfo.dogAbout}&dogAge=${newDogInfo.dogAge}&dogSex=${newDogInfo.dogSex}&dogBreed=${newDogInfo.dogBreed}&dogOwner=${newDogInfo.dogOwner}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // check submission was accepted, moves on to main webpage
    if (submit.ok) {
        enableHeader();
        welcomeMessage(globalInt);
        loadProfileEditor();
    } else {
        console.error();
        const startLabel = document.querySelector('#startLabel');
        startLabel.textContent = 'Error sending your information! Please try again. If problem persists, the guy who made this is out there, being useless.';
    }
}

// function to update owner info from the profile editor screen
async function updateOwnerInfo(ownerInfo) {
    const payload = ownerInfo;
     const submit = await fetch(`ownerupdate/?ownerID=${ownerInfo.ownerID}&ownerName=${ownerInfo.ownerName}&ownerLocation=${ownerInfo.ownerLocation}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // check submission was accepted, moves on if so
    if (submit.ok) {
        return;
    } else {
        console.error();
        const errorLabel = document.createElement('p');
        errorLabel.id = 'errorLabel';
        errorLabel.textContent = 'Error sending your information! Please try again. If problem persists, tell the guy who wrote this code he\'s an idiot, and he should come fix this.';
        const main = document.querySelector('main');
        main.append(errorLabel);
        return;
    }
}

// function to update client dog info from the profile editor screen
async function updateDogInfo(dogInfo) {
    const payload = dogInfo;    
     const submit = await fetch(`dogupdate/?dogID=${dogInfo.dogID}&dogName=${dogInfo.dogName}&dogAbout=${dogInfo.dogAbout}&dogAge=${dogInfo.dogAge}&dogSex=${dogInfo.dogSex}&dogBreed=${dogInfo.dogBreed}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // check submission was accepted, moves on if so
    if (submit.ok) {
        return;
    } else {
        console.error();
        const errorLabel = document.createElement('p');
        errorLabel.id = 'errorLabel';
        errorLabel.textContent = 'Error sending your dog\'s information! Please try again. If problem persists, tell the guy who wrote this code he\'s an idiot, and he should come fix this.';
        const main = document.querySelector('main');
        main.append(errorLabel);
        return;
    }
}

//function to send message to a user and the database
async function sendMessage(message) {
    // fetch request to post information to database
    const payload = message;
     const submit = await fetch(`sendmessage/?messageContent=${message.messageContent}&clientID=${message.clientID}&profileID=${message.profileID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // check submission was accepted, moves on to main webpage
    if (submit.ok) {
        loadChatScreen();
    } else {
        console.error();
    }
}

// this function will retrieve all locations and their IDs for use in the create/edit user page
async function getLocations() {
    // gets location data
    const resp = await fetch(`locations`);
    let locations;
    if (resp.ok) {
        locations = await resp.json();
    } else {
        locations[0].locationname = 'Error loading locations! Please try again or contact the developer.';
        return locations[0].locationname;
    }
    // new user check. usercreatecheck being true indicates new user
    if (userCreateCheck) {
        showNewUserPage(locations);
    } else {
        getBreeds(locations);
    }
}

// function to retrieve breed list, and related names/images
async function getBreeds(locations) {
    // gets breed data
    const resp = await fetch(`breeds`);
    let breeds;
    if (resp.ok) {
        breeds = await resp.json();
    } else {
        breeds[0].breedname = 'Error loading dog breeds! Please try again. If problems persist, please contact the developer.';
        return breeds[0].breedname;
    }
    // new user check. locations not existing indicates a new user. passes gathered data to other pages if existing user.
    if (locations) {
        switch (pageNumber) {
            case 1:
                buildUserEditInfo(locations);
                buildDogEditInfo(breeds);
                showProfileEditor(breeds);
                break;
            case 2:
                showProfileBrowser(breeds, locations);
                break;
            case 3:
                getMessages(breeds);
                break;
            case 4: 
                showFilterMenu(breeds, locations);
                break;                
        }
    } else {
        showDogCreatePage(breeds);
    }
}

// the below function retrieves all messages pertinent to the client
async function getMessages(breeds) {
    const data = {clientID: globalInt}
    const request = await fetch(`messages/?clientID=${data.clientID}`);
    let messages;
    if (request.ok) {
        messages = await request.json();
    }
    else {
        console.error();
    }
    showMessageScreen(breeds, messages);
}

// the below function will retrieve conversation data for a selected profile
async function getConversation() {
    const data = {clientID: globalInt, profileID: convoIndex};
    // fetch request to get conversation data
    const request = await fetch(`convo/?clientID=${data.clientID}&profileID=${data.profileID}`);
    let conversation;
    if (request.ok) {
        conversation = await request.json();
    }
    else {
        console.error();
    }
    showChatScreen(conversation);
}

// the below function adds the "welcome" message example to the messages list for new users
async function welcomeMessage(id) {
    // fetch request to send userID to database for use in message adding
    // also made it set up an object because it took me 3 hours to figure out that fetch requests can't just use integers for some reason
    const data = { clientID: id };
    const payload = data;
    const submit = await fetch(`welcome/?clientID=${data.clientID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    // check addition was valid. moves on either way
    if (submit.ok) {
        return;
    } else {
        console.error();
        return;
    }
}
