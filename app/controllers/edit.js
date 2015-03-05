import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    saveBookmark: function(){
      this.store.save('bookmark', this.get('model'));
      this.transitionToRoute('show', this.get('model'));
    }
  }
});
