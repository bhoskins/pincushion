import {
  moduleFor,
  test
} from 'ember-qunit';

import Ember from 'ember';

var map;

moduleFor('model:identity-map', {
  needs: []
});

test('getting a non present id', function(assert) {
  assert.ok(!this.subject().get('type', 'someid'));
});

test('getting a present id', function(assert) {
  var thing = {};
  this.subject().set('type', 'someid', thing);
  assert.ok(this.subject().get('type', 'someid'));
});

test('getting an empty type is empty', function(assert) {
  var typeArray = this.subject().get('type');
  assert.ok(Ember.isArray(typeArray));
  assert.equal(typeArray.length, 0);
});

test('getting an non empty type is non empty', function(assert) {
  var typeArrayA = this.subject().get('type');

  var thing = {};
  this.subject().set('type', 'someid', thing);

  var typeArrayB = this.subject().get('type');

  assert.equal( typeArrayA, typeArrayB );
  assert.equal( typeArrayA.get('firstObject'), typeArrayB.get('firstObject') );
  assert.equal( typeArrayA.length, 1 );
  assert.equal( typeArrayB.length, 1 );
});

test('setting an id should update that id if it already exists', function(assert) {
  var thing = {};
  this.subject().set('type', 'someid', thing);

  var resultA = this.subject().get('type', 'someid');

  var otherThing = {name: 'thing'};
  this.subject().set('type', 'someid', otherThing);

  var resultB = this.subject().get('type', 'someid');

  assert.equal(resultA, resultB);
  assert.equal(resultA.get('name'), 'thing');

});

test('create Ember.Object if not already', function(assert) {
  var thing = {};
  this.subject().set('type', 'someid', thing);
  assert.ok(this.subject().get('type', 'someid') instanceof(Ember.Object) );

  var object = Ember.Object.create();
  this.subject().set('type', 'otherid', object);
  assert.equal(this.subject().get('type', 'otherid'), object);
});
