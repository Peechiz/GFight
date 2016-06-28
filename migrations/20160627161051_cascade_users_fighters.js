
exports.up = function(knex, Promise) {
  return knex.schema.table('users_fighters', function(table){
    table.increments();
    table.integer('user_id').unsigned().index().references('users.id').onDelete('CASCADE');
    table.integer('fighter_id').unsigned().index().references('fighters.id').onDelete('CASCADE');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users_fighters', function(table){
    table.dropColumn('user_id');
    table.dropColumn('fighter_id');
  })
};
