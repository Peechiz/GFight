var knex = require('../db/knex');

// Player always receives random fighter

// fighter always has at least one random weapon

// player may buy new fighter in exchange for money

var game = {
  // returns ID of randomly chosen fighter
  getFighter: function(user_id){
    // get fighters count
    var num;
    knex('fighters')
      .count()
      .first()
      .then(result => {
        num = parseInt(result.count)

        var randomID = Math.floor(Math.random() * num);

        // insert into users_fighters
        console.log('Adding user:',user_id,'fighter:',randomID);
        knex('users_fighters').insert({
          user_id: user_id,
          fighter_id: randomID
        }).then(result2 => {
          console.log(result2);

          // return fighter ID to assign weapon
          return randomID;
        })
      })
  },
  // randomly assigns a weapon from the pool to a fighter
  assignWeapon: function(fighter_id){
    // adds weapon to fighter_weapon
    var num;
    knex('weapons')
      .count()
      .first()
      .then(result => {
        num = parseInt(result.count)

        var randomID = Math.floor(Math.random() * num);

        console.log('Assigning weapon to:',fighter_id,'weapon:',randomID);
        knex('fighters_weapons').insert({
          fighter_id: fighter_id,
          weapon_id: randomID
        }).then(result2 => {
          console.log(result2);
        })
      })
  },
  // buys the user a fighter. returns success as true/false
  buyFighter: function(user_id){
    // check balance
    knex('users')
      .select('money')
      .where({id:user_id})
      .first()
      .then(result => {
        var cash = result.money
        console.log('user has '+ result.money + ' money');
        if (cash < 100){
          console.log('not enough money');
          return false
        }
        else {
          // else debit gold
          cash -= 100;
          knex('users')
            .where({id:user_id})
            .update({money:cash})
            .then(result2 => {
              console.log('buying a new fighter');
              // and add new fighter i.e. this.getFighter()
              // does so in a promise so that we can assign weapon after assigning fighter
              var newfighter = new Promise((resolve,reject),function(){
                resolve(this.getFighter(user_id));
              }).then(fighter => {
                this.assignWeapon(fighter);
              })
              // return true
              return true;
            })
        }
      })
  },
  // returns ID of randomly chosen opponent fighter
  getOpponentFighter: function(opponent_id){
    knex('users_fighters')
      .where({user_id:opponent_id})
      .then( result => {
        var numFighters = result.length;
        var randomFighter = Math.floor(Math.random() * numFighters);
        return result[randomFighter].fighter_id
      })
  },
  //
  //   fight/:user1/:user1_fighter/:user2/:user2_fighter
  //
  //  fighters table:  wins, losses
  //  fighters_weapons table: fighter_id, weapon_id
  //
  // USER1 is CURRENT player id
  // USER2 is CHALLENGED player id
  fight: function(user1,user1_fighter,user2,user2_fighter){
    // create a strength value for each fighter
        // f1val, f2val = wins + strength
    // roll Math.random on the combined fvals
        // f1val + f2val = total.  Math.random() * total;
    // if roll > f1val, f2 wins else f1 wins

    // winner
      // gains 25 gold
      // fighter +1 win
      // maybe fighter gets opponent fighter's weapon...
    // loser
      // fighter dies
        // remove from users_fighters
        // reset fighter wins to zero
      // assign new fighter

    // return RESULT object
  }
}

module.exports = game;
