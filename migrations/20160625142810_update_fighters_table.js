
exports.up = function(knex, Promise) {
  return knex.schema.table('fighters', function(table){
    table.integer('wins');
    table.integer('losses');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('fighters', function(table){
    table.dropColumn('wins');
    table.dropColumn('losses');
  })
};
