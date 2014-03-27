
var assert = require('better-assert')
var request = require('supertest')
var express = require('express')
var ap = require('ap-component')
var permissions = require('..');

var access = permissions.bind(null, get);
access.some = permissions.some.bind(null, get);

describe('permission middleware', function(){
  var app;

  beforeEach(function(){
    app = express();
    app.set('env', 'test');
  });

  it('403s on missing permission', function(done){
    var obj = { contract: { view: false } }
    app.use(user(obj));
    app.get('/contract', access('contract.view'));

    request(app)
      .get('/contract')
      .expect(403, done)
  });

  it('403s on missing all permissions', function(done){
    var obj = { contract: { view: false, edit: true } }
    var perms = ['contract.view', 'contract.edit'];
    app.use(user(obj));
    app.get('/contract', access(perms));

    request(app)
      .get('/contract')
      .expect(403, done)
  });

  it('200s on having some permissions', function(done){
    var obj = { contract: { view: false, edit: true } }
    var perms = ['contract.view', 'contract.edit'];
    app.use(user(obj));
    app.get('/contract', access.some(perms), function(req, res){
      res.send(200);
    });

    request(app)
      .get('/contract')
      .expect(200, done)
  });

  it('doesnt crash when permission not in dict', function(done){
    var obj = { contract: { view: false } }
    var perms = ['contract.view', 'contract.edit'];
    app.use(user(obj));
    app.get('/contract', access.some(perms));

    request(app)
      .get('/contract')
      .expect(403, done)
  });

});

function user(obj) {
  return function(req, res, next){
    req.user = {};
    req.user.permissions = obj;
    next();
  };
}

function get(req) {
  return req.user.permissions;
}
