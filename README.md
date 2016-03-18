[![Travis](https://img.shields.io/travis/khrykin/universal-permissions.svg)](https://travis-ci.org/khrykin/universal-permissions)
[![npm](https://img.shields.io/npm/v/universal-permissions.svg)](https://www.npmjs.com/package/universal-permissions)
![npm](https://img.shields.io/npm/dm/universal-permissions.svg)

# Universal Permissions
 Super easy to use javascript `can`-style permission management library. Not relying on prototypes — share same permissions across client and server.

## Usage

 ```javascript
 /* permissions.js */

 import Permissions from 'universal-permissons'
 import * as definitions from './definitions'

 export const { can, set, remove } = new Permissions(definitions);
 ```

## Definitions
Definitions can be passed inside an object to `Permissions` constructor, or/and can be set/removed dynamically.

For example, you can use a separate module with multiple exports, and then import it as shown above:

 ```javascript
/* definitions.js */

 export const post = {
   edit: (viewer, post) => (
     viewer.id === post.authorId
   ),
   see: true
 };

 export const comment = {
   edit: (viewer, comment) => (
     viewer.id === comment.authorId && !comment.blocked
   ),
   delete: comment.edit,
   create: (viewer) => viewer.id
 };

 ```
 Here exported objects correspond to permission `type`, keys such as 'edit', 'delete', etc. correspond to permission `action`, and properties correspond to permission `definition`.

 As you can see, definition can be of any type, but if it's a function, it will recieve `viewer`, and `entity` objects as params.
Make sure to always return something from functional definition, otherwise action will be always unpermitted.

 For some reason, you may want to set/delete/replace definitions during runtime:

 ```javascript
import { set, remove } from './permissions'

set('comment', 'like', (viewer) => viewer.id );

set('post', ['edit', 'delete'], (viewer, post) => (
  viewer.id === post.authorId && !post.protected
)); // 'edit' replaced

remove('comment', 'create');

 ```

## `can`
 Then anywhere you want, you can find out whether you can perform an action on given object calling `can`:

 ```javascript
import { can } from './permissions'

const viewer = { id: 1 };
const comment = { authorId: 1, text: 'Hello' };

can(viewer, 'edit', { comment })     // true
can({ id: 2 }, 'edit', { comment })  // false
can(null, 'create', 'comment')       // false
can(viewer, 'create', 'comment')     // true

 ```
Last argument can be an object of shape `{ type: entity }` or a string, representing type. It is your responsibility to pass proper entity to functional definitions. For example, this will, of course, return `false` for definitions defined above:

```javascript

const viewer = { id: 1 };
const post = { authorId: 1 };

can(viewer, 'edit', 'post')     // false
can(viewer, 'edit', post)       // will throw because of
                                // unknown type 'authorId'

```

## Client-side `can` example
Not the best style of doing things, but you can get the idea:
```javascript
import { can } from './permissions'
import store from './store'
const { viewer } = store;

fetch('/api/comment/2')
.then(res => res.json())
.then(comment => {
  comment.editable = can(viewer, 'edit', { comment })
  comment.deletable = can(viewer, 'delete', { comment })
})
```

## Server-side `can` example
One can imagine such [Express](https://github.com/expressjs/express) setup:

 ```javascript
 import express from 'express';
 import Comment from './models/User'
 import { can } from  './permissions'

 let app = express();

/* Here should be used some auth middleware,
 * providing req.user, ex. passport */

 const getComment = ({ params: id }, res, next) => {
   Comment.findById(id)
   .then(comment => {
     req.comment = comment;
     next();
   })
   .catch(error => next(error));
 };

 const ifCan = (action, type) => {
   return (req, res, next) => {
     if (can(req.user, action, { [type]: req[type] })) {
       return next();
     }
     res.status(403).end('Forbidden');
   }
 }

/* We update only if we CAN, otherwise we see an error */
 app.get('/api/comment/:id/edit',
  getComment,
  ifCan('edit', 'post'),
  ({ body }, res, next) => {
    Post
      .update(body)
      .then(post => res.json(post))
      .catch(error => next(error))
      ;
 });

 ```

## API

 Coming soon.

## Contributing

MIT license, you are welcome.
