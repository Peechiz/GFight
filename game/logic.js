"use strict";
var knex = require('../db/knex');
var getFromDB = require('./helpers');


var game = {

    // returns ID of randomly chosen fighter
    getFighter: function(user_id) {
      // get fighters count
      return new Promise((resolve, reject) => {
        console.log('getting fighter');
        getFromDB.randomId('fighters').then((randomId) => {
          console.log('Giving', user_id, 'fighter:', randomId);

          knex('users_fighters').insert({
            user_id: user_id,
            fighter_id: randomId
          }).then(result => {
            console.log('test', result);
            resolve(randomId);
          })
        })
      })
    },


    // randomly assigns a weapon from the pool to a fighter
    assignWeapon: function(fighter_id) {
      getFromDB.randomId('weapons').then(randomId => {
        randomId += 110;
        console.log('Giving', fighter_id, 'weapon:', randomId);

        knex('fighters')
          .where('id', fighter_id)
          .update({
            weapon_id: randomId
          }).then(result => {
            console.log(result);
          })
      })
    },


    // buys the user a fighter. returns success as true/false
    buyFighter: function(user_id) {
      // check balance
      // else debit gold
      getFromDB.getBalanceFor(user_id).then(hasCash => {
        if (hasCash) {
          console.log('cash monay');
          this.getFighter(user_id).then((fighter_id) => {
            this.assignWeapon(fighter_id);
          });
        } else {
          // something
          console.log('broke');
        }
      })
    },


    // returns ID of randomly chosen opponent fighter
    getOpponentFighter: function(opponent_id) {
      return new Promise((resolve,reject)=>{
        getFromDB.randomFighterFor(opponent_id).then(fighter=>{
          console.log(fighter);
          resolve(fighter);
        })
      })
    },

    //   fight/:user1/:user1_fighter/:user2/:user2_fighter
    //   returns {win: bool[, newWeapon: bool]}
    fight: function(user1, user1_fighter, user2, user2_fighter) {

      // create a strength value for each fighter

      var fighter1str = getFromDB.getFighterStrengthFor(user1_fighter);
      var fighter2str = getFromDB.getFighterStrengthFor(user2_fighter);
      var weaponXfer;

      return new Promise((resolve,reject)=>{
        Promise.all([fighter1str,fighter2str])
          .then(values=>{
            var victor = getFromDB.determineWinner(values[0],values[1]);
            var fight;
            if (victor === 'attacker') {
              fight = {
                winner: user1,
                loser: user2,
                dead: user2_fighter,
                alive: user1_fighter
              };
            } else {
              fight = {
                winner: user2,
                loser: user1,
                dead: user1_fighter,
                alive: user2_fighter
              }
            }
            // getFromDB.addMoney(fight.winner,25).then(result=>console.log('add25',result))
            // getFromDB.addMoney(fight.loser,5).then(result=>console.log('add5',result))
            // getFromDB.incrementWinsForFighter(fight.alive).then(result=>console.log('+fighterWins',result))
            // getFromDB.incrementWinsForUser(fight.winner).then(result=>console.log('+userWins',result))
            // getFromDB.incrementLossForUser(fight.loser).then(result=>console.log('-userWins',result))
            // getFromDB.resetWins(fight.dead).then(result=>console.log('deadFighter wins reset',result))

            var promises = [
              getFromDB.addMoney(fight.winner,25),
              getFromDB.addMoney(fight.loser,5),
              getFromDB.incrementWinsForFighter(fight.alive),
              getFromDB.incrementWinsForUser(fight.winner),
              getFromDB.incrementLossForUser(fight.loser),
              getFromDB.incrementLossForFighter(fight.dead),
              getFromDB.resetWins(fight.dead)
            ]

            Promise.all(promises).then(values=>{
              getFromDB.weaponXferFor(fight).then(result=>{
                console.log('weapon xfer',result);
                weaponXfer = result;
              });

              this.getFighter(fighter.loser);
              console.log('result',{winner: fight, weaponXfer: weaponXfer});
              resolve({winner: fight, weaponXfer: weaponXfer});
            })
          })
      })
    },

  } // end game

module.exports = game;
