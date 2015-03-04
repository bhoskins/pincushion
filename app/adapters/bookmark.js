import ajax from 'ic-ajax';
import Ember from 'ember';

// TODO: reverse id -> objectId for POST/PUT

export default Ember.Object.extend({
  find: function(name, id){
    /* jshint unused: false */
    return ajax("https://api.parse.com/1/classes/Bookmark/" + id).then(function(bookmark){
      bookmark.id = bookmark.objectId;
      delete bookmark.objectId;
      return bookmark;
    });
  },

  findAll: function(name) {
    /* jshint unused: false */
    return ajax("https://api.parse.com/1/classes/Bookmark").then(function(response){
      return response.results.map(function(bookmark) {
        bookmark.id = bookmark.objectId;
        delete bookmark.objectId;
        return bookmark;
      });
    });
  },

  createRecord: null,
  deleteRecord: null,
  saveRecord: null

});
