
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increment();
    table.string('username');
    table.string('full_name');
    table.integer('wins');
    table.integer('losses');
    table.integer('money');
    table.string('avatar_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
