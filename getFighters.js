var express = require('express'),
app = express(),
rp = require('request-promise'),
knex = require('./db/knex');

require('locus');
require('dotenv').load();

const token = process.env.SLACK_TOKEN;
var classURL = 'https://slack.com/api/channels.list';
var studentURL = 'https://slack.com/api/users.info';

var getChannel = {
    uri: classURL,
    qs: {
        token: token // -> uri + '?token=xxxxx%20xxxxx'
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};

function getUser(user){
  return {
    uri: studentURL,
    qs: {
      token: token,
      user: user
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
  }
}

var fighters = [];

rp(getChannel)
    .then(function (g) {
      var g24;
      var classmates = [];
      g.channels.forEach(group => {
        if (group.id === 'C12V6MTAL'){
          g24 = group;
        }
      })
      // console.log(g24);
      g24.members.forEach(member => {
        classmates.push(member)
      })
      // console.log(classmates);

      // get profiles for each classmate
      // user.realname
      // user.profile.image_192
      var gettingClass = [];
      classmates.forEach(student => {
        console.log('adding a classmate');
        gettingClass.push(rp(getUser(student)))
      })

      Promise.all(gettingClass).then(students => {
        console.log('done getting classmates');
        students.forEach(s => {
          fighters.push({
            slack_name: s.user.real_name,
            img_url: s.user.profile.image_192,
            wins: 0,
            losses: 0
          })
        })
        // do knex stuff

        // TO INSERT A fighter
        //
        // insert ({slack_name: fighter.name},{img_url: fighter.img},{wins:0},{losses:0})

        console.log('updateing DB');
        fighters.forEach(fighter=>{
          console.log('inserting: ',fighter);
          knex('fighters').insert(fighter).then(result => {
            console.log('result',result);
          });
          // knex.raw(`INSERT INTO fighters VALUES `)
        });

        // fighters.forEach(fighter => {
        //   knex('fighers').insert()
        // })

      })
    })
    .catch(function (err) {
      console.log(err);
    });
