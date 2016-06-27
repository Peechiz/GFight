
exports.up = function(knex, Promise) {
  return knex.schema.createTable('fighters', function(table){
    table.increments();
    table.string('slack_name');
    table.integer('user_id').unsigned().index().references('users.id');
    table.integer('weapon_id').unsigned().index().references('weapons.id');
    table.string('img_url');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('fighters');
};
