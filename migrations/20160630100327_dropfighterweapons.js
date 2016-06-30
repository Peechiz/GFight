
exports.up = function(knex, Promise) {
  return knex.schema.dropTable('fighters_weapons');
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('fighters_weapons');
};
