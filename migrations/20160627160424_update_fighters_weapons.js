
exports.up = function(knex, Promise) {
  return knex.schema.table('fighters_weapons', function(table){
    table.dropColumn('fighter_id');
    table.dropColumn('weapon_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('fighters_weapons', function(table){
    table.integer('fighter_id').unsigned().index().references('fighters.id').onDelete('CASCADE');
    table.integer('weapon_id').unsigned().index().references('weapons.id').onDelete('CASCADE');
  });
};
