import Ember from 'ember';

export default Ember.Object.extend({
  destroy: function(){
    this.store.destroy('bookmark', this);
  },

  save: function(){
    this.store.save('bookmark', this);
  },

  toJSON: function(){
    console.log('Bookmark#toJSON');
    return this;
  }
});
