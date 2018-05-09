
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) =>{
    table.increments();
    table.string('username', 20).notNullable().unique();
    table.string('password', 20).notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
