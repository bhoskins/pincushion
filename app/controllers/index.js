import Ember from 'ember';

export default Ember.Controller.extend({
  bookmarksCount: function(){
    return this.get('model.length');
  }.property('model.@each')
});
