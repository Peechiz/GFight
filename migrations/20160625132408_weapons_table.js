
exports.up = function(knex, Promise) {
  return knex.schema.createTable('weapons', function(table){
    table.increment();
    table.string('weapon');
    table.integer('strength');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('weapons');
};
