'use strict';

import RulesController from './rules';
import h from './helpers';


var rulesController = new RulesController();


/**
 * function that return instance of larajsValidator.class
 */
var larajsValidator = function (values, rules, onEvery) {
  var validation = new larajsValidator.class(values, rules, onEvery)
    .init();
  return validation;
};


// Add rulesController to the main function
larajsValidator.rules = rulesController;

/**
 * the main function that contains all functionality
 * @constructor
 * @param  {object}   values    object have the values and their names.
 * @param  {object}   rules     rules to the values.
 * @param  {function} onEvery   function runs on every property validation. 
 * @return {object}             Object contains errors and passed functions.
 */
larajsValidator.class = function (values, rules, onEvery) {
  this.userValues = values;
  this.userRules = rules || {};
  this.OnEvery = onEvery;
  this.errors = [];
};

larajsValidator.class.prototype = {
  init: function () {
    this.validate();

    return {
      passed: this.passed,
      errors: this.errors
    };
  },
  passed: function () {
    return h.passed(this.errors);
  },

  validate: function () {
    var values = this.userValues;
    var rules = this.userRules;

    for (var value in values) {
      var propName = value,
        prop = values[propName],
        rulesString = rules[propName],
        rule = h.splitBySepartor(rulesString),
        ruleErrors = [];

      // if the values are setter-getter
      if (typeof prop === "function") {
        prop = prop();
      }

      if (rule) {
        rule.forEach(function (value) {
          var oneRule = h.splitByColon(value),
            oneRuleName = oneRule[0],
            oneRuleValue = oneRule[1] || '',
            validator = rulesController.rules[oneRuleName] || undefined,
            validationStatus;

          if (validator === undefined) {
            throw Error(
              'There is no rule to "' + oneRuleName + '"');
          }

          if (oneRuleValue === '') {
            validationStatus = validator(prop, values);
          }
          else {
            validationStatus = validator(prop, oneRuleValue, values);
          }

          if (!validationStatus) {
            ruleErrors.push(propName + '.' + oneRuleName);
          }
        });

        if (this.OnEvery) {
          this.OnEvery(propName, h.passed(ruleErrors));
        }
        this.errors = this.errors.concat(ruleErrors);
      }
    }
  }
};

export default larajsValidator;