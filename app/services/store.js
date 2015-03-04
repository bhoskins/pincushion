import Ember from 'ember';
import IdentityMap from '../models/identity-map';

var identityMap = IdentityMap.create();

export default Ember.Object.extend({
  find: function(name, id){

    var cached = identityMap.get(name, id);
    if(cached) { return cached; }

    // lookup the adapter for the name I'm passing you
    var adapter = this.container.lookup('adapter:' + name);
    return adapter.find(name, id).then(function(record) {
      identityMap.set(name, id, record);
      return record;
    });
  },

  findAll: function(name){
    // lookup the adapter for the name I'm passing you
    var adapter = this.container.lookup('adapter:' + name);
    adapter.findAll(name).then(function(records) {
      records.forEach(function(r) {
        identityMap.set(name, r.id, r);
      });
    });

    var cached = identityMap.get(name);
    return Ember.RSVP.resolve(cached);
  }
});
