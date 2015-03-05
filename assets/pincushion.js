/* jshint ignore:start */

/* jshint ignore:end */

define('pincushion/adapters/bookmark', ['exports', 'ic-ajax', 'ember'], function (exports, ajax, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({
    find: function find(name, id) {
      /* jshint unused: false */
      return ajax['default']("https://api.parse.com/1/classes/Bookmark/" + id).then(function (bookmark) {
        bookmark.id = bookmark.objectId;
        delete bookmark.objectId;
        return bookmark;
      });
    },

    findAll: function findAll(name) {
      /* jshint unused: false */
      return ajax['default']("https://api.parse.com/1/classes/Bookmark").then(function (response) {
        return response.results.map(function (bookmark) {
          bookmark.id = bookmark.objectId;
          delete bookmark.objectId;
          return bookmark;
        });
      });
    },

    findQuery: function findQuery(name, query) {
      /* jshint unused: false */
      return ajax['default']("https://api.parse.com/1/classes/Bookmark", {
        data: Ember['default'].$.param({
          where: JSON.stringify(query)
        })
      }).then(function (response) {
        return response.results.map(function (bookmark) {
          bookmark.id = bookmark.objectId;
          delete bookmark.objectId;
          return bookmark;
        });
      });
    },

    destroy: function destroy(name, record) {
      /* jshint unused: false */
      return ajax['default']({
        url: "https://api.parse.com/1/classes/Bookmark/" + record.id,
        type: "DELETE"
      });
    },

    save: function save(name, record) {
      /* jshint unused: false */
      if (record.id) {
        return ajax['default']({
          url: "https://api.parse.com/1/classes/Bookmark/" + record.id,
          type: "PUT",
          data: JSON.stringify(record)
        }).then(function (response) {
          response.id = response.objectId;
          delete response.objectId;
          return response;
        });
      } else {
        return ajax['default']({
          url: "https://api.parse.com/1/classes/Bookmark",
          type: "POST",
          data: JSON.stringify(record)
        }).then(function (response) {
          record.updatedAt = response.updatedAt;
          return record;
        });
      }
    }
  });

});
define('pincushion/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'pincushion/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('pincushion/controllers/bookmark', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actions: {
      destroy: function destroy() {
        this.store.destroy("bookmark", this.get("model"));
      }
    }
  });

});
define('pincushion/controllers/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actions: {
      saveBookmark: function saveBookmark() {
        this.store.save("bookmark", this.get("model"));
        this.transitionToRoute("show", this.get("model"));
      }
    }
  });

});
define('pincushion/controllers/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    bookmarksCount: (function () {
      return this.get("model.length");
    }).property("model.@each")
  });

});
define('pincushion/initializers/app-version', ['exports', 'pincushion/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('pincushion/initializers/export-application-global', ['exports', 'ember', 'pincushion/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('pincushion/initializers/parse-tokens', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    Ember['default'].$.ajaxSetup({
      headers: {
        "X-Parse-Application-Id": "I9jp3a1SVCHn34o0rO9Synf9WhtbLKe8UO1nTMWk",
        "X-Parse-REST-API-Key": "0jPQno1FXHWw0NJ44T9SQWRwPyepNlH4QNois5Nq"
      }
    });
  }

  exports['default'] = {
    name: "parse-tokens",
    initialize: initialize
  };
  /* container, application */

});
define('pincushion/initializers/simple-auth', ['exports', 'simple-auth/configuration', 'simple-auth/setup', 'pincushion/config/environment'], function (exports, Configuration, setup, ENV) {

  'use strict';

  exports['default'] = {
    name: "simple-auth",
    initialize: function initialize(container, application) {
      Configuration['default'].load(container, ENV['default']["simple-auth"] || {});
      setup['default'](container, application);
    }
  };

});
define('pincushion/initializers/store-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject("route", "store", "service:store");
    application.inject("controller", "store", "service:store");
  }

  exports['default'] = {
    name: "store-service",
    initialize: initialize
  };

});
define('pincushion/lib/identity-map', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({
    init: function init() {
      this._map = Ember['default'].Object.create();
    },

    get: function get(type, id) {
      var typeArray = this._getType(type);
      if (id) {
        /* SINGLE RECORD */
        return typeArray.findBy("__jsim_meta_id", id);
      } else {
        /* ALL RECORDS */
        return typeArray;
      }
    },

    set: function set(type, id, record) {
      var typeArray = this._getType(type);
      var cached = typeArray.findBy("__jsim_meta_id", id);
      if (cached) {
        cached.setProperties(record);
      } else {
        var v = record instanceof Ember['default'].Object ? record : Ember['default'].Object.create(record);
        v.__jsim_meta_id = id;
        typeArray.addObject(v);
      }
    },

    remove: function remove(type, record) {
      var typeArray = this._getType(type);
      if (typeof record !== "object") {
        // assume it's an id
        record = typeArray.findBy("__jsim_meta_id", record);
      }
      typeArray.removeObject(record);
    },

    clear: function clear(type) {
      var typeArray = this._getType(type);
      typeArray.splice(0, typeArray.length);
    },

    _getType: function _getType(type) {
      var typeArray = this._map.get(type);
      if (!typeArray) {
        this._map.set(type, Ember['default'].A());
        typeArray = this._map.get(type);
      }
      return typeArray;
    }
  });

});
define('pincushion/router', ['exports', 'ember', 'pincushion/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route("show", { path: "/show/:bookmark_id" });
    this.route("new");
    this.route("edit", { path: "/edit/:bookmark_id" });

    this.route("tags", function () {
      this.route("show", { path: "/:tag" });
    });
  });

  exports['default'] = Router;

});
define('pincushion/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actions: {
      showNewBookmark: function showNewBookmark() {
        this.transitionTo("new");
      }
    }
  });

});
define('pincushion/routes/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pincushion/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll("bookmark");
    } });

});
define('pincushion/routes/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return {};
    },

    actions: {
      createBookmark: function createBookmark() {
        var self = this;
        this.store.save("bookmark", this.modelFor("new")).then(function () {
          self.transitionTo("index");
        });
      }
    }
  });

});
define('pincushion/routes/show', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('pincushion/routes/tags/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findQuery("bookmark", {
        tags: params.tag
      });
    },

    renderTemplate: function renderTemplate(controller, model) {
      this.render("index", {
        into: "application",
        model: model
      });
    }
  });

});
define('pincushion/services/store', ['exports', 'ember', 'pincushion/lib/identity-map'], function (exports, Ember, IdentityMap) {

  'use strict';

  var identityMap = IdentityMap['default'].create();

  exports['default'] = Ember['default'].Object.extend({
    find: function find(name, id) {

      var cached = identityMap.get(name, id);
      if (cached) {
        return Ember['default'].RSVP.resolve(cached);
      }

      var adapter = this.container.lookup("adapter:" + name);
      return adapter.find(name, id).then(function (record) {
        identityMap.set(name, id, record);
        return record;
      });
    },

    findAll: function findAll(name) {
      var adapter = this.container.lookup("adapter:" + name);
      return adapter.findAll(name).then(function (records) {
        identityMap.clear(name);
        records.forEach(function (r) {
          identityMap.set(name, r.id, r);
        });

        return identityMap.get(name);
      });
    },

    findQuery: function findQuery(name, query) {
      var adapter = this.container.lookup("adapter:" + name);
      return adapter.findQuery(name, query);
    },

    destroy: function destroy(name, record) {
      var adapter = this.container.lookup("adapter:" + name);
      return adapter.destroy(name, record).then(function () {
        identityMap.remove(name, record);
      });
    },

    save: function save(name, record) {
      var adapter = this.container.lookup("adapter:" + name);
      return adapter.save(name, record).then(function () {
        identityMap.set(name, record.id, record);
        return record;
      });
    }
  });

});
define('pincushion/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("+");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var morph0 = dom.createMorphAt(fragment,1,2,contextualElement);
        var morph1 = dom.createMorphAt(fragment,2,3,contextualElement);
        element(env, element0, context, "action", ["showNewBookmark"], {});
        content(env, morph0, context, "outlet");
        inline(env, morph1, context, "outlet", ["newBookmark"], {});
        return fragment;
      }
    };
  }()));

});
define('pincushion/templates/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,0,1);
        element(env, element0, context, "action", ["saveBookmark"], {"on": "submit"});
        inline(env, morph0, context, "input", [], {"type": "text", "value": get(env, context, "model.url"), "placeholder": "URL"});
        return fragment;
      }
    };
  }()));

});
define('pincushion/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          var el3 = dom.createTextNode("X");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [2]);
          var morph0 = dom.createMorphAt(element0,0,1);
          inline(env, morph0, context, "link-to", [get(env, context, "bookmark.model.url"), "show", get(env, context, "bookmark")], {});
          element(env, element1, context, "action", ["destroy"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2]),0,-1);
        content(env, morph0, context, "bookmarksCount");
        block(env, morph1, context, "each", [get(env, context, "model")], {"itemController": "bookmark", "keyword": "bookmark"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('pincushion/templates/new', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("New Bookmark");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,2,3);
        element(env, element0, context, "action", ["createBookmark"], {"on": "submit"});
        inline(env, morph0, context, "input", [], {"type": "text", "value": get(env, context, "model.url"), "placeholder": "URL"});
        return fragment;
      }
    };
  }()));

});
define('pincushion/templates/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "link-to", [get(env, context, "tag"), "tags.show", get(env, context, "tag")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
        var morph2 = dom.createMorphAt(fragment,2,3,contextualElement);
        var morph3 = dom.createMorphAt(fragment,3,4,contextualElement);
        inline(env, morph0, context, "link-to", ["Back", "index"], {});
        content(env, morph1, context, "model.url");
        block(env, morph2, context, "each", [get(env, context, "model.tags")], {"keyword": "tag"}, child0, null);
        inline(env, morph3, context, "link-to", ["Edit", "edit", get(env, context, "model")], {});
        return fragment;
      }
    };
  }()));

});
define('pincushion/tests/adapters/bookmark.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/bookmark.js should pass jshint', function() { 
    ok(true, 'adapters/bookmark.js should pass jshint.'); 
  });

});
define('pincushion/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('pincushion/tests/controllers/bookmark.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/bookmark.js should pass jshint', function() { 
    ok(true, 'controllers/bookmark.js should pass jshint.'); 
  });

});
define('pincushion/tests/controllers/edit.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/edit.js should pass jshint', function() { 
    ok(true, 'controllers/edit.js should pass jshint.'); 
  });

});
define('pincushion/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('pincushion/tests/helpers/resolver', ['exports', 'ember/resolver', 'pincushion/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('pincushion/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('pincushion/tests/helpers/start-app', ['exports', 'ember', 'pincushion/app', 'pincushion/router', 'pincushion/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('pincushion/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('pincushion/tests/initializers/parse-tokens.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/parse-tokens.js should pass jshint', function() { 
    ok(true, 'initializers/parse-tokens.js should pass jshint.'); 
  });

});
define('pincushion/tests/initializers/store-service.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/store-service.js should pass jshint', function() { 
    ok(true, 'initializers/store-service.js should pass jshint.'); 
  });

});
define('pincushion/tests/lib/identity-map.jshint', function () {

  'use strict';

  module('JSHint - lib');
  test('lib/identity-map.js should pass jshint', function() { 
    ok(true, 'lib/identity-map.js should pass jshint.'); 
  });

});
define('pincushion/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('pincushion/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('pincushion/tests/routes/edit.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/edit.js should pass jshint', function() { 
    ok(true, 'routes/edit.js should pass jshint.'); 
  });

});
define('pincushion/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('pincushion/tests/routes/new.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/new.js should pass jshint', function() { 
    ok(true, 'routes/new.js should pass jshint.'); 
  });

});
define('pincushion/tests/routes/show.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/show.js should pass jshint', function() { 
    ok(true, 'routes/show.js should pass jshint.'); 
  });

});
define('pincushion/tests/routes/tags/show.jshint', function () {

  'use strict';

  module('JSHint - routes/tags');
  test('routes/tags/show.js should pass jshint', function() { 
    ok(true, 'routes/tags/show.js should pass jshint.'); 
  });

});
define('pincushion/tests/services/store.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/store.js should pass jshint', function() { 
    ok(true, 'services/store.js should pass jshint.'); 
  });

});
define('pincushion/tests/test-helper', ['pincushion/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('pincushion/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/adapters/bookmark-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:bookmark", "BookmarkAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('pincushion/tests/unit/adapters/bookmark-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/bookmark-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/bookmark-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/controllers/bookmark-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:bookmark", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/controllers/bookmark-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/bookmark-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/bookmark-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/controllers/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:edit", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/controllers/edit-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/edit-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/edit-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/controllers/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:index", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/controllers/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/index-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/index-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/initializers/parse-tokens-test', ['ember', 'pincushion/initializers/parse-tokens', 'qunit'], function (Ember, parse_tokens, qunit) {

  'use strict';

  var container, application;

  qunit.module("ParseTokensInitializer", {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        container = application.__container__;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test("it works", function (assert) {
    parse_tokens.initialize(container, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('pincushion/tests/unit/initializers/parse-tokens-test.jshint', function () {

  'use strict';

  module('JSHint - unit/initializers');
  test('unit/initializers/parse-tokens-test.js should pass jshint', function() { 
    ok(true, 'unit/initializers/parse-tokens-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/models/identity-map-test', ['ember-qunit', 'ember'], function (ember_qunit, Ember) {

  'use strict';

  var map;

  ember_qunit.moduleFor("model:identity-map", {
    needs: []
  });

  ember_qunit.test("getting a non present id", function (assert) {
    assert.ok(!this.subject().get("type", "someid"));
  });

  ember_qunit.test("getting a present id", function (assert) {
    var thing = {};
    this.subject().set("type", "someid", thing);
    assert.ok(this.subject().get("type", "someid"));
  });

  ember_qunit.test("getting an empty type is empty", function (assert) {
    var typeArray = this.subject().get("type");
    assert.ok(Ember['default'].isArray(typeArray));
    assert.strictEqual(typeArray.length, 0);
  });

  ember_qunit.test("getting an non empty type is non empty", function (assert) {
    var typeArrayA = this.subject().get("type");

    var thing = {};
    this.subject().set("type", "someid", thing);

    var typeArrayB = this.subject().get("type");

    assert.strictEqual(typeArrayA, typeArrayB);
    assert.strictEqual(typeArrayA.get("firstObject"), typeArrayB.get("firstObject"));
    assert.strictEqual(typeArrayA.length, 1);
    assert.strictEqual(typeArrayB.length, 1);
  });

  ember_qunit.test("setting an id should update that id if it already exists", function (assert) {
    var thing = {};
    this.subject().set("type", "someid", thing);

    var resultA = this.subject().get("type", "someid");

    var otherThing = { name: "thing" };
    this.subject().set("type", "someid", otherThing);

    var resultB = this.subject().get("type", "someid");

    assert.strictEqual(resultA, resultB);
    assert.strictEqual(resultA.get("name"), "thing");
  });

  ember_qunit.test("create Ember.Object if not already", function (assert) {
    var thing = {};
    this.subject().set("type", "someid", thing);
    assert.ok(this.subject().get("type", "someid") instanceof Ember['default'].Object);

    var object = Ember['default'].Object.create();
    this.subject().set("type", "otherid", object);
    assert.strictEqual(this.subject().get("type", "otherid"), object);
  });

  ember_qunit.test("removing a record", function (assert) {
    this.subject().set("type", "someid", {});
    var thing = this.subject().get("type", "someid");
    this.subject().remove("type", thing);

    assert.ok(!this.subject().get("type", "someid"));

    var typeArray = this.subject().get("type");
    assert.equal(typeArray.length, 0);
  });

  ember_qunit.test("removing an id", function (assert) {
    this.subject().set("type", "someid", {});
    var thing = this.subject().get("type", "someid");
    this.subject().remove("type", "someid");

    assert.ok(!this.subject().get("type", "someid"));

    var typeArray = this.subject().get("type");
    assert.equal(typeArray.length, 0);
  });

  ember_qunit.test("clearing a type", function (assert) {
    this.subject().set("type", "someid", {});
    var typeArray = this.subject().get("type");

    assert.equal(typeArray.length, 1);
    this.subject().clear("type");
    assert.equal(typeArray.length, 0);
  });

});
define('pincushion/tests/unit/models/identity-map-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/identity-map-test.js should pass jshint', function() { 
    ok(true, 'unit/models/identity-map-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/routes/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:application", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/application-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/application-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/routes/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:edit", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/routes/edit-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/edit-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/edit-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:index", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/routes/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:new", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/routes/new-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/new-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/new-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/routes/show-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:show", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/routes/show-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/show-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/show-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/routes/tags/show-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:tags/show", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('pincushion/tests/unit/routes/tags/show-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/tags');
  test('unit/routes/tags/show-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/tags/show-test.js should pass jshint.'); 
  });

});
define('pincushion/tests/unit/services/store-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("service:store", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

  // Specify the other units that are required for this test.
  // needs: ['service:foo']

});
define('pincushion/tests/unit/services/store-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/store-test.js should pass jshint', function() { 
    ok(true, 'unit/services/store-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('pincushion/config/environment', ['ember'], function(Ember) {
  var prefix = 'pincushion';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("pincushion/tests/test-helper");
} else {
  require("pincushion/app")["default"].create({"name":"pincushion","version":"0.0.0.4e7f6fe7"});
}

/* jshint ignore:end */
//# sourceMappingURL=pincushion.map