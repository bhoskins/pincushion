import Ember from 'ember';

export function initialize(/* container, application */) {
  Ember.run.scheduleOnce('afterRender', function(){
    Ember.$.material.init();
  });
}

export default {
  name: 'material',
  initialize: initialize
};
