import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.store.findAll('bookmark').then(function(bookmarks) {
      return bookmarks.filter(function(bookmark) {
        var tags = bookmark.get('tags')
        if(tags) {
          return tags.contains(params.tag);
        } else {
          return false;
        }
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
