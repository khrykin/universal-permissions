'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @module universal-permissons
*/

/** Permissions Class - produce instance of permissions object. */

var Permissions =
/**
  * Create permissions.
  * @param {object} definitions - Object of shape: `{ type: { action: definition, ... }, ... }``
  * @return {object} permissions - Instance with can, set and remove methods, working with given definitions;
  */

function Permissions(definitions) {
  var _this = this;

  _classCallCheck(this, Permissions);

  this.can = function (viewer, action, map) {
    if ((typeof viewer === 'undefined' ? 'undefined' : _typeof(viewer)) !== 'object' && typeof viewer !== 'null' && typeof viewer !== 'undefined') {
      throw new TypeError('First argument must be an object, null, or undefined, but got ' + (typeof viewer === 'undefined' ? 'undefined' : _typeof(viewer)));
    } else if (typeof action !== 'string') {
      throw new TypeError('Second argument must be a string, but got ' + (typeof action === 'undefined' ? 'undefined' : _typeof(action)));
    } else if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object' && typeof map !== 'string') {
      throw new TypeError('Last argument must be an object or a string , but got ' + (typeof map === 'undefined' ? 'undefined' : _typeof(map)));
    } else if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) === 'object' && Object.keys(map).length !== 1) {
      throw new Error('Last argument must have exactly one property');
    };

    var type = (typeof map === 'undefined' ? 'undefined' : _typeof(map)) === 'object' ? Object.keys(map)[0] : map;

    if (!_this._getPermissionType(type)) {
      throw new Error('Unknown permission type ' + type + '. Check _permissions definitions');
    };

    var can = _this._getPermission(type, action);
    if (typeof can === 'function') {
      var entity = (typeof map === 'undefined' ? 'undefined' : _typeof(map)) === 'object' ? map[type] : null;
      return can(viewer, entity) ? true : false;
    }
    return can ? true : false;
  };

  this.set = function (type, actions, def) {
    if (typeof type !== 'string') {
      throw new TypeError('First Argument must be a string, but got ' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)));
    } else if (typeof actions === 'string') {
      _this._setPermission(type, actions, def);
    } else if (actions instanceof Array) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var action = _step.value;

          _this._setPermission(type, action, def);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      throw new TypeError('Second Argument must be a string or an array, but got ' + (typeof actions === 'undefined' ? 'undefined' : _typeof(actions)));
    }
  };

  this.remove = function (type, actions) {
    if (typeof type !== 'string') {
      throw new TypeError('First Argument must be a string, but got ' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)));
    } else if (typeof actions === 'string') {
      _this._removePermission(type, actions);
    } else if (actions instanceof Array) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = actions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var action = _step2.value;

          _this._removePermission(type, action);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    } else {
      throw new TypeError('Second Argument must be a string or an array, but got ' + (typeof actions === 'undefined' ? 'undefined' : _typeof(actions)));
    }
  };

  var _permissions = definitions || {};

  this._getPermissionType = function (type) {
    return _permissions[type];
  };

  this._getPermission = function (type, action) {
    return _permissions[type][action];
  };

  this._setPermission = function (type, action, def) {
    if (_typeof(_permissions[type]) !== 'object') {
      _permissions[type] = {};
    }
    _permissions[type][action] = def;
  };

  this._removePermission = function (type, action, def) {
    if (!_permissions[type]) {
      throw new Error('Unknown permission type ' + type);
    }
    delete _permissions[type][action];
  };
}

/**
  * Checks if viewer can perform an action on given object of given type
  * @param {object} viewer - User object
  * @param {string} action - Action to check permission on
  * @param {object|string} map|type - Object of shape { type: entity } or type string. Example: { post: { id: 1 } } or 'post'.
  * @return {boolean}
  */

/**
  * Sets definition on given action(s) for given type
  * @param {string} type - Entity type
  * @param {string|array} action|actions - Action(s) to set definition on
  * @param {function|any} definition
  */

/**
  * Removes definition from given action(s) for given type
  * @param {string} type - Entity type
  * @param {string|array} action|actions - Action(s) to remove definition from
  */

;

exports.default = Permissions;