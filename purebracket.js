function shuffleArray(inputArray) {
  /* This is a script that I found on Stack Overflow, they call it the
   * 'Fisher-Yates shuffle', which seems pretty cool. And it works too!
   * So you can be sure that the inputArray is truly sorted.
   */
  var currentIndex = inputArray.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = inputArray[currentIndex];
    inputArray[currentIndex] = inputArray[randomIndex];
    inputArray[randomIndex] = temporaryValue;
  }
  return inputArray;
}

function getBaseLog(x, y) {
  // A cute little change of base function!
  return Math.log(y) / Math.log(x);
}

function getSelectionValue(object) {
  /* Get the sected value of the items inside an object, like a form
   * with radio buttons inside
   */
  for (i = 0; i < object.length; i++) {
    if (object[i].checked){
      return object[i].value;
    }
  }
}

function checkValueInArray(value, inputArray) {
  // Check to see if a value is in the inputArray
  for (var i = 0; i < inputArray.length; i++) {
    if (inputArray[i] == value) {
      return true;
    }
  }
  return false;
}

function createSelection(inputArray) {
  /* Create a <select> object and fill it with options consisting of the items
   * in the input array
   */
  var alphabeticalArray = inputArray.slice().sort()
      selectionItem = document.createElement("select")
      blankItem = document.createElement("option");

  blankItem.style.display = "none";

  selectionItem.appendChild(blankItem);

  for (itemIndex in alphabeticalArray) {
    var item = document.createElement("option");

    item.appendChild(document.createTextNode(alphabeticalArray[itemIndex]));
    selectionItem.appendChild(item);
  }
  return selectionItem;
}

function clearBracket(){
 var bracketBox = document.getElementById("bracket");

  // Clear the bracket div of any existing objects
  while (bracketBox.firstChild) {
      bracketBox.removeChild(bracketBox.firstChild);
  }
  const newBracket = document.createElement("h2");
  const newContent = document.createTextNode("Your bracket will appear here!");
  newBracket.appendChild(newContent);
  bracketBox.appendChild(newBracket);
}

function updateBracket() {
  const selectElements = document.querySelectorAll('select');
  var optionSection = document.getElementById("options")
      numberInput = document.getElementById("numberOfPlayers")
      playerNumber = parseInt(numberInput.value)

  
  for (let i = (selectElements.length - 1); i >= 0; i--) {
    const select = selectElements[i];
    // Create a new element with the desired type
    
    if (select.value!="") {
      const newElement = document.createElement("p");
      newElement.appendChild(document.createTextNode(select.value));
      // Copy attributes from the old element
      for (const attr of select.attributes) {
        newElement.setAttribute(attr.name, attr.value);
      }
      
      if (newElement.getAttribute("id") == "winner") {
        var roundWin = document.createElement("div");

        roundWin.className = "roundWin";
        // Add the names of the winner
          var matchItem = document.createElement("div")
          winnerPlayer = document.createElement("p")

          winnerPlayer.appendChild(document.createTextNode("Champion: " + select.value));

          matchItem.className = "match";

          matchItem.appendChild(winnerPlayer);

          roundWin.appendChild(matchItem);

          //select.parentNode.replaceChild(roundWin, select);
          //select.remove();
          //mainBracket.appendChild(roundWin);
          select.replaceWith(roundWin);
      }
      else if (newElement.getAttribute("id") == "secondWinner") {
        var consWin = document.createElement("div");

        consWin.className = "consWin";
        // Add the names of the winner
          var matchItem = document.createElement("div")
          winnerPlayer2 = document.createElement("p")

          winnerPlayer2.appendChild(document.createTextNode("Consolation Champion: " + select.value));

          matchItem.className = "match";

          matchItem.appendChild(winnerPlayer2);

          consWin.appendChild(matchItem);
          //select.parentNode.replaceChild(roundWin, select);
          //select.remove();
          //mainBracket.appendChild(roundWin);
          select.replaceWith(consWin);
      }
      
      else {
        newElement.appendChild(select.firstChild);
        // Replace the old element with the new one
        select.parentNode.replaceChild(newElement, select);
      }
    }
  }
  localStorage.clear();
  var bracketBox = document.getElementById("bracket");
  localStorage.setItem("bracketSave", bracketBox.outerHTML);
  console.log("Saved bracket after update.")
}

