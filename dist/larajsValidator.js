!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.larajsValidator=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var regex = _dereq_('./regex');
var h = _dereq_('./helpers');

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

    switch (h.checkType(value)) {
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

    switch (h.checkType(value)) {
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
    var status = h.checkIfHave(value);
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

    var type = h.checkType(value);
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
    var st = regex.alpha.test(value);
    return st;
  },

  /**
   * [checkAlphaNum description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  alpha_num: function (value) {
    var st = regex.alpha_num.test(value);
    return st;
  },

  /**
   * [checkAlphaDash description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  alpha_dash: function (value) {
    var st = regex.alpha_dash.test(value);
    return st;
  },

  /**
   * [checkEmail description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  email: function (value) {
    if (value) {
      var st = regex.email.test(value);
      return st;
    }
    return true;
  }
};

module.exports = builtInRules;

},{"./helpers":3,"./regex":4}],2:[function(_dereq_,module,exports){
'use strict';

var RulesController = _dereq_('./rules');
var h = _dereq_('./helpers');
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

module.exports = larajsValidator;
},{"./helpers":3,"./rules":5}],3:[function(_dereq_,module,exports){
'use strict';

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

exports.checkType = checkType;

/**
 * Check whether the value is empty or not.
 * @param  {mixed} value  a value to check.
 * @return {boolean}   true if yes, false if no.
 */
var checkIfHave = function (value) {
  var returned = false;
  if (checkType(value) === 'object') {
    if (Object.keys(value)
      .length) {
      returned = true;
    }
  }
  else if (checkType(value) === 'array') {
    if (value.length !== 0) {
      returned = true;
    }
  }
  else {
    if (value) {
      returned = true;
    }
  }
  return returned;
};

exports.checkIfHave = checkIfHave;

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

exports.passed = passed;

/**
 * Split the value by Colon
 * @param  {string} validateRule string to split.
 * @return {array}               an array that have 2 values, ruleName and ruleValue 
 */
var splitByColon = function (validateRule) {
  var splitted = validateRule.split(':');
  return splitted;
};

exports.splitByColon = splitByColon;

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

exports.splitBySepartor = splitBySepartor;

},{}],4:[function(_dereq_,module,exports){
'use strict';

var Regex = {};

Regex.alpha = /^[a-zA-Z]*$/;

Regex.alpha_num = /^[a-zA-Z0-9]*$/;

Regex.alpha_dash = /^[a-zA-Z_-]*$/;

Regex.email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


module.exports = Regex;

},{}],5:[function(_dereq_,module,exports){
'use strict';

var builtInRules = _dereq_('./builtInRules');

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

module.exports = RulesController;

},{"./builtInRules":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL3NyYy9idWlsdEluUnVsZXMuanMiLCIvaG9tZS9lbmljaGVyczMvUHJvamVjdHMvbGFyYWpzLXZhbGlkYXRvci9zcmMvZmFrZV9lMmQ0ZjA4Zi5qcyIsIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL3NyYy9oZWxwZXJzLmpzIiwiL2hvbWUvZW5pY2hlcnMzL1Byb2plY3RzL2xhcmFqcy12YWxpZGF0b3Ivc3JjL3JlZ2V4LmpzIiwiL2hvbWUvZW5pY2hlcnMzL1Byb2plY3RzL2xhcmFqcy12YWxpZGF0b3Ivc3JjL3J1bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWdleCA9IHJlcXVpcmUoJy4vcmVnZXgnKTtcbnZhciBoID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbnZhciBidWlsdEluUnVsZXMgPSB7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB2YWx1ZSBhYm92ZSB0aGUgbWluaW11bSBcbiAgICogQHBhcmFtICB7bWl4ZWR9IHZhbHVlICB0aGUgdmFsdWUgdGhhdCB3aWxsIGJlIGNoZWNrZWQuXG4gICAqIEBwYXJhbSAge251bWJlcn0gcnVsZSAgdGhlIHJ1bGUuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBtaW46IGZ1bmN0aW9uICh2YWx1ZSwgcnVsZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN3aXRjaCAoaC5jaGVja1R5cGUodmFsdWUpKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID49IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZ051bWJlcic6XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaWYgKHZhbHVlID49IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpXG4gICAgICAgICAgLmxlbmd0aCA+PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHZhbHVlIHVuZGVyIHRoZSBtYXhpbXVtIFxuICAgKiBAcGFyYW0gIHttaXhlZH0gdmFsdWUgIHRoZSB2YWx1ZSB0aGF0IHdpbGwgYmUgY2hlY2tlZC5cbiAgICogQHBhcmFtICB7bnVtYmVyfSBydWxlICB0aGUgcnVsZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIG1heDogZnVuY3Rpb24gKHZhbHVlLCBydWxlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3dpdGNoIChoLmNoZWNrVHlwZSh2YWx1ZSkpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPD0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyaW5nTnVtYmVyJzpcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA8PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpZiAodmFsdWUgPD0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoIDw9IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh2YWx1ZSlcbiAgICAgICAgICAubGVuZ3RoIDw9IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdmFsdWUgZXhpc3RlZFxuICAgKiBAcGFyYW0gIHttaXhlZH0gICAgdmFsdWUgICB0aGUgdmFsdWUgdGhhdCB3aWxsIGJlIGNoZWNrZWQuXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IHJ1bGUgIHRoZSBydWxlLlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgcmVxdWlyZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBzdGF0dXMgPSBoLmNoZWNrSWZIYXZlKHZhbHVlKTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdmFsdWUgaXMgdGhlIHNhbWUgYXMgdGhlIHJ1bGUuXG4gICAqIEBwYXJhbSAge21peGVkfSB2YWx1ZSB0aGUgdmFsdWUgdGhhdCB3aWxsIGJlIGNoZWNrZWQuXG4gICAqIEBwYXJhbSAge21peGVkfSBydWxlICB0aGUgcnVsZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHNhbWU6IGZ1bmN0aW9uICh2YWx1ZSwgcnVsZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gcnVsZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBbY2hlY2tUeXBlIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBydWxlICBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgdHlwZTogZnVuY3Rpb24gKHZhbHVlLCBydWxlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSBoLmNoZWNrVHlwZSh2YWx1ZSk7XG4gICAgaWYgKHR5cGUgPT09IHJ1bGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogW2NoZWNrU2FtZUF0dHIgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBydWxlICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlc09iamVjdCBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHNhbWVBdHRyOiBmdW5jdGlvbiAodmFsdWUsIHJ1bGUsIHZhbHVlc09iamVjdCkge1xuICAgIHZhciB2YWx1ZVRvQyA9IHZhbHVlc09iamVjdFtydWxlXTtcblxuICAgIC8vIGlmIGlzIHNldHRlci1nZXR0ZXJcbiAgICBpZiAodHlwZW9mIHZhbHVlVG9DID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YWx1ZVRvQyA9IHZhbHVlVG9DKCk7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSB2YWx1ZVRvQykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBbY2hlY2tBbHBoYSBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB2YWx1ZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgYWxwaGE6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBzdCA9IHJlZ2V4LmFscGhhLnRlc3QodmFsdWUpO1xuICAgIHJldHVybiBzdDtcbiAgfSxcblxuICAvKipcbiAgICogW2NoZWNrQWxwaGFOdW0gZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGFscGhhX251bTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHN0ID0gcmVnZXguYWxwaGFfbnVtLnRlc3QodmFsdWUpO1xuICAgIHJldHVybiBzdDtcbiAgfSxcblxuICAvKipcbiAgICogW2NoZWNrQWxwaGFEYXNoIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhbHBoYV9kYXNoOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgc3QgPSByZWdleC5hbHBoYV9kYXNoLnRlc3QodmFsdWUpO1xuICAgIHJldHVybiBzdDtcbiAgfSxcblxuICAvKipcbiAgICogW2NoZWNrRW1haWwgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGVtYWlsOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHZhciBzdCA9IHJlZ2V4LmVtYWlsLnRlc3QodmFsdWUpO1xuICAgICAgcmV0dXJuIHN0O1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBidWlsdEluUnVsZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSdWxlc0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3J1bGVzJyk7XG52YXIgaCA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xudmFyIHJ1bGVzQ29udHJvbGxlciA9IG5ldyBSdWxlc0NvbnRyb2xsZXIoKTtcblxuXG4vKipcbiAqIGZ1bmN0aW9uIHRoYXQgcmV0dXJuIGluc3RhbmNlIG9mIGxhcmFqc1ZhbGlkYXRvci5jbGFzc1xuICovXG52YXIgbGFyYWpzVmFsaWRhdG9yID0gZnVuY3Rpb24gKHZhbHVlcywgcnVsZXMsIG9uRXZlcnkpIHtcbiAgdmFyIHZhbGlkYXRpb24gPSBuZXcgbGFyYWpzVmFsaWRhdG9yLmNsYXNzKHZhbHVlcywgcnVsZXMsIG9uRXZlcnkpXG4gICAgLmluaXQoKTtcbiAgcmV0dXJuIHZhbGlkYXRpb247XG59O1xuXG5cbi8vIEFkZCBydWxlc0NvbnRyb2xsZXIgdG8gdGhlIG1haW4gZnVuY3Rpb25cbmxhcmFqc1ZhbGlkYXRvci5ydWxlcyA9IHJ1bGVzQ29udHJvbGxlcjtcblxuLyoqXG4gKiB0aGUgbWFpbiBmdW5jdGlvbiB0aGF0IGNvbnRhaW5zIGFsbCBmdW5jdGlvbmFsaXR5XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSAge29iamVjdH0gICB2YWx1ZXMgICAgb2JqZWN0IGhhdmUgdGhlIHZhbHVlcyBhbmQgdGhlaXIgbmFtZXMuXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgcnVsZXMgICAgIHJ1bGVzIHRvIHRoZSB2YWx1ZXMuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gb25FdmVyeSAgIGZ1bmN0aW9uIHJ1bnMgb24gZXZlcnkgcHJvcGVydHkgdmFsaWRhdGlvbi4gXG4gKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgIE9iamVjdCBjb250YWlucyBlcnJvcnMgYW5kIHBhc3NlZCBmdW5jdGlvbnMuXG4gKi9cbmxhcmFqc1ZhbGlkYXRvci5jbGFzcyA9IGZ1bmN0aW9uICh2YWx1ZXMsIHJ1bGVzLCBvbkV2ZXJ5KSB7XG4gIHRoaXMudXNlclZhbHVlcyA9IHZhbHVlcztcbiAgdGhpcy51c2VyUnVsZXMgPSBydWxlcyB8fCB7fTtcbiAgdGhpcy5PbkV2ZXJ5ID0gb25FdmVyeTtcbiAgdGhpcy5lcnJvcnMgPSBbXTtcbn07XG5cbmxhcmFqc1ZhbGlkYXRvci5jbGFzcy5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcGFzc2VkOiB0aGlzLnBhc3NlZCxcbiAgICAgIGVycm9yczogdGhpcy5lcnJvcnNcbiAgICB9O1xuICB9LFxuICBwYXNzZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaC5wYXNzZWQodGhpcy5lcnJvcnMpO1xuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlcyA9IHRoaXMudXNlclZhbHVlcztcbiAgICB2YXIgcnVsZXMgPSB0aGlzLnVzZXJSdWxlcztcblxuICAgIGZvciAodmFyIHZhbHVlIGluIHZhbHVlcykge1xuICAgICAgdmFyIHByb3BOYW1lID0gdmFsdWUsXG4gICAgICAgIHByb3AgPSB2YWx1ZXNbcHJvcE5hbWVdLFxuICAgICAgICBydWxlc1N0cmluZyA9IHJ1bGVzW3Byb3BOYW1lXSxcbiAgICAgICAgcnVsZSA9IGguc3BsaXRCeVNlcGFydG9yKHJ1bGVzU3RyaW5nKSxcbiAgICAgICAgcnVsZUVycm9ycyA9IFtdO1xuXG4gICAgICAvLyBpZiB0aGUgdmFsdWVzIGFyZSBzZXR0ZXItZ2V0dGVyXG4gICAgICBpZiAodHlwZW9mIHByb3AgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBwcm9wID0gcHJvcCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocnVsZSkge1xuICAgICAgICBydWxlLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgdmFyIG9uZVJ1bGUgPSBoLnNwbGl0QnlDb2xvbih2YWx1ZSksXG4gICAgICAgICAgICBvbmVSdWxlTmFtZSA9IG9uZVJ1bGVbMF0sXG4gICAgICAgICAgICBvbmVSdWxlVmFsdWUgPSBvbmVSdWxlWzFdIHx8ICcnLFxuICAgICAgICAgICAgdmFsaWRhdG9yID0gcnVsZXNDb250cm9sbGVyLnJ1bGVzW29uZVJ1bGVOYW1lXSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdHVzO1xuXG4gICAgICAgICAgaWYgKHZhbGlkYXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICAgJ1RoZXJlIGlzIG5vIHJ1bGUgdG8gXCInICsgb25lUnVsZU5hbWUgKyAnXCInKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAob25lUnVsZVZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXR1cyA9IHZhbGlkYXRvcihwcm9wLCB2YWx1ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0dXMgPSB2YWxpZGF0b3IocHJvcCwgb25lUnVsZVZhbHVlLCB2YWx1ZXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdmFsaWRhdGlvblN0YXR1cykge1xuICAgICAgICAgICAgcnVsZUVycm9ycy5wdXNoKHByb3BOYW1lICsgJy4nICsgb25lUnVsZU5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuT25FdmVyeSkge1xuICAgICAgICAgIHRoaXMuT25FdmVyeShwcm9wTmFtZSwgaC5wYXNzZWQocnVsZUVycm9ycykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3JzID0gdGhpcy5lcnJvcnMuY29uY2F0KHJ1bGVFcnJvcnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsYXJhanNWYWxpZGF0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENoZWNrIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZVxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgdHlwZSBvZiB0aGUgZ2l2ZW4gdmFsdWVcbiAqL1xudmFyIGNoZWNrVHlwZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGlzTmFOKHBhcnNlSW50KHZhbHVlKSkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gJ3N0cmluZ051bWJlcic7XG4gICAgfVxuICAgIHJldHVybiAnc3RyaW5nJztcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKGlzTmFOKHZhbHVlKSkge1xuICAgICAgcmV0dXJuICdOYU4nO1xuICAgIH1cbiAgICByZXR1cm4gJ251bWJlcic7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gJ2Jvb2xlYW4nO1xuICB9XG59O1xuXG5leHBvcnRzLmNoZWNrVHlwZSA9IGNoZWNrVHlwZTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSB2YWx1ZSBpcyBlbXB0eSBvciBub3QuXG4gKiBAcGFyYW0gIHttaXhlZH0gdmFsdWUgIGEgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtib29sZWFufSAgIHRydWUgaWYgeWVzLCBmYWxzZSBpZiBuby5cbiAqL1xudmFyIGNoZWNrSWZIYXZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciByZXR1cm5lZCA9IGZhbHNlO1xuICBpZiAoY2hlY2tUeXBlKHZhbHVlKSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpXG4gICAgICAubGVuZ3RoKSB7XG4gICAgICByZXR1cm5lZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGNoZWNrVHlwZSh2YWx1ZSkgPT09ICdhcnJheScpIHtcbiAgICBpZiAodmFsdWUubGVuZ3RoICE9PSAwKSB7XG4gICAgICByZXR1cm5lZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcmV0dXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0dXJuZWQ7XG59O1xuXG5leHBvcnRzLmNoZWNrSWZIYXZlID0gY2hlY2tJZkhhdmU7XG5cbi8qKlxuICogQ2hlY2sgaWYgZXJyb3JzIGFycmF5IGlzIGVtcHR5IG9yIG5vdC5cbiAqIEBwYXJhbSAge2FycmF5fSBlcnJvcnNBcnJheSAgZXJyb3JzIGFycmF5LlxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICB0cnVlIGlmIGhhcywgZmFsc2UgaWYgbm90LlxuICovXG52YXIgcGFzc2VkID0gZnVuY3Rpb24gKGVycm9yc0FycmF5KSB7XG4gIGlmIChlcnJvcnNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydHMucGFzc2VkID0gcGFzc2VkO1xuXG4vKipcbiAqIFNwbGl0IHRoZSB2YWx1ZSBieSBDb2xvblxuICogQHBhcmFtICB7c3RyaW5nfSB2YWxpZGF0ZVJ1bGUgc3RyaW5nIHRvIHNwbGl0LlxuICogQHJldHVybiB7YXJyYXl9ICAgICAgICAgICAgICAgYW4gYXJyYXkgdGhhdCBoYXZlIDIgdmFsdWVzLCBydWxlTmFtZSBhbmQgcnVsZVZhbHVlIFxuICovXG52YXIgc3BsaXRCeUNvbG9uID0gZnVuY3Rpb24gKHZhbGlkYXRlUnVsZSkge1xuICB2YXIgc3BsaXR0ZWQgPSB2YWxpZGF0ZVJ1bGUuc3BsaXQoJzonKTtcbiAgcmV0dXJuIHNwbGl0dGVkO1xufTtcblxuZXhwb3J0cy5zcGxpdEJ5Q29sb24gPSBzcGxpdEJ5Q29sb247XG5cbi8qKlxuICogW3NwbGl0QnlTZXBhcnRvciBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbnZhciBzcGxpdEJ5U2VwYXJ0b3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICB2YXIgc3BsaXR0ZWQgPSB2YWx1ZS5zcGxpdCgnfCcpO1xuICByZXR1cm4gc3BsaXR0ZWQ7XG59O1xuXG5leHBvcnRzLnNwbGl0QnlTZXBhcnRvciA9IHNwbGl0QnlTZXBhcnRvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlZ2V4ID0ge307XG5cblJlZ2V4LmFscGhhID0gL15bYS16QS1aXSokLztcblxuUmVnZXguYWxwaGFfbnVtID0gL15bYS16QS1aMC05XSokLztcblxuUmVnZXguYWxwaGFfZGFzaCA9IC9eW2EtekEtWl8tXSokLztcblxuUmVnZXguZW1haWwgPSAvXltcXHctXFwuXStAKFtcXHctXStcXC4pK1tcXHctXXsyLDR9JC87XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWdleDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ1aWx0SW5SdWxlcyA9IHJlcXVpcmUoJy4vYnVpbHRJblJ1bGVzJyk7XG5cbnZhciBSdWxlc0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMucnVsZXMgPSBidWlsdEluUnVsZXM7XG59O1xuXG52YXIgX3J1bGVzUHJvdG8gPSBSdWxlc0NvbnRyb2xsZXIucHJvdG90eXBlO1xuXG4vKipcbiAqIEFkZCBuZXcgcnVsZSB0byB1c2UgaW4gdmFsaWRhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IHJ1bGVOYW1lICAgICBSdWxlIG5hbWUsIHdoaWNoIHdpbGwgYmUgdXNlZCBpbiBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJ1bGVGdW5jdGlvbiBSdWxlIGZ1bmN0aW9uIHRha2VzIDMgYXJndW1lbnRzICh2YWx1ZSwgcnVsZVZhbHVlLCB2YWx1ZXNPYmplY3QpXG4gKi9cbl9ydWxlc1Byb3RvLmFkZFJ1bGUgPSBmdW5jdGlvbiAocnVsZU5hbWUsIHJ1bGVGdW5jdGlvbikge1xuICBpZiAoIXRoaXMucnVsZXNbcnVsZU5hbWVdKSB7XG4gICAgdGhpcy5ydWxlc1tydWxlTmFtZV0gPSBydWxlRnVuY3Rpb247XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoJ1lvdVxcJ3JlIG92ZXJyaWRpbmcgYSBidWlsdC1pbiBydWxlLCB1c2Ugb3ZlcnJpZGVSdWxlIG1ldGhvZC4nKTtcbiAgfVxuXG59O1xuXG4vKipcbiAqIE92cnJpZGUgUnVsZSB0byB1c2UgaW4gdmFsaWRhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IHJ1bGVOYW1lICAgICBSdWxlIG5hbWUsIHdoaWNoIHdpbGwgYmUgdXNlZCBpbiBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJ1bGVGdW5jdGlvbiBSdWxlIGZ1bmN0aW9uIHRha2VzIDMgYXJndW1lbnRzICh2YWx1ZSwgcnVsZVZhbHVlLCB2YWx1ZXNPYmplY3QpXG4gKi9cbl9ydWxlc1Byb3RvLm92ZXJyaWRlUnVsZSA9IGZ1bmN0aW9uIChydWxlTmFtZSwgcnVsZUZ1bmN0aW9uKSB7XG4gIHRoaXMucnVsZXNbcnVsZU5hbWVdID0gcnVsZUZ1bmN0aW9uO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSdWxlc0NvbnRyb2xsZXI7XG4iXX0=
(2)
});
