import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('show', { path: '/show/:bookmark_id' });
  this.route('new');
  this.route('edit', { path: '/edit/:bookmark_id' });

  this.route('tags', function() {
    this.route('show', { path: '/:tag' });
  });
  this.route('login');
});

export default Router;
