
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', (table) =>{
    table.string('password', 255).alter();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', (table) =>{
    table.string('password', 20).alter();
  })
};
