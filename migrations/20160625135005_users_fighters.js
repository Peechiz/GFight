
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_fighers', function(table){
    table.integer('user_id').unsigned().index().references('users.id');
    table.integer('figher_id').unsigned().index().references('fighters.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_fighters');
};
