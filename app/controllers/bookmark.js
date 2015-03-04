import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    destroy: function(){
      this.store.destroy('bookmark', this.get('model'));
    }
  }
});
