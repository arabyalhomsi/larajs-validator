(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.larajsValidator = factory());
}(this, (function () { 'use strict';

var Regex = {};

Regex.alpha = /^[a-zA-Z]*$/;

Regex.alpha_num = /^[a-zA-Z0-9]*$/;

Regex.alpha_dash = /^[a-zA-Z_-]*$/;

Regex.email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

var helpers = {};


/**
 * Check the type of the value
 * @return {string} The type of the given value
 */
var checkType = function (value) {
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return 'array';
    }
    else {
      return 'object';
    }
  }
  else if (typeof value === 'string') {
    if (isNaN(parseInt(value)) === false) {
      return 'stringNumber';
    }
    return 'string';
  }
  else if (typeof value === 'number') {
    if (isNaN(value)) {
      return 'NaN';
    }
    return 'number';
  }
  else if (typeof value === 'boolean') {
    return 'boolean';
  }
};

helpers.checkType = checkType;

/**
 * Check whether the value is empty or not.
 * @param  {mixed} value  a value to check.
 * @return {boolean}   true if yes, false if no.
 */
var checkIfHave = function (value) {
  var returned = false;
  if (checkType(value) === 'object') {
    if (value === null) {
      return false;
    }else if (Object.keys(value)
      .length) {
      returned = true;
    }
  }
  else if (checkType(value) === 'array') {
    if (value.length !== 0) {
      returned = true;
    }
  }
  else if (checkType(value) === 'number') {
    return true;
  }
  else {
    if (value) {
      returned = true;
    }
  }
  return returned;
};

helpers.checkIfHave = checkIfHave;

/**
 * Check if errors array is empty or not.
 * @param  {array} errorsArray  errors array.
 * @return {boolean}            true if has, false if not.
 */
var passed = function (errorsArray) {
  if (errorsArray.length === 0) {
    return true;
  }
  else {
    return false;
  }
};

helpers.passed = passed;

/**
 * Split the value by Colon
 * @param  {string} validateRule string to split.
 * @return {array}               an array that have 2 values, ruleName and ruleValue 
 */
var splitByColon = function (validateRule) {
  var splitted = validateRule.split(':');
  return splitted;
};

helpers.splitByColon = splitByColon;

/**
 * [splitBySepartor description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
var splitBySepartor = function (value) {
  if (!value) {
    return '';
  }
  var splitted = value.split('|');
  return splitted;
};

helpers.splitBySepartor = splitBySepartor;

var builtInRules = {

  /**
   * Check if the value above the minimum 
   * @param  {mixed} value  the value that will be checked.
   * @param  {number} rule  the rule.
   * @return {boolean}
   */
  min: function (value, rule) {
    if (!value) {
      return true;
    }

    switch (helpers.checkType(value)) {
      case 'string':
        if (value.length >= rule) {
          return true;
        }
        break;
      case 'stringNumber':
        if (value.length >= rule) {
          return true;
        }
        break;
      case 'number':
        if (value >= rule) {
          return true;
        }
        break;
      case 'array':
        if (value.length >= rule) {
          return true;
        }
        break;
      case 'object':
        if (Object.keys(value)
          .length >= rule) {
          return true;
        }
        break;
    }
    return false;
  },

  /**
   * Check if the value under the maximum 
   * @param  {mixed} value  the value that will be checked.
   * @param  {number} rule  the rule.
   * @return {boolean}
   */
  max: function (value, rule) {
    if (!value) {
      return true;
    }

    switch (helpers.checkType(value)) {
      case 'string':
        if (value.length <= rule) {
          return true;
        }
        break;
      case 'stringNumber':
        if (value.length <= rule) {
          return true;
        }
        break;
      case 'number':
        if (value <= rule) {
          return true;
        }
        break;
      case 'array':
        if (value.length <= rule) {
          return true;
        }
        break;
      case 'object':
        if (Object.keys(value)
          .length <= rule) {
          return true;
        }
        break;
    }
    return false;
  },

  /**
   * Check if the value existed
   * @param  {mixed}    value   the value that will be checked.
   * @param  {boolean} rule  the rule.
   * @return {boolean}
   */
  required: function (value) {
    var status = helpers.checkIfHave(value);
    return status;
  },

  /**
   * Check if the value is the same as the rule.
   * @param  {mixed} value the value that will be checked.
   * @param  {mixed} rule  the rule.
   * @return {boolean}
   */
  same: function (value, rule) {
    if (!value) {
      return true;
    }

    if (value === rule) {
      return true;
    }

    return false;
  },

  /**
   * [checkType description]
   * @param  {[type]} value [description]
   * @param  {[type]} rule  [description]
   * @return {[type]}       [description]
   */
  type: function (value, rule) {
    if (!value) {
      return true;
    }

    var type = helpers.checkType(value);
    if (type === rule) {
      return true;
    }

    return false;
  },

  /**
   * [checkSameAttr description]
   * @param  {[type]} value        [description]
   * @param  {[type]} rule         [description]
   * @param  {[type]} valuesObject [description]
   * @return {[type]}              [description]
   */
  sameAttr: function (value, rule, valuesObject) {
    var valueToC = valuesObject[rule];

    // if is setter-getter
    if (typeof valueToC === 'function') {
      valueToC = valueToC();
    }

    if (value === valueToC) {
      return true;
    }

    return false;
  },

  /**
   * [checkAlpha description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  alpha: function (value) {
    var st = Regex.alpha.test(value);
    return st;
  },

  /**
   * [checkAlphaNum description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  alpha_num: function (value) {
    var st = Regex.alpha_num.test(value);
    return st;
  },

  /**
   * [checkAlphaDash description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  alpha_dash: function (value) {
    var st = Regex.alpha_dash.test(value);
    return st;
  },

  /**
   * [checkEmail description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  email: function (value) {
    if (value) {
      var st = Regex.email.test(value);
      return st;
    }
    return true;
  }
};

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
    return helpers.passed(this.errors);
  },

  validate: function () {
    var values = this.userValues;
    var rules = this.userRules;

    for (var value in values) {
      var propName = value,
        prop = values[propName],
        rulesString = rules[propName],
        rule = helpers.splitBySepartor(rulesString),
        ruleErrors = [];

      // if the values are setter-getter
      if (typeof prop === "function") {
        prop = prop();
      }

      if (rule) {
        rule.forEach(function (value) {
          var oneRule = helpers.splitByColon(value),
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
          this.OnEvery(propName, helpers.passed(ruleErrors));
        }
        this.errors = this.errors.concat(ruleErrors);
      }
    }
  }
};

return larajsValidator;

})));
