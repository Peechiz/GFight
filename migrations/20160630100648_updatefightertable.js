
exports.up = function(knex, Promise) {
  return knex.schema.table('fighters', function(table){
    table.integer('weapon_id').unsigned().index().references('weapons.id').onDelete('CASCADE');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('fighters', function(table){
    table.dropColumn('weapon_id');
  })
};
