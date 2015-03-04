import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return {};
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
