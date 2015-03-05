import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.store.findQuery('bookmark', {
      'tags': params.tag
    });
  },

  renderTemplate: function(controller, model){
    this.render('index', {
      into: 'application',
      model: model
    });
  }
});
