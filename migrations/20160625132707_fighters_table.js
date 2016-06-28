
exports.up = function(knex, Promise) {
  return knex.schema.createTable('fighters', function(table){
    table.increments();
    table.string('slack_name');
    table.integer('wins');
    table.integer('losses');
    table.string('img_url');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('fighters');
};
