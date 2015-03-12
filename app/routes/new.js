import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('bookmark', {
      createdBy: this.get('session.currentUser')
    });
  },

  actions: {
    createBookmark: function(){
      var self = this;
      this.store.save('bookmark', this.modelFor('new')).then(function(){
        self.transitionTo('index');
      });
    }
  }
});
