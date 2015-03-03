import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.RSVP.hash({
      bookmarks: this.store.findAll('bookmark'),
      users: Ember.RSVP.resolve([])
    });
  },

  setupController: function(controller, model){
    controller.set('model', model.bookmarks);
    controller.set('users', model.users);
  }
});
