import expect from 'expect'
import Permissions from '../lib'
import * as permissions from './permissions';


const postMock = authorId => ({ authorId });
const viewer = id => ({ id });


describe('Permissions', () => {
  it('should be defined', () => {
    expect(Permissions).toExist();
  });

  before( function () {
    const { can, set, remove }
      = new Permissions(permissions);

    this.can = can;
    this.set = set;
    this.remove = remove;
  });

  describe('can', function () {
    it ('should be a function', function () {
      expect(typeof this.can).toEqual('function');
    });

    it ('should throw if first arg isn`t an object', function () {
        expect(() => this.can('user'))
        .toThrow(/First/);
    });

    it ('should throw if second arg isn`t a string', function () {
      const viewer = { id: 1 };
      const can = this.can;
      expect(() => can(viewer))
      .toThrow(/Second/);
      expect(() => can(viewer, 3))
      .toThrow(/Second/);
      expect(() => can(viewer, {}))
      .toThrow(/Second/);
    });

    it ('should throw if third arg isn`t an object or a string', function () {
      const viewer = { id: 1 };
      const can = this.can;
      expect(() => can(viewer, 'edit'))
      .toThrow(/Last/);
      expect(() => can(viewer, 'edit', 3))
      .toThrow(/Last/);
    });

    it ('should throw if third arg has more or less than pne prop', function () {
      const viewer = { id: 1 };
      const can = this.can;
      expect(() => can(viewer, 'edit', { }))
      .toThrow(/exactly one property/);
      expect(() => can(viewer, 'edit', { comment: {}, post: {} }))
      .toThrow(/exactly one property/);
    });

    it ('should throw if action type is unknown', function () {
      const viewer = { id: 1 };
      const can = this.can;
      expect(() => can(viewer, 'create', { tweet: {} }))
      .toThrow(/Unknown.+tweet/);
    });

    it ('should pass viewer and entity to permission definition if it`s a function', function () {
        const { can } = new Permissions({
          post: {
            edit: (viewer, post) => {
              expect(post.id).toEqual(1)
              expect(viewer.id).toEqual(15)
            }
          }
        });

        can({ id: 15 }, 'edit', { post: { id: 1 } })
    });

    it ('should always return boolean', function () {
      const { can } = new Permissions({
        post: {
          edit: ({ id }, { authorId }) => {
            return authorId === id;
          },
          create: ({ id }) => {
            return id;
          },
          see: true
        }
      });

      const post = postMock(2);

      expect(
        can(viewer(2), 'edit', { post })
      ).toEqual(true);

      expect(
        can(viewer(3), 'edit', { post })
      ).toEqual(false)

      expect(
        can(viewer(null), 'edit', { post })
      ).toEqual(false);

      expect(
        can(viewer(4), 'create', 'post')
      ).toEqual(true);

      expect(
        can(null, 'see', 'post')
      ).toEqual(true);

      expect(
        can(viewer(4), 'delete', 'post')
      ).toEqual(false);

    });

    it('should throw if permission is a function with two args, but entity wasn\'t provided', function () {
      const { can } = new Permissions({
        post: {
          edit: ({ id }, { authorId }) => {
            return authorId === id;
          }
        }
      });

      expect(() => can({ id: 1 }, 'edit', 'post'))
      .toThrow(/Cannot read property/);
    });

  });

  describe('set', function () {

    it ('should be a function', function () {
      expect(typeof this.set).toEqual('function');
    });

    it ('should throw if first arg isn`t a string', function () {
      const set = this.set;
      expect(() => set()).toThrow(/First/);
      expect(() => set({})).toThrow(/First/);
      expect(() => set(4)).toThrow(/First/);

    });

    it ('should throw if secong arg isn`t a string or an array', function () {
      const set = this.set;
      expect(() => set('post')).toThrow(/Second/);
      expect(() => set('post', {})).toThrow(/Second/);
      expect(() => set('post', 4)).toThrow(/Second/);
    });

    it ('should correctly set permission if action is string', function () {
      const { set, can } = new Permissions();
      set('post', 'delete', ({ id }, { authorId }) => ( id === authorId ) );
      const post = postMock(4);
      expect(can(viewer(4), 'delete', { post }))
      .toEqual(true);
      expect(can(viewer(5), 'delete', { post }))
      .toEqual(false);
    });

    it ('should correctly set permissions if actions is an array', function () {
      const { set, can } = new Permissions();
      set('post', ['edit', 'delete'], ({ id }, { authorId }) => ( id === authorId ) );
      const post = postMock(4);
      expect(can(viewer(4), 'delete', { post }))
      .toEqual(true);
      expect(can(viewer(4), 'edit', { post }))
      .toEqual(true);
      expect(can(viewer(5), 'delete', { post }))
      .toEqual(false);
      expect(can(viewer(5), 'edit', { post }))
      .toEqual(false);
    });
  });

  describe('remove', function () {
    it ('should be a function', function () {
      expect(typeof this.remove).toEqual('function');
    });

    it ('should throw if first arg isn`t a string', function () {
      const remove = this.remove;
      expect(() => remove()).toThrow(/First/);
      expect(() => remove({})).toThrow(/First/);
      expect(() => remove(4)).toThrow(/First/);
    });

    it ('should throw if second arg isn`t a string or an array', function () {
      const remove = this.remove;
      expect(() => remove('post')).toThrow(/Second/);
      expect(() => remove('post', {})).toThrow(/Second/);
      expect(() => remove('post', 4)).toThrow(/Second/);
    });

    it ('should correctly remove permission if action is a string', function () {
      const definition
        = ({ id }, { authorId }) => id === authorId;

      const { remove, can } = new Permissions({
        post: {
          edit: definition,
          delete: definition
        }
      });

      const post = postMock(4);
      remove('post', 'edit')
      expect(can(viewer(4), 'edit', { post }))
      .toEqual(false);
      expect(can(viewer(5), 'edit', { post }))
      .toEqual(false);
      expect(can(viewer(4), 'delete', { post }))
      .toEqual(true);
      expect(can(viewer(5), 'delete', { post }))
      .toEqual(false);

    });

    it ('should correctly remove permissions if actions is an array', function () {
      const definition
        = ({ id }, { authorId }) => id === authorId;

      const { remove, can } = new Permissions({
        post: {
          edit: definition,
          delete: definition
        }
      });

      const post = postMock(4);
      remove('post', ['edit', 'delete']);
      expect(can(viewer(4), 'edit', { post }))
      .toEqual(false);
      expect(can(viewer(5), 'edit', { post }))
      .toEqual(false);
      expect(can(viewer(4), 'delete', { post }))
      .toEqual(false);
      expect(can(viewer(5), 'delete', { post }))
      .toEqual(false);

    });
  });
});
