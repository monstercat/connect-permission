
# connect-permission

  Forbids entry to requests if a permission is not found in an object

## Installation

  Install with npm

    $ npm install connect-permission

## Example

```js
var permission = require('connect-permission');
var access = permission.bind(null, get);
access.some = permission.some.bind(null, get);

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

var obj = { contract: { view: false, edit: true } }
app.use(user(obj));

app.get('/contract', access('contract.view'), function(req, res){
  // success!
});

var perms = ['contract.view', 'contract.edit'];
app.post('/contract', access.some(perms), function(req, res){
  // this will be forbidden
});
```


## License

  The MIT License (MIT)

  Copyright (c) 2014 William Casarin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.