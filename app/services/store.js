import Ember from 'ember';

export default Ember.Object.extend({
  find: function(name, id){
    // lookup the adapter for the name I'm passing you
    var adapter = this.container.lookup('adapter:' + name);
    return adapter.find(name, id);
  },

  findAll: function(name){
    // lookup the adapter for the name I'm passing you
    var adapter = this.container.lookup('adapter:' + name);
    return adapter.findAll(name);
  }
});
