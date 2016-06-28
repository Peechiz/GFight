
exports.up = function(knex, Promise) {
  return knex.schema.table('fighters', function(table){
    table.dropColumn('user_id');
    table.dropColumn('weapon_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('fighters', function(table){
    table.integer('user_id').unsigned().index().references('users.id').onDelete('CASCADE');
    table.integer('weapon_id').unsigned().index().references('weapons.id').onDelete('CASCADE');
  })
};
