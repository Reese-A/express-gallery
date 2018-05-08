
exports.up = function(knex, Promise) {
  return knex.schema.createTable('gallery', (table) =>{
    table.increments();
    table.string('author', 50).notNullable();
    table.string('link', 255).notNullable();
    table.text('description').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gallery');
};
