const bookshelf = require('./bookshelf');


class Gallery extends bookshelf.Model{
  get tableName(){return 'gallery'}
  get hasTimestamps(){return true}

  user() {
    return this.belongsTo('User', 'user_id')
  }

}

module.exports = bookshelf.model('Gallery', Gallery);