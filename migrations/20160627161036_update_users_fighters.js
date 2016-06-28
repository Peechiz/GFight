
exports.up = function(knex, Promise) {
  return knex.schema.table('users_fighers', function(table){
    table.dropColumn('user_id');
    table.dropColumn('fighter_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users_fighers', function(table){
    table.integer('user_id').unsigned().index().references('users.id').onDelete('CASCADE');
    table.integer('fighter_id').unsigned().index().references('fighters.id').onDelete('CASCADE');
  })
};
