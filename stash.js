'use strict';

var assert = require('chai').assert;
var request = require('superagent');
require('superagent-as-promised')(request);

function verifyConfig(config) {
  assert.isObject(config);
  assert.equal(config.name, StashService.prototype.serviceKey);

  assert.isObject(config.options);
  var optionKeys = Object.keys(config.options);
  assert.equal(optionKeys.length, 1);
  var optionKey = optionKeys[0];

  if (optionKey === 'user') {
    assert.isString(config.options[optionKey].user);
    assert.isString(config.options[optionKey].repository);
  } else if (optionKey === 'project') {
    assert.isString(config.options[optionKey].project);
    assert.isString(config.options[optionKey].repository);
  } else {
    assert(false, 'Expected stash repo type to be a user or a project');
  }
}

function StashService(options) {
  assert.isObject(options);
  assert.isString(options.url);
  assert.isString(options.user);
  assert.isString(options.password);

  this._serviceConfig = options;
}

StashService.prototype = {
  serviceKey: 'stash',

  setBuildStatus: function(config, options) {
    verifyConfig(config);

    assert.isObject(options);
    assert.isString(options.sha);
    assert.include(['pending', 'success', 'failure'], options.status);

    var state;

    switch (options.status) {
      case 'pending':
        state = 'INPROGRESS';
        break;
      case 'success':
        state = 'SUCCESSFUL';
        break;
      case 'failure':
        state = 'FAILED';
        break;
    }

    return request
      .post(this._serviceConfig.url + '/rest/build-status/1.0/commits/' + options.sha)
      .auth(this._serviceConfig.user, this._serviceConfig.password)
      .send({
        state: state,
        key: 'CI - Visual',
        name: 'CI - Visual',
        url: 'http://google.com'
      });
  },

  addComment: function(config, options) {
    verifyConfig(config);

    assert.isObject(options);
    assert.isString(options.sha);
    assert.isString(options.comment);

    var projectKey;
    var repository;
    if (config.options.user) {
      projectKey = '~' + config.options.user.user;
      repository = config.options.user.repository;
    } else {
      projectKey = config.options.project.project;
      repository = config.options.project.repository;
    }

    var url = '/rest/api/1.0/projects/' + projectKey + '/repos/' + repository + '/commits/' + options.sha + '/comments';

    return request
    .post(this._serviceConfig.url + url)
    .auth(this._serviceConfig.user, this._serviceConfig.password)
    .send({
      text: options.comment
    });
  }
};

module.exports = StashService;
