import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('bookmark');
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
