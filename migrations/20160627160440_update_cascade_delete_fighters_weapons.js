
exports.up = function(knex, Promise) {
  return knex.schema.table('fighters_weapons', function(table){
    table.increments();
    table.integer('fighter_id').unsigned().index().references('fighters.id').onDelete('CASCADE');
    table.integer('weapon_id').unsigned().index().references('weapons.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('fighters_weapons', function(table){
    table.dropColumn('fighter_id');
    table.dropColumn('weapon_id');
  });
};
