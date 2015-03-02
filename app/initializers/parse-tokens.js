import Ember from 'ember';

export function initialize(/* container, application */) {
  Ember.$.ajaxSetup({
    headers: {
      "X-Parse-Application-Id": "I9jp3a1SVCHn34o0rO9Synf9WhtbLKe8UO1nTMWk",
      "X-Parse-REST-API-Key": "0jPQno1FXHWw0NJ44T9SQWRwPyepNlH4QNois5Nq"
    }
  });
}

export default {
  name: 'parse-tokens',
  initialize: initialize
};
