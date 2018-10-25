'use strict';

import builtInRules from './builtInRules';

var RulesController = function () {
  this.rules = builtInRules;
};

var _rulesProto = RulesController.prototype;

/**
 * Add new rule to use in validation
 * @param {String} ruleName     Rule name, which will be used in 
 * @param {Function} ruleFunction Rule function takes 3 arguments (value, ruleValue, valuesObject)
 */
_rulesProto.addRule = function (ruleName, ruleFunction) {
  if (!this.rules[ruleName]) {
    this.rules[ruleName] = ruleFunction;
  }
  else {
    throw Error('You\'re overriding a built-in rule, use overrideRule method.');
  }

};

/**
 * Ovrride Rule to use in validation
 * @param {String} ruleName     Rule name, which will be used in 
 * @param {Function} ruleFunction Rule function takes 3 arguments (value, ruleValue, valuesObject)
 */
_rulesProto.overrideRule = function (ruleName, ruleFunction) {
  this.rules[ruleName] = ruleFunction;
};

export default RulesController;
