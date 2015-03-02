import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('show', { path: '/show/:bookmark_id' });

  this.route('tags', function() {
    this.route('show', { path: '/:tag' });
  });
});

export default Router;
