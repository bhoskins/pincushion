import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('bookmark', {
      createdBy: this.get('session.currentUser')
    });
  },

  actions: {
    createBookmark: function(){
      this.modelFor('new').save().then(function() {
        this.transitionTo('index');
      }.bind(this));
    }
  }
});
