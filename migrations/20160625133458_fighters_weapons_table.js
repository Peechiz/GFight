
exports.up = function(knex, Promise) {
  return knex.schema.createTable('fighters_weapons', function(table){
    table.integer('weapon_id').unsigned().index().references('weapons.id');
    table.integer('fighter_id').unsigned().index().references('fighters.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('fighters_weapons');
};
