
exports.up = function(knex, Promise) {
  return knex.schema.createTable('fighters_weapons', function(table){
    table.increments();
    table.integer('fighter_id').unsigned().index().references('fighters.id').onDelete('CASCADE');
    table.integer('weapon_id').unsigned().index().references('weapons.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('fighters_weapons');
};
