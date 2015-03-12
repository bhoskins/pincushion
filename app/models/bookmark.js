import Ember from 'ember';

export default Ember.Object.extend({
  toJSON: function(){
    return this;
  }
});
