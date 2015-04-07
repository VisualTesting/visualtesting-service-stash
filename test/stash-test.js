'use strict';

var StashService = require('../stash');

describe('module/stash', function() {
  var stashService;
  var options;

  beforeEach(function() {
    options = {
      url: 'url',
      user: 'user',
      password: 'password'
    };
  });

  describe('constructor', function() {
    describe('with invalid args', function() {
      it('throws with non object', function() {
        assert.throws(function() {
          stashService = new StashService();
        });

        assert.throws(function() {
          stashService = new StashService('foo');
        });
      });

      describe('throws without', function() {
        afterEach(function() {
          assert.throws(function() {
            stashService = new StashService(options);
          });
        });

        it('url', function() {
          delete options.url;
        });

        it('user', function() {
          delete options.user;
        });

        it('user', function() {
          delete options.user;
        });
      });

      it('does not throw with all args', function() {
        assert.doesNotThrow(function() {
          stashService = new StashService(options);
        });
      });
    });
  });

  describe('functions', function() {
    beforeEach(function() {
      stashService = new StashService(options);
    });

    it('#serviceKey is stash', function() {
      assert.equal(stashService.serviceKey, 'stash');
    });
  });
});