function generateBracket() {
  // Get number of players from input box
  var optionSection = document.getElementById("options")
      numberInput = document.getElementById("numberOfPlayers")
      playerNumber = parseInt(numberInput.value)
  // A closure for displaying warning messages
  function displayWarning(condition, messageString, messageId, warningObject) {
    /* Display a simple warning above warningObject if condition is false,
     * If it is true, and a warning message object is present, remove it.
     */
    if (condition != true) {
      if (Boolean(document.getElementById(messageId)) != true) {
        var warning = document.createElement("p")
        // Set the warning's id attribute so it can be found later
        warning.setAttribute("id", messageId);
        // Set a class name for simple styling purposes
        warning.className = "warningMessage";
        warning.appendChild(document.createTextNode(messageString));
        optionSection.insertBefore(warning, warningObject);
      }
      // Throw an error and stop execution, please
      throw new Error(messageString);
    } else {
      var warning = document.getElementById(messageId);
      if (Boolean(warning) == true) {
        optionSection.removeChild(warning);
      }
    }
  }

  // Use the function above to display a warning if an improper number
  // is entered
  displayWarning(checkValueInArray(playerNumber, [4, 8, 16, 32]),
                 "Please enter a valid number of players",
                 "playerCountWarning", numberInput);
  // Get names from the text box
  var nameBox = document.getElementById("names")
      names = nameBox.value.split("\n")
  // Display a warning if not enough players are listed in the text box
  displayWarning((names.length == numberInput.value),
                 "Please enter the same number of players as submitted in step 1",
                 "numberOfPlayersWarning", nameBox);
  // Find the div where the bracket will be placed
  var bracketBox = document.getElementById("bracket");

  // Clear the bracket div of any existing objects
  while (bracketBox.firstChild) {
      bracketBox.removeChild(bracketBox.firstChild);
  }
  // Find out what type of match was selected
  var bracketSelect = document.getElementById("matchType")
      bracketValue = getSelectionValue(bracketSelect);
  // If not selection was made, throw an error message
  displayWarning(Boolean(bracketValue), "Please select a bracket style",
                 "bracketStyleWarning", document.getElementById("selection"));
  // Create a bracket for the main matches
  var mainBracket = document.createElement("div");

  mainBracket.setAttribute("id", "mainBracket");
  bracketBox.appendChild(mainBracket);
  // If this is a double elimination match, add a secondary bracket
  if (bracketValue == "double") {
    var secondaryBracket = document.createElement("div");

    secondaryBracket.setAttribute("id", "secondaryBracket");
    bracketBox.appendChild(secondaryBracket);
  }
  // Find out how the user would like the bracket ordered
  var orderSelect = document.getElementById("orderType")
      orderValue = getSelectionValue(orderSelect);
  // If there was no selection, throw an error
  displayWarning(Boolean(orderValue), "Please select a player order type",
                 "bracketOrderWarning", document.getElementById("selection"));
  // Create an array to be used for the rest of the script
  var matchArray;
  if (orderValue == "ordered") {
    matchArray = names;
  } else if (orderValue == "unordered") {
    // Use the shuffle function on the list of names
    matchArray = shuffleArray(names);
  }
  // Create a 'round' div for the first round where all players are
  // included
  var round1 = document.createElement("div");
  round1.className = "round1";

  //var round1Title = document.createElement("p");
  //roundTitle.className = "roundTitle";
  //round1Title.appendChild(document.createTextNode(round1.className));
  //round1.appendChild(round1Title);
  
  // Add the names of all the players to the first round
  for (var i = 0; i < matchArray.length; i += 2) {
    var matchItem = document.createElement("div")
        player1 = document.createElement("p")
        player2 = document.createElement("p")
        spacer = document.createElement("div");

    player1.appendChild(document.createTextNode(matchArray[i]));
    player2.appendChild(document.createTextNode(matchArray[i + 1]));

    matchItem.className = "match";
    spacer.className = "spacer";

    matchItem.appendChild(player1);
    matchItem.appendChild(spacer);
    matchItem.appendChild(player2);

    round1.appendChild(matchItem);
  }
  // Add the first round to the bracket
  mainBracket.appendChild(round1)
  // Determine the number of rounds needed using a log function
  var rounds = getBaseLog(2, playerNumber);
  // For all of the remain rounds, generate them one by one
  for (var i = 1; i < rounds; i++) {
    var roundItem = document.createElement("div")
        splits = Math.pow(2, i);

    roundItem.className = "round" + (i + 1);
    
    //var roundTitle = document.createElement("p");
    //roundTitle.className = "roundTitle";
    //roundTitle.appendChild(document.createTextNode(roundItem.className));
    //roundItem.appendChild(roundTitle);
    
    for (j = 0; j < playerNumber / splits; j += 2) {
      var matchItem = document.createElement("div")
          spacer = document.createElement("div")
          possiblePlayers1 = matchArray.slice(j*splits, (j+1)*splits)
          possiblePlayers2 = matchArray.slice((j+1)*splits, (j+2)*splits);

      matchItem.className = "match";
      spacer.className = "spacer";

      var select1 = createSelection(possiblePlayers1)
          select2 = createSelection(possiblePlayers2);

      matchItem.appendChild(select1);
      matchItem.appendChild(spacer);
      matchItem.appendChild(select2);

      roundItem.appendChild(matchItem);
    }
    mainBracket.appendChild(roundItem);
  }
  // Apply the winner to the end of the bracket
  var winnerSelect = createSelection(matchArray);

  winnerSelect.setAttribute("id", "winner");
  // Determine the margin size using some mathematical magic
  var marginSize = (((playerNumber / 2) * 100) - 30) / 2;

  winnerSelect.style.margin = marginSize + "px 0";
  mainBracket.appendChild(winnerSelect);
  // Generate the double elimination bracket if asked to
  if (bracketValue == "double") {
    for (var i = 1; i < rounds; i++) {
      var roundItem = document.createElement("div")
          splits = Math.pow(2, i);

      roundItem.className = "round round" + i;

      //var round1Title = document.createElement("p");
      //roundTitle.className = "roundTitle";
      //roundTitle.appendChild(document.createTextNode(round.className));
      //roundItem.appendChild(roundTitle);

      for (var j = 0; j < playerNumber / splits; j += 2) {
        var matchItem = document.createElement("div")
            spacer = document.createElement("div")
            possiblePlayers1 = matchArray.slice(j*splits, (j+1)*splits)
            possiblePlayers2 = matchArray.slice((j+1)*splits, (j+2)*splits);

        matchItem.className = "match";
        spacer.className = "spacer";

        var select1 = createSelection(possiblePlayers1)
            select2 = createSelection(possiblePlayers2);

        matchItem.appendChild(select1);
        matchItem.appendChild(spacer);
        matchItem.appendChild(select2);

        roundItem.appendChild(matchItem);
      }
      secondaryBracket.appendChild(roundItem);
    }
    var winnerSelect = createSelection(matchArray);

    winnerSelect.setAttribute("id", "secondWinner");

    var marginSize = (((playerNumber / 4) * 100) - 30) / 2;

    winnerSelect.style.margin = marginSize + "px 0";
    secondaryBracket.appendChild(winnerSelect);
  }
  localStorage.clear();
  localStorage.setItem("bracketSave", bracketBox.outerHTML);
  console.log("Saved bracket after generation.")
}

function bracketLoad(){
  
  const bracketHolder = document.getElementById("bracket");
  //const obj = bracketHolder;
  //localStorage.setItem("bracketSave", JSON.stringify(bracketHolder)); 
  const loadBracket = localStorage.getItem("bracketSave"); 
  //testing
  if (loadBracket) {
    bracketHolder.outerHTML = loadBracket;
    updateBracket();
    //localStorage.clear();
    //localStorage.setItem("bracketSave", bracketHolder.outerHTML);
    console.log("Replaced bracket");
  }
  console.log("Load bracket function done");
}



/*
// Function to save data to localStorage
function saveData() {
  const dataToSave = {
    // Replace with the actual data you want to save
    exampleData: "This is some data to save",
  };

  localStorage.setItem("siteData", JSON.stringify(dataToSave));
}

// Function to load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("siteData");
  if (savedData) {
    // Replace with how you want to use the loaded data
    console.log("Loaded data:", JSON.parse(savedData));
  }
}

// Save data before the page is unloaded
window.addEventListener("beforeunload", saveData);

// Load data when the page loads
window.addEventListener("load", loadData);



*/

