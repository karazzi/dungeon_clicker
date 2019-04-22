function GameData() {
  this.version = "babytest10";
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
  };
  this.upgrades = {
    1: new Upgrade("delivery", 100, 1, "Delivering messages"),
    2: new Upgrade("delivery", 500, 5, "Delivering messages")
  }
}

function Quest(name, owned, gps, baseCost, questMultiplier, multiplier) {
  this.name = name;
  this.owned = owned;
  this.gps = gps;
  this.baseCost = baseCost;
  this.questMultiplier = questMultiplier;
  this.nextCost = Math.ceil(baseCost * Math.pow(multiplier, owned));
}

function Upgrade(quest, cost, requirement, tooltipText) {
  this.quest = quest;
  this.owned = false;
  this.cost = cost;
  this.requirement = requirement;
  this.tooltip = tooltipText;
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
  updateGps();
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
      gpsNew += game.quests[quest].owned * game.quests[quest].gps * game.quests[quest].questMultiplier;
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

function initUpgrades(){
  document.getElementById("upgradeWrapper").innerHTML = '';
  for(upgrade in game.upgrades) {
    if(game.upgrades[upgrade].owned === false){
      var upgradeId = upgrade;
      var tooltip = game.upgrades[upgrade].tooltip;
      if(game.upgrades[upgrade].cost < 1000000){
        var cost = game.upgrades[upgrade].cost;
      }else{
        var cost = game.upgrades[upgrade].cost.toExponential(2);
      }
      document.getElementById("upgradeWrapper").innerHTML += '<button type="button" name="button" style="display:none;" class="btn btn-success upgrade-btn" id="upgrade' + upgradeId + '" data-toggle="tooltip" data-html="true" title="' + tooltip + ' yields twice as much.<br>' + cost + ' gold." onclick="buyUpgrade(' + upgradeId + ')"></button>'
    }
  }
}

function updateUpgrades() {
  for(upgrade in game.upgrades) {
    if(game.upgrades[upgrade].owned === false){
      quest = game.upgrades[upgrade].quest;
      buttonId = "upgrade" + upgrade;
      if(game.quests[quest].owned >= game.upgrades[upgrade].requirement){
        document.getElementById(buttonId).style.display = "inline";
      }
      if(game.gold >= game.upgrades[upgrade].cost){
        document.getElementById(buttonId).classList.add('btn-success');
        document.getElementById(buttonId).classList.remove('btn-warning');
      }else{
        document.getElementById(buttonId).classList.remove('btn-success');
        document.getElementById(buttonId).classList.add('btn-warning');
      }
    }
  }
}

function buyUpgrade(id){
  var cost = game.upgrades[id].cost;
  var buttonId = "upgrade" + id;
  var quest = game.upgrades[id].quest;
  if(game.gold >= cost){
    game.gold -= cost;
    game.upgrades[id].owned = true;
    game.quests[quest].questMultiplier *= 2;
    var element = document.getElementById(buttonId);
    $("#" + buttonId).tooltip("hide");
    element.parentNode.removeChild(element);
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
  initUpgrades();
  $('[data-toggle="tooltip"]').tooltip();
  for(quest in game.quests) {
    updateButton(quest);
  }
  updateGold();
}

// Auto gain gold
window.setTimeout(function(){
  window.setInterval(function(){
    autoGold();
    for (quest in game.quests) {
      updateButton(quest);
    }
    updateUpgrades();
  }, game.updateInterval);
}, 100)


// Save game every x milliseconds
window.setInterval(function(){
  saveGame();
}, 1000)

// Initialize game
window.addEventListener("load", function(){
  game = initGameData();
  initUpgrades();
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

  $('[data-toggle="tooltip"]').tooltip();
});

// Misc functions
function commarize() {
  // Alter numbers larger than 1k
  if (this >= 1e3) {
    var units = ["k", "M", "B", "T"];

    // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
    let unit = Math.floor(((this).toFixed(0).length - 1) / 3) * 3
    // Calculate the remainder
    var num = (this / ('1e'+unit)).toFixed(2)
    var unitname = units[Math.floor(unit / 3) - 1]

    // output number remainder + unitname
    return num + unitname
  }

  // return formatted original number
  return this.toLocaleString()
}

// Add method to prototype. this allows you to use this function on numbers and strings directly
Number.prototype.commarize = commarize
String.prototype.commarize = commarize
