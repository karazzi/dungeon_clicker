function GameData() {
  this.version = "babytest20";
  this.gold = 0;
  this.goldLifeTime = 0;
  this.platinum = 0;
  this.platinumMultiplier = 0.02;
  this.goldPerClick = 1;
  this.gpsTotal = 0;
  this.updateInterval = 10; //milliseconds
  this.offlineMultiplier = 0.5;
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
    2: new Upgrade("delivery", 500, 1, "Delivering messages"),
    3: new Upgrade("delivery", 10e3, 10, "Delivering messages"),
    4: new Upgrade("delivery", 100e3, 25, "Delivering messages"),
    5: new Upgrade("rats", 1e3, 1, "Exterminating rats"),
    6: new Upgrade("rats", 5e3, 5, "Exterminating rats"),
    7: new Upgrade("rats", 50e3, 25, "Exterminating rats"),
    8: new Upgrade("rats", 5e6, 50, "Exterminating rats"),
    9: new Upgrade("kobolds", 11e3, 1, "Killing kobolds"),
    10: new Upgrade("kobolds", 55e3, 5, "Killing kobolds"),
    11: new Upgrade("kobolds", 550e3, 25, "Killing kobolds"),
    12: new Upgrade("kobolds", 55e6, 50, "Killing kobolds"),
    13: new Upgrade("goblins", 120e3, 1, "Hunting goblins"),
    14: new Upgrade("goblins", 600e3, 5, "Hunting goblins"),
    15: new Upgrade("goblins", 6e6, 25, "Hunting goblins"),
    16: new Upgrade("goblins", 600e6, 50, "Hunting goblins"),
    17: new Upgrade("orcs", 1.3e6, 1, "Slaying orcs"),
    18: new Upgrade("orcs", 6.5e6, 5, "Slaying orcs"),
    19: new Upgrade("orcs", 65e6, 25, "Slaying orcs"),
    20: new Upgrade("orcs", 6.5e9, 50, "Slaying orcs"),
    21: new Upgrade("delivery", 10e6, 50, "Delivering messages"),
    22: new Upgrade("underdark", 14e6, 1, "Your ventures into the Underdark"),
    23: new Upgrade("underdark", 70e6, 5, "Your ventures into the Underdark"),
    24: new Upgrade("underdark", 700e6, 25, "Your ventures into the Underdark"),
    25: new Upgrade("underdark", 70e9, 50, "Your ventures into the Underdark"),
    26: new Upgrade("beholder", 200e6, 1, "Killing the beholder"),
    27: new Upgrade("beholder", 1e9, 5, "Killing the beholder"),
    28: new Upgrade("beholder", 10e9, 25, "Killing the beholder"),
    29: new Upgrade("beholder", 1e12, 50, "Killing the beholder"),
    30: new Upgrade("youngDragon", 3.3e9, 1, "Slaying a Young Green Dragon"),
    31: new Upgrade("youngDragon", 16.5e9, 5, "Slaying a Young Green Dragon"),
    32: new Upgrade("youngDragon", 165e9, 25, "Slaying a Young Green Dragon"),
    33: new Upgrade("youngDragon", 16.5e12, 50, "Slaying a Young Green Dragon"),
    34: new Upgrade("lich", 51e9, 1, "Destroying the lich"),
    35: new Upgrade("lich", 255e9, 5, "Destroying the lich"),
    36: new Upgrade("lich", 2.55e12, 25, "Destroying the lich"),
    37: new Upgrade("lich", 255e12, 50, "Destroying the lich"),
    38: new Upgrade("ancientDragon", 750e9, 1, "Slaying an Ancient Red Dragon"),
    39: new Upgrade("ancientDragon", 3.75e12, 5, "Slaying an Ancient Red Dragon"),
    40: new Upgrade("ancientDragon", 37.5e12, 25, "Slaying an Ancient Red Dragon"),
    41: new Upgrade("ancientDragon", 3.75e15, 50, "Slaying an Ancient Red Dragon"),
    42: new Upgrade("demigod", 10e12, 1, "Obliteration of a demigod"),
    43: new Upgrade("demigod", 50e12, 1, "Obliteration of a demigod"),
    44: new Upgrade("demigod", 500e12, 1, "Obliteration of a demigod"),
    45: new Upgrade("demigod", 50e15, 1, "Obliteration of a demigod"),
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
      if (typeof savegame.goldLifeTime !== "undefined") game.goldLifeTime = savegame.goldLifeTime;
      if (typeof savegame.platinum !== "undefined") game.platinum = savegame.platinum;
      if (typeof savegame.goldPerClick !== "undefined") game.goldPerClick = savegame.goldPerClick;
      if (typeof savegame.lastSave !== "undefined") game.lastSave = savegame.lastSave;
      if (typeof savegame.lastSaveMS !== "undefined") game.lastSaveMS = savegame.lastSaveMS;
      for(quest in game.quests) {
        if(typeof savegame.quests[quest] !== "undefined"){
          if (typeof savegame.quests[quest].owned !== "undefined") {
            game.quests[quest].owned = savegame.quests[quest].owned;
            game.quests[quest].nextCost = Math.ceil(game.quests[quest].baseCost * Math.pow(game.costMultiplier, game.quests[quest].owned));
          }
        }
      }
      for(upgrade in game.upgrades) {
        if(typeof savegame.upgrades[upgrade] !== "undefined") {
          if(typeof savegame.upgrades[upgrade].owned !== "undefined") {
            game.upgrades[upgrade].owned = savegame.upgrades[upgrade].owned;
            if(game.upgrades[upgrade].owned === true){
              quest = game.upgrades[upgrade].quest;
              game.quests[quest].questMultiplier *= 2;
            }
          }
        }
      }
    }
  }
  return game;
}

function goldClick() {
  game.gold += game.goldPerClick;
  game.goldLifeTime += game.goldPerClick;
  updateGold();
}

function autoGold() {
  updateGps();
  var timeElapsed = (Date.now() - game.lastUpdated) / 1000;
  game.lastUpdated = Date.now();
  game.gold += game.gpsTotal * timeElapsed;
  game.goldLifeTime += game.gpsTotal * timeElapsed;
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
      gpsNew += game.quests[quest].owned * game.quests[quest].gps * game.quests[quest].questMultiplier * (1 + game.platinumMultiplier * game.platinum);
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
    // goldString = game.gold.commarize();
  }
  document.getElementById("goldGained").innerHTML = goldString;
  if(game.gpsTotal < 1e6) {
    gpsString = "Total gps: " + game.gpsTotal.toLocaleString('en-us', {maximumFractionDigits: 0}) + " gold/s";
  } else {
    gpsString = "Total gps: " + game.gpsTotal.toExponential(2) + " gold/s";
  }

  document.getElementById("gpsTotalInfo").innerHTML = gpsString;
}

function updateButton(quest) {
  var buttonInfo = quest + "Info";
  var costString = '';
  var questGps = game.quests[quest].gps * game.quests[quest].questMultiplier * (1 + game.platinumMultiplier * game.platinum);
  var gpsString = '';
  if(game.quests[quest].nextCost < 1000000) {
    costString = game.quests[quest].nextCost.toLocaleString('en-us');
  } else {
    costString = game.quests[quest].nextCost.toExponential(2);
  }
  if(questGps < 1000000){
    gpsString = questGps.toLocaleString('en-us');
  }else{
    gpsString = questGps.toExponential(2);
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
  // Make sure no stray information is present in the upgrade wrapper
  document.getElementById("upgradeWrapper").innerHTML = '';

  // Arrange all upgrades in an array to be able to sort them by cost
  var sortable = [];
  for(upgrade in game.upgrades) {
    if(game.upgrades[upgrade].owned === false){
      sortable.push([upgrade, game.upgrades[upgrade].cost, game.upgrades[upgrade].tooltip]);
    }
  }

  // Sort by cost - index 1
  sortable.sort(function(a, b){return a[1] - b[1]});

  // Loop through all sorted upgrades creating buttons for buying.
  for(val in sortable) {
    var upgradeId = sortable[val][0];
    var tooltip = sortable[val][2];
    if(sortable[val][1] < 1000000){
      var cost = sortable[val][1].toLocaleString('en-us', {maximumFractionDigits: 0});
    }else{
      var cost = sortable[val][1].toExponential(2);
    }
    document.getElementById("upgradeWrapper").innerHTML += '<button type="button" name="button" style="display:none;" class="btn btn-success upgrade-btn" id="upgrade' + upgradeId + '" data-toggle="tooltip" data-html="true" title="' + tooltip + ' yields twice as much.<br>' + cost + ' gold." onclick="buyUpgrade(' + upgradeId + ')"></button>'
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

function askPlatinum(){
  updatePlatinum();
  $("#platinumModal").modal();
}

function updatePlatinum(){
  var nextCost = Math.pow(10, 12) * (Math.pow(game.platinum + 1, 3) - Math.pow(game.platinum, 3));
  var availableCoins = Math.floor(Math.cbrt((game.goldLifeTime)/Math.pow(10, 12)));

  document.getElementById("platinumModalBody").innerHTML = '';
  var platinumString = '';
  if(nextCost > game.goldLifeTime){
    var goldDiff = nextCost - (game.goldLifeTime);
    platinumString = "You need " + goldDiff.toExponential(4) + " gold to buy the next platinum coin.<br>";
  } else {
    platinumString = "Resetting now will grant you a total of " + (availableCoins - game.platinum) + " platinum coins.<br>";
  }

  document.getElementById("platinumModalBody").innerHTML += platinumString;

  var platinumInfo = "<small><em>Each platinum coin increases your gold/s by 2 %.</em></small>";
  document.getElementById("platinumModalBody").innerHTML += platinumInfo;
}

function gainPlatinum() {
  var availablePlatinum = Math.floor(Math.cbrt((game.goldLifeTime)/Math.pow(10, 12)));
  var goldLifeTime = game.goldLifeTime;
  resetGame();
  game.goldLifeTime = goldLifeTime;
  game.platinum = availablePlatinum;
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
}, 15000)

// Initialize game
window.addEventListener("load", function(){
  game = initGameData();
  document.getElementById("goldPerClick").innerHTML = game.goldPerClick + " gold/click";
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
      game.goldLifeTime += offlineProd;
    }
  }
  updateGold();

  $('[data-toggle="tooltip"]').tooltip();
});

// Misc functions
function commarize() {
  // Alter numbers larger than 1k
  if (this >= 1e6) {
    var units = [
      "Mill",
      "Bill",
      "Trill",
      "Quad",
      "Quint",
      "Sext",
      "Sept",
      "Oct",
      "Non",
      "Dec"
    ];

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
