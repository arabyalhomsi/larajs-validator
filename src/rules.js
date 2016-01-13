'use strict';

var builtInRules = require('./builtInRules');

var RulesController = function () {
  this.rules = builtInRules;
};

var _rulesProto = RulesController.prototype;

_rulesProto.addRule = function (ruleName, ruleFunction) {
  if (!this.rules[ruleName]) {
    this.rules[ruleName] = ruleFunction;
  }
  else {
    throw Error('You\'re overriding a built-in rule, use overrideRule method.');
  }

};

_rulesProto.overrideRule = function (ruleName, ruleFunction) {
  this.rules[ruleName] = ruleFunction;
};

module.exports = RulesController;
