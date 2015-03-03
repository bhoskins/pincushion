import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    showNewBookmark: function(){
      this.render('new', {
        into: 'application',
        outlet: 'newBookmark'
      });
    }
  }
});
