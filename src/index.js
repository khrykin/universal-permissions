/**
* @module universal-permissons
*/

/** Permissions Class - produce instance of permissions object. */

export default class Permissions {
  /**
    * Create permissions.
    * @param {object} definitions - Object of shape: `{ type: { action: definition, ... }, ... }``
    * @return {object} permissions - Instance with can, set and remove methods, working with given definitions;
    */

  constructor(definitions) {
    let _permissions = definitions || {};

    this._getPermissionType = (type) => {
      return _permissions[type];
    };

    this._getPermission = (type, action) => {
      return _permissions[type][action];
    };

    this._setPermission = (type, action, def) => {
      if (typeof _permissions[type] !== 'object') {
         _permissions[type] = {};
       }
      _permissions[type][action] = def;
    };

    this._removePermission = (type, action, def) => {
      if (!_permissions[type]) {
        throw new Error(`Unknown permission type ${type}`)
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

  can = (viewer, action, map ) => {
    if (
         typeof viewer !== 'object'
      && typeof viewer !== 'null'
      && typeof viewer !== 'undefined'
    ) {
      throw new TypeError(
        `First argument must be an object, null, or undefined, but got ${typeof viewer}`
      );
    } else if ( typeof action !== 'string' ) {
      throw new TypeError(
        `Second argument must be a string, but got ${typeof action}`
      );
    } else if (typeof map !== 'object' && typeof map !== 'string' ) {
      throw new TypeError(`Last argument must be an object or a string , but got ${typeof map}`);
    } else if (typeof map === 'object' && Object.keys(map).length !== 1) {
      throw new Error(`Last argument must have exactly one property`);
    };


    const type = typeof map === 'object' ? Object.keys(map)[0] : map;

    if (!this._getPermissionType(type)) {
      throw new Error(`Unknown permission type ${type}. Check _permissions definitions`);
    };

    const can = this._getPermission(type, action);
    if (typeof can === 'function') {
      const entity = typeof map === 'object' ? map[type] : null;
      return can(viewer, entity) ? true : false;
    }
    return can ? true : false;
  };

  /**
    * Sets definition on given action(s) for given type
    * @param {string} type - Entity type
    * @param {string|array} action|actions - Action(s) to set definition on
    * @param {function|any} definition
    */


  set = (type, actions, def) => {
    if (typeof type !== 'string') {
      throw new TypeError(`First Argument must be a string, but got ${typeof type}`);
    } else if (typeof actions === 'string') {
      this._setPermission(type, actions, def);
    } else if (actions instanceof Array) {
      for (let action of actions) {
        this._setPermission(type, action, def);
      }
    } else {
      throw new TypeError(`Second Argument must be a string or an array, but got ${typeof actions}`);
    }
  };

  /**
    * Removes definition from given action(s) for given type
    * @param {string} type - Entity type
    * @param {string|array} action|actions - Action(s) to remove definition from
    */

  remove = (type, actions) => {
    if (typeof type !== 'string') {
      throw new TypeError(`First Argument must be a string, but got ${typeof type}`);
    } else if (typeof actions === 'string') {
      this._removePermission(type, actions);
    } else if (actions instanceof Array) {
      for (let action of actions) {
        this._removePermission(type, action);
      }
    } else {
      throw new TypeError(`Second Argument must be a string or an array, but got ${typeof actions}`);
    }
  };
}
