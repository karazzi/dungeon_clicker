function GameData() {
  this.version = "babytest4";
  this.gold = null;
  this.goldPerClick = 100;
  this.gpsTotal = 0;
  this.updateInterval = 10; //milliseconds
  this.offlineMultiplier = 0.5;
  this.productionMultiplier = 1;
  this.costMultiplier = 1.15;
  this.lastSave = new Date();
  this.lastSaveMS = Date.now();
  this.lastUpdated = Date.now();
  this.quests = {
    delivery: new Quest("delivery", 0, 0.1, 15, 1, this.costMultiplier),
    rats: new Quest("rats", 0, 1, 100, 1, this.costMultiplier),
    kobolds: new Quest("kobolds", 0, 8, 1100, 1, this.costMultiplier),
    goblins: new Quest("goblins", 0, 47, 12000, 1, this.costMultiplier),
    orcs: new Quest("orcs", 0, 260, 130000, 1, this.costMultiplier),
    underdark: new Quest("underdark", 0, 1400, 1400000, 1, this.costMultiplier),
    beholder: new Quest("beholder", 0, 7800, 20000000, 1, this.costMultiplier),
    youngDragon: new Quest("youngDragon", 0, 44000, 330000000, 1, this.costMultiplier),
    lich: new Quest("lich", 0, 260000, 5100000000, 1, this.costMultiplier),
    ancientDragon: new Quest("ancientDragon", 0, 1600000, 75000000000, 1, this.costMultiplier),
    demigod: new Quest("demigod", 0, 10000000, 1000000000000, 1, this.costMultiplier)
  }
}

function Quest(name, owned, gps, baseCost, questMultiplier, multiplier) {
  this.name = name;
  this.owned = owned;
  this.gps = gps;
  this.baseCost = baseCost;
  this.questmultiplier = questMultiplier;
  this.nextCost = Math.ceil(baseCost * Math.pow(multiplier, owned));
}

function initGameData() {
  // localStorage.removeItem('dungeonClickerSave');
  var game = new GameData();
  var savegame = JSON.parse(localStorage.getItem("dungeonClickerSave"))
  if (savegame !== null) {
    if (savegame.version == game.version) {
      game = savegame;
      game.lastUpdated = Date.now(); // Reset timer
    }else{
      if (typeof savegame.gold !== "undefined") game.gold = savegame.gold;
      if (typeof savegame.goldPerClick !== "undefined") game.goldPerClick = savegame.goldPerClick;
      // if (typeof savegame.gpsTotal !== "undefined") game.gpsTotal = savegame.gpsTotal;
      if (typeof savegame.productionMultiplier !== "undefined") game.productionMultiplier = savegame.productionMultiplier;
      // if (typeof savegame.costMultiplier !== "undefined") game.costMultiplier = savegame.costMultiplier;
      if (typeof savegame.lastSave !== "undefined") game.lastSave = savegame.lastSave;
      if (typeof savegame.lastSaveMS !== "undefined") game.lastSaveMS = savegame.lastSaveMS;
      for(quest in game.quests) {
        if(typeof savegame.quests[quest] !== "undefined"){
          // for (property in game.quests[quest]){
          //   if (typeof savegame.quests[quest][property] !== "undefined") game.quests[quest][property] = savegame.quests[quest][property];
          // }
          if (typeof savegame.quests[quest].owned !== "undefined") {
            game.quests[quest].owned = savegame.quests[quest].owned;
            game.quests[quest].nextCost = Math.ceil(game.quests[quest].baseCost * Math.pow(game.costMultiplier, game.quests[quest].owned));
          }
        }
      }
    }
  }
  return game;
}

function goldClick() {
  game.gold += game.goldPerClick;
  updateGold();
}

function autoGold() {
  var timeElapsed = (Date.now() - game.lastUpdated) / 1000;
  game.lastUpdated = Date.now();
  game.gold += game.gpsTotal * timeElapsed;
  updateGold();
}

function saveGame() {
  var currentdate = new Date();
  var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  game.lastSave = datetime;
  game.lastSaveMS = Date.now();
  document.getElementById("lastSavedInfo").innerHTML = "Last saved: " + datetime;
  localStorage.setItem('dungeonClickerSave', JSON.stringify(game));
}

function updateGps(){
  var gpsNew = 0;
  for(quest in game.quests){
    if(game.quests[quest].owned > 0){
      gpsNew += game.quests[quest].owned * game.quests[quest].gps * game.quests[quest].questmultiplier;
    }
  }
  game.gpsTotal = parseFloat(gpsNew.toFixed(1));
}

function updateGold() {
  var goldString = '';
  if(game.gold < 1000000) {
    goldString = game.gold.toLocaleString('en-us', {maximumFractionDigits: 0});
  }else{
    goldString = game.gold.toExponential(2);
  }
  document.getElementById("goldGained").innerHTML = goldString;
  gpsString = "Total gps: " + game.gpsTotal + " gold/s";
  document.getElementById("gpsTotalInfo").innerHTML = gpsString;
}

function updateButton(quest) {
  var buttonInfo = quest + "Info";
  var costString = '';
  var gpsString = '';
  if(game.quests[quest].nextCost < 1000000) {
    costString = game.quests[quest].nextCost.toLocaleString('en-us');
  } else {
    costString = game.quests[quest].nextCost.toExponential(2);
  }
  if(game.quests[quest].gps < 1000000){
    gpsString = game.quests[quest].gps.toLocaleString('en-us');
  }else{
    gpsString = game.quests[quest].gps.toExponential(2);
  }
  document.getElementById(buttonInfo).innerHTML = "Owned: " + game.quests[quest].owned + ", cost: " + costString + " gold<br>" + gpsString + " gold/s";

  if (game.gold < game.quests[quest].nextCost) {
    document.getElementById(buttonInfo).parentElement.classList.add('btn-danger');
    document.getElementById(buttonInfo).parentElement.classList.remove('btn-info');
  }else{
      document.getElementById(buttonInfo).parentElement.classList.remove('btn-danger');
      document.getElementById(buttonInfo).parentElement.classList.add('btn-info');
  }
}

function startQuest(quest) {
  if(game.quests[quest].nextCost <= game.gold) {
    game.gold -= game.quests[quest].nextCost;
    game.quests[quest].owned += 1;
    game.quests[quest].nextCost = Math.ceil(game.quests[quest].baseCost * Math.pow(game.costMultiplier, game.quests[quest].owned));
    // game.gpsTotal += game.quests[quest].gps;
    // game.gpsTotal = parseFloat(game.gpsTotal.toFixed(1));
    updateGps();
    updateGold();
    updateButton(quest);
  }
}

function resetGame() {
  localStorage.removeItem('dungeonClickerSave');
  game = initGameData();
  for(quest in game.quests) {
    updateButton(quest);
  }
  updateGold();
}

// Auto gain gold
window.setTimeout(function(){
  window.setInterval(function(){
    autoGold();
  }, game.updateInterval);
}, 100)


// Save game every x milliseconds
window.setInterval(function(){
  saveGame();
}, 1000)

// Initialize game
window.addEventListener("load", function(){
  game = initGameData();
  updateGps();
  for(quest in game.quests) {
    updateButton(quest);
  }

  //Generate mana based on time offline
  var savegame = JSON.parse(localStorage.getItem("dungeonClickerSave"))
  if (savegame !== null) {
    if(game.gpsTotal !== 0){
      var timeDiff = Date.now() - game.lastSaveMS;
      var timeDiffSecs = timeDiff / 1000;
      var offlineProd = timeDiffSecs * game.gpsTotal * game.offlineMultiplier;
      if (offlineProd > 1000000) {
        var offProdString = offlineProd.toExponential(2);
      } else {
        var offProdString = offlineProd.toLocaleString('en-us', {maximumFractionDigits: 0});
      }
      // Add string to modal telling player how much mana has been gained during offline time
      document.getElementById("offlineModalBody").innerHTML = "You have been offline for " + timeDiffSecs.toFixed(1) + " seconds."
      document.getElementById("offlineModalBody").innerHTML += "<br>Your quests have yielded " + offProdString + " gold while offline!";
      // Toggling modal
      $("#offlineProdModal").modal();
      //Updating mana
      game.gold += offlineProd;
    }
  }

  updateGold();
});
