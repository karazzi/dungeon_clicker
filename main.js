function GameData() {
  this.version = "babyenemies";
  this.gold = null;
  this.goldPerClick = 1;
  this.gpsTotal = 0;
  this.updateInterval = 10; //milliseconds
  this.productionMultiplier = 1;
  this.costMultiplier = 1.15;
  this.lastSave = null;
  this.lastSaveMS = null;
  this.quests = {
    delivery: new Quest("Delivery", 0, 0.1, 15, 1, this.costMultiplier),
    rats: new Quest("Rats", 0, 1, 100, 1, this.costMultiplier),
    kobolds: new Quest("Kobolds", 0, 8, 1100, 1, this.costMultiplier),
    goblins: new Quest("Goblins", 0, 47, 12000, 1, this.costMultiplier),
    orcs: new Quest("Orcs", 0, 260, 130000, 1, this.costMultiplier),
    underdark: new Quest("Underdark", 0, 1400, 1400000, 1, this.costMultiplier),
    beholder: new Quest("Beholder", 0, 7800, 20000000, 1, this.costMultiplier),
    youngDragon: new Quest("Young Dragon", 0, 44000, 330000000, 1, this.costMultiplier),
    lich: new Quest("Lich", 0, 260000, 5100000000, 1, this.costMultiplier),
    ancientDragon: new Quest("Ancient Dragon", 0, 1600000, 75000000000, 1, this.costMultiplier),
    demigod: new Quest("Demigod", 0, 10000000, 1000000000000, 1, this.costMultiplier)
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
    }else{
      if (typeof savegame.gold !== "undefined") game.gold = savegame.gold;
      if (typeof savegame.goldPerClick !== "undefined") game.goldPerClick = savegame.goldPerClick;
      if (typeof savegame.gpsTotal !== "undefined") game.gpsTotal = savegame.gpsTotal;
      if (typeof savegame.productionMultiplier !== "undefined") game.productionMultiplier = savegame.productionMultiplier;
      if (typeof savegame.costMultiplier !== "undefined") game.costMultiplier = savegame.costMultiplier;
      if (typeof savegame.lastSave !== "undefined") game.lastSave = savegame.lastSave;
      if (typeof savegame.lastSaveMS !== "undefined") game.lastSaveMS = savegame.lastSaveMS;
      for(quest in game.quests) {
        if(typeof savegame.quests[quest] !== "undefined"){
          for (property in game.quests[quest]){
            if (typeof savegame.quests[quest][property] !== "undefined") game.quests[quest][property] = savegame.quests[quest][property];
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
  game.gold += game.gpsTotal * game.updateInterval/1000;
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
  goldString = game.gold.toFixed(0);
  document.getElementById("goldGained").innerHTML = goldString;
  gpsString = "Total gps: " + game.gpsTotal + " gold/s";
  document.getElementById("gpsTotalInfo").innerHTML = gpsString;
}

function updateButton(quest) {
  var buttonId = quest + "Info";
  document.getElementById(buttonId).innerHTML = "Owned: " + game.quests[quest].owned + ", cost: " + game.quests[quest].nextCost + " gold";
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

// Initialize game
window.addEventListener("load", function(){
  game = initGameData();
  for(quest in game.quests) {
    updateButton(quest);
  }
  updateGold();
});

// Auto gain gold
window.setTimeout(function(){
  window.setInterval(function(){
    autoGold();
  }, game.updateInterval);
}, 2000)


// Save game every x milliseconds
window.setInterval(function(){
  saveGame();
}, 1000)
