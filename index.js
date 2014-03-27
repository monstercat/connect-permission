
var dot = require('dot-component');
var ap = require('ap-component');

function Permission(obj, permissions) {
  if (!(this instanceof Permission)) return new Permission(obj, permissions);
  this.obj = obj;
  this.permissions = permissions;
}

var exports = module.exports = Permission;

/**
 * If predicate `pred(obj, permissions)` doesn't match, return forbidden
 *
 * @param {Function} pred
 * @api public
 */
Permission.prototype.generic = function(pred) {
  var self = this;
  return function(req, res, next) {
    var obj = ap(self.obj, req);
    var permissions = listify(ap(self.permissions, req));

    if (!pred(obj, permissions, req)) {
      res.statusCode = 403;
      return next(new Error("No permission for " + permissions.join(", ")));
    }

    return next();
  }
}

Permission.prototype.some = 
Permission.prototype.any = function() {
  return this.generic(exports.checkAny);
}

Permission.prototype.every = 
Permission.prototype.all = function() {
  return this.generic(exports.checkAll);
}

exports.checkAny = function(obj, permissions) {
  return permissions.some(function(permission){
    return exports.has(obj, permission);
  });
}

exports.checkAll = function(obj, permissions) {
  return permissions.every(function(permission){
    return exports.has(obj, permission);
  });
}

exports.has = function(obj, permission) {
  return dot.get(obj, permission) === true;
}

/**
 * listify :: Either a [a] -> [a]
 */
function listify(items){
  var array = Array.isArray(items);
  return array? items : items? [items] : null;
};

