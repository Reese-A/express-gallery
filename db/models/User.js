const bookshelf = require('./bookshelf');
// const Gallery = require('./Gallery');

class User extends bookshelf.Model{
  get tableName(){return 'users'}
  get hasTimestamps(){return true}

  gallery() {
    return this.hasMany('Gallery', 'user_id')
  }
}

module.exports = bookshelf.model('User', User)