var knex = require('../db/knex');

dbHelpers = {
  randomId: function(table){
    return new Promise((resolve,reject)=>{
      knex(table)
      .count()
      .first()
      .then(result => {
        var num = parseInt(result.count)
        resolve(Math.ceil(Math.random() * num ))
      })
    })
  },
  randomFighterFor: function(userId){
    return new Promise((resolve,reject)=>{
      knex('users_fighters')
        .where({
          user_id: userId
        })
        .then(result => {
          var numFighters = result.length;
          console.log(userId, 'has', numFighters, 'fighter(s)');

          var randomFighter = Math.floor(Math.random() * numFighters);

          console.log(result);
          console.log('choosing', randomFighter, 'index: fighter_id', result[randomFighter]);

          resolve(result[randomFighter])
        })
    })
  },
  getBalanceFor: function(userId){
    return new Promise((resolve,reject)=>{
      knex('users')
        .select('money')
        .where({id:userId})
        .first()
        .then(result=>{
          var cash = result.money;
          console.log('user has',cash,'money');

          if (cash >= 100) {
            cash -= 100;
            knex('users')
              .where({id:userId})
              .update({money:cash})
              .then(result2 => {
                console.log('buying a new fighter');
                resolve(true);
              })
          } else {
                resolve(false);
          }

        })
    })
  },
  getFighterStrengthFor: function(fighterId){

    return new Promise((resolve,reject)=>{
      knex('fighters')
      .join('weapons', 'fighters.weapon_id', '=', 'weapons.id')
      .where({
        'fighters.id': fighterId
      })
      .first()
      .then(fighter=>{
        resolve(fighter.wins+fighter.strength);
      })
    })
  },
  determineWinner: function(str1,str2){
    var total = str1+str2;
    var result = Math.floor(Math.random()*total)
    if (result > str1) {
      return 'attacker'
    }
    else {
      return 'defender'
    }
  },

  addMoney: function(userId,amount){
    console.log('adding',amount,'to',userId);
    return knex('users')
      .where({
        id: userId
      })
      .increment('money',amount)
  },

  incrementWinsForFighter: function(fighterId){
    return knex('fighters')
      .where({
        id: fighterId
      })
      .increment('wins', 1)
  },

  incrementWinsForUser: function(userId){
    return knex('users')
      .where({
        id: userId
      })
      .increment('wins', 1)
  },

  incrementLossForUser: function(userId){
    return knex('users')
      .where({
        id: userId
      })
      .increment('losses', 1)
  },

  incrementLossForFighter: function(fighterId){
    return knex('fighter')
      .where({
        id: fighterId
      })
      .increment('losses', 1)
  },


  resetWins: function(fighterId){
    return knex('fighters')
      .where({
        id: fighterId
      })
      .update({
        wins: 0
      })
  },

  weaponXferFor: function(fight) {
    var coinflip = Math.random();
    return new Promise((resolve,reject)=>{
      if (coinflip > .5) {

        knex('fighters')
          .column('weapon_id')
          .where({
            'id': fight.dead
          })
          .first()
          .then(result =>{
            console.log('looted!');
            console.log('weapon',result);
            knex('fighters')
              .where({
                'id': fight.alive
              })
              .update({
                weapon_id: result.weapon_id
              })
              .then(result2 => {
                console.log('weapon xferred!');
                resolve(true)
              })

          })
      } else {
        console.log('NOT looted!');
        resolve(false);
      }
    })
  },


}

module.exports = dbHelpers;
