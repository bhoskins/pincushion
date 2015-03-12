import Ember from 'ember';

export default Ember.Object.extend({
  destroy: function(){
    this.store.destroy('user', this);
  },

  save: function(){
    this.store.save('user', this);
  },

  toJSON: function(){
    console.log('User#toJSON');
    return this;
  }
});
