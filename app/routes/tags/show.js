import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.store.findAll('bookmark').then(function(bookmarks) {
      return bookmarks.filter(function(bookmark) {
        return bookmark.get('tags').contains(params.tag);
      });
    });
  },

  renderTemplate: function(controller, model){
    this.render('index', {
      into: 'application',
      model: model
    });
  }
});
