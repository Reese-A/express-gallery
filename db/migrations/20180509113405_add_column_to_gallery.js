
exports.up = function(knex, Promise) {
  return knex.schema.table('gallery', (table) =>{
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('gallery', (table) =>{
    table.dropColumn('user_id');
  })
};