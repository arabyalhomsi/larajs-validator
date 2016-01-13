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
var larajsValidator = function (values, rules, options, onEvery) {
  var validation = new larajsValidator.class(values, rules, options, onEvery)
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
larajsValidator.class = function (values, rules, options, onEvery) {
  this.userValues = values;
  this.userRules = rules || {};
  this.userOptions = options || {};
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
      if (this.userOptions.setget === true) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL3NyYy9idWlsdEluUnVsZXMuanMiLCIvaG9tZS9lbmljaGVyczMvUHJvamVjdHMvbGFyYWpzLXZhbGlkYXRvci9zcmMvZmFrZV9kMWY2NjY5YS5qcyIsIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL3NyYy9oZWxwZXJzLmpzIiwiL2hvbWUvZW5pY2hlcnMzL1Byb2plY3RzL2xhcmFqcy12YWxpZGF0b3Ivc3JjL3JlZ2V4LmpzIiwiL2hvbWUvZW5pY2hlcnMzL1Byb2plY3RzL2xhcmFqcy12YWxpZGF0b3Ivc3JjL3J1bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlZ2V4ID0gcmVxdWlyZSgnLi9yZWdleCcpO1xudmFyIGggPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxudmFyIGJ1aWx0SW5SdWxlcyA9IHtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHZhbHVlIGFib3ZlIHRoZSBtaW5pbXVtIFxuICAgKiBAcGFyYW0gIHttaXhlZH0gdmFsdWUgIHRoZSB2YWx1ZSB0aGF0IHdpbGwgYmUgY2hlY2tlZC5cbiAgICogQHBhcmFtICB7bnVtYmVyfSBydWxlICB0aGUgcnVsZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIG1pbjogZnVuY3Rpb24gKHZhbHVlLCBydWxlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3dpdGNoIChoLmNoZWNrVHlwZSh2YWx1ZSkpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyaW5nTnVtYmVyJzpcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpZiAodmFsdWUgPj0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID49IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh2YWx1ZSlcbiAgICAgICAgICAubGVuZ3RoID49IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdmFsdWUgdW5kZXIgdGhlIG1heGltdW0gXG4gICAqIEBwYXJhbSAge21peGVkfSB2YWx1ZSAgdGhlIHZhbHVlIHRoYXQgd2lsbCBiZSBjaGVja2VkLlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHJ1bGUgIHRoZSBydWxlLlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgbWF4OiBmdW5jdGlvbiAodmFsdWUsIHJ1bGUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGguY2hlY2tUeXBlKHZhbHVlKSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA8PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmdOdW1iZXInOlxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoIDw9IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGlmICh2YWx1ZSA8PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPD0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlKVxuICAgICAgICAgIC5sZW5ndGggPD0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB2YWx1ZSBleGlzdGVkXG4gICAqIEBwYXJhbSAge21peGVkfSAgICB2YWx1ZSAgIHRoZSB2YWx1ZSB0aGF0IHdpbGwgYmUgY2hlY2tlZC5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gcnVsZSAgdGhlIHJ1bGUuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICByZXF1aXJlZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHN0YXR1cyA9IGguY2hlY2tJZkhhdmUodmFsdWUpO1xuICAgIHJldHVybiBzdGF0dXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB2YWx1ZSBpcyB0aGUgc2FtZSBhcyB0aGUgcnVsZS5cbiAgICogQHBhcmFtICB7bWl4ZWR9IHZhbHVlIHRoZSB2YWx1ZSB0aGF0IHdpbGwgYmUgY2hlY2tlZC5cbiAgICogQHBhcmFtICB7bWl4ZWR9IHJ1bGUgIHRoZSBydWxlLlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgc2FtZTogZnVuY3Rpb24gKHZhbHVlLCBydWxlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSBydWxlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFtjaGVja1R5cGUgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHJ1bGUgIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICB0eXBlOiBmdW5jdGlvbiAodmFsdWUsIHJ1bGUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9IGguY2hlY2tUeXBlKHZhbHVlKTtcbiAgICBpZiAodHlwZSA9PT0gcnVsZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBbY2hlY2tTYW1lQXR0ciBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB2YWx1ZSAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHJ1bGUgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWVzT2JqZWN0IFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgc2FtZUF0dHI6IGZ1bmN0aW9uICh2YWx1ZSwgcnVsZSwgdmFsdWVzT2JqZWN0KSB7XG4gICAgdmFyIHZhbHVlVG9DID0gdmFsdWVzT2JqZWN0W3J1bGVdO1xuXG4gICAgLy8gaWYgaXMgc2V0dGVyLWdldHRlclxuICAgIGlmICh0eXBlb2YgdmFsdWVUb0MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhbHVlVG9DID0gdmFsdWVUb0MoKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IHZhbHVlVG9DKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFtjaGVja0FscGhhIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhbHBoYTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHN0ID0gcmVnZXguYWxwaGEudGVzdCh2YWx1ZSk7XG4gICAgcmV0dXJuIHN0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBbY2hlY2tBbHBoYU51bSBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB2YWx1ZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgYWxwaGFfbnVtOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgc3QgPSByZWdleC5hbHBoYV9udW0udGVzdCh2YWx1ZSk7XG4gICAgcmV0dXJuIHN0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBbY2hlY2tBbHBoYURhc2ggZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGFscGhhX2Rhc2g6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBzdCA9IHJlZ2V4LmFscGhhX2Rhc2gudGVzdCh2YWx1ZSk7XG4gICAgcmV0dXJuIHN0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBbY2hlY2tFbWFpbCBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB2YWx1ZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZW1haWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdmFyIHN0ID0gcmVnZXguZW1haWwudGVzdCh2YWx1ZSk7XG4gICAgICByZXR1cm4gc3Q7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1aWx0SW5SdWxlcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJ1bGVzQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vcnVsZXMnKTtcbnZhciBoID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG52YXIgcnVsZXNDb250cm9sbGVyID0gbmV3IFJ1bGVzQ29udHJvbGxlcigpO1xuXG5cbi8qKlxuICogZnVuY3Rpb24gdGhhdCByZXR1cm4gaW5zdGFuY2Ugb2YgbGFyYWpzVmFsaWRhdG9yLmNsYXNzXG4gKi9cbnZhciBsYXJhanNWYWxpZGF0b3IgPSBmdW5jdGlvbiAodmFsdWVzLCBydWxlcywgb3B0aW9ucywgb25FdmVyeSkge1xuICB2YXIgdmFsaWRhdGlvbiA9IG5ldyBsYXJhanNWYWxpZGF0b3IuY2xhc3ModmFsdWVzLCBydWxlcywgb3B0aW9ucywgb25FdmVyeSlcbiAgICAuaW5pdCgpO1xuICByZXR1cm4gdmFsaWRhdGlvbjtcbn07XG5cblxuLy8gQWRkIHJ1bGVzQ29udHJvbGxlciB0byB0aGUgbWFpbiBmdW5jdGlvblxubGFyYWpzVmFsaWRhdG9yLnJ1bGVzID0gcnVsZXNDb250cm9sbGVyO1xuXG4vKipcbiAqIHRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY29udGFpbnMgYWxsIGZ1bmN0aW9uYWxpdHlcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtICB7b2JqZWN0fSAgIHZhbHVlcyAgICBvYmplY3QgaGF2ZSB0aGUgdmFsdWVzIGFuZCB0aGVpciBuYW1lcy5cbiAqIEBwYXJhbSAge29iamVjdH0gICBydWxlcyAgICAgcnVsZXMgdG8gdGhlIHZhbHVlcy5cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBvbkV2ZXJ5ICAgZnVuY3Rpb24gcnVucyBvbiBldmVyeSBwcm9wZXJ0eSB2YWxpZGF0aW9uLiBcbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgT2JqZWN0IGNvbnRhaW5zIGVycm9ycyBhbmQgcGFzc2VkIGZ1bmN0aW9ucy5cbiAqL1xubGFyYWpzVmFsaWRhdG9yLmNsYXNzID0gZnVuY3Rpb24gKHZhbHVlcywgcnVsZXMsIG9wdGlvbnMsIG9uRXZlcnkpIHtcbiAgdGhpcy51c2VyVmFsdWVzID0gdmFsdWVzO1xuICB0aGlzLnVzZXJSdWxlcyA9IHJ1bGVzIHx8IHt9O1xuICB0aGlzLnVzZXJPcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5PbkV2ZXJ5ID0gb25FdmVyeTtcbiAgdGhpcy5lcnJvcnMgPSBbXTtcbn07XG5cbmxhcmFqc1ZhbGlkYXRvci5jbGFzcy5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcGFzc2VkOiB0aGlzLnBhc3NlZCxcbiAgICAgIGVycm9yczogdGhpcy5lcnJvcnNcbiAgICB9O1xuICB9LFxuICBwYXNzZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaC5wYXNzZWQodGhpcy5lcnJvcnMpO1xuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlcyA9IHRoaXMudXNlclZhbHVlcztcbiAgICB2YXIgcnVsZXMgPSB0aGlzLnVzZXJSdWxlcztcblxuICAgIGZvciAodmFyIHZhbHVlIGluIHZhbHVlcykge1xuICAgICAgdmFyIHByb3BOYW1lID0gdmFsdWUsXG4gICAgICAgIHByb3AgPSB2YWx1ZXNbcHJvcE5hbWVdLFxuICAgICAgICBydWxlc1N0cmluZyA9IHJ1bGVzW3Byb3BOYW1lXSxcbiAgICAgICAgcnVsZSA9IGguc3BsaXRCeVNlcGFydG9yKHJ1bGVzU3RyaW5nKSxcbiAgICAgICAgcnVsZUVycm9ycyA9IFtdO1xuXG4gICAgICAvLyBpZiB0aGUgdmFsdWVzIGFyZSBzZXR0ZXItZ2V0dGVyXG4gICAgICBpZiAodGhpcy51c2VyT3B0aW9ucy5zZXRnZXQgPT09IHRydWUpIHtcbiAgICAgICAgcHJvcCA9IHByb3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJ1bGUpIHtcbiAgICAgICAgcnVsZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHZhciBvbmVSdWxlID0gaC5zcGxpdEJ5Q29sb24odmFsdWUpLFxuICAgICAgICAgICAgb25lUnVsZU5hbWUgPSBvbmVSdWxlWzBdLFxuICAgICAgICAgICAgb25lUnVsZVZhbHVlID0gb25lUnVsZVsxXSB8fCAnJyxcbiAgICAgICAgICAgIHZhbGlkYXRvciA9IHJ1bGVzQ29udHJvbGxlci5ydWxlc1tvbmVSdWxlTmFtZV0gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXR1cztcblxuICAgICAgICAgIGlmICh2YWxpZGF0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgICdUaGVyZSBpcyBubyBydWxlIHRvIFwiJyArIG9uZVJ1bGVOYW1lICsgJ1wiJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG9uZVJ1bGVWYWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0dXMgPSB2YWxpZGF0b3IocHJvcCwgdmFsdWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdHVzID0gdmFsaWRhdG9yKHByb3AsIG9uZVJ1bGVWYWx1ZSwgdmFsdWVzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXZhbGlkYXRpb25TdGF0dXMpIHtcbiAgICAgICAgICAgIHJ1bGVFcnJvcnMucHVzaChwcm9wTmFtZSArICcuJyArIG9uZVJ1bGVOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLk9uRXZlcnkpIHtcbiAgICAgICAgICB0aGlzLk9uRXZlcnkocHJvcE5hbWUsIGgucGFzc2VkKHJ1bGVFcnJvcnMpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9ycyA9IHRoaXMuZXJyb3JzLmNvbmNhdChydWxlRXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGFyYWpzVmFsaWRhdG9yOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDaGVjayB0aGUgdHlwZSBvZiB0aGUgdmFsdWVcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHR5cGUgb2YgdGhlIGdpdmVuIHZhbHVlXG4gKi9cbnZhciBjaGVja1R5cGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIGlmIChpc05hTihwYXJzZUludCh2YWx1ZSkpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICdzdHJpbmdOdW1iZXInO1xuICAgIH1cbiAgICByZXR1cm4gJ3N0cmluZyc7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIGlmIChpc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiAnTmFOJztcbiAgICB9XG4gICAgcmV0dXJuICdudW1iZXInO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuICdib29sZWFuJztcbiAgfVxufTtcblxuZXhwb3J0cy5jaGVja1R5cGUgPSBjaGVja1R5cGU7XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgdmFsdWUgaXMgZW1wdHkgb3Igbm90LlxuICogQHBhcmFtICB7bWl4ZWR9IHZhbHVlICBhIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Ym9vbGVhbn0gICB0cnVlIGlmIHllcywgZmFsc2UgaWYgbm8uXG4gKi9cbnZhciBjaGVja0lmSGF2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcmV0dXJuZWQgPSBmYWxzZTtcbiAgaWYgKGNoZWNrVHlwZSh2YWx1ZSkgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlKVxuICAgICAgLmxlbmd0aCkge1xuICAgICAgcmV0dXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChjaGVja1R5cGUodmFsdWUpID09PSAnYXJyYXknKSB7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0dXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHJldHVybmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldHVybmVkO1xufTtcblxuZXhwb3J0cy5jaGVja0lmSGF2ZSA9IGNoZWNrSWZIYXZlO1xuXG4vKipcbiAqIENoZWNrIGlmIGVycm9ycyBhcnJheSBpcyBlbXB0eSBvciBub3QuXG4gKiBAcGFyYW0gIHthcnJheX0gZXJyb3JzQXJyYXkgIGVycm9ycyBhcnJheS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgdHJ1ZSBpZiBoYXMsIGZhbHNlIGlmIG5vdC5cbiAqL1xudmFyIHBhc3NlZCA9IGZ1bmN0aW9uIChlcnJvcnNBcnJheSkge1xuICBpZiAoZXJyb3JzQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5leHBvcnRzLnBhc3NlZCA9IHBhc3NlZDtcblxuLyoqXG4gKiBTcGxpdCB0aGUgdmFsdWUgYnkgQ29sb25cbiAqIEBwYXJhbSAge3N0cmluZ30gdmFsaWRhdGVSdWxlIHN0cmluZyB0byBzcGxpdC5cbiAqIEByZXR1cm4ge2FycmF5fSAgICAgICAgICAgICAgIGFuIGFycmF5IHRoYXQgaGF2ZSAyIHZhbHVlcywgcnVsZU5hbWUgYW5kIHJ1bGVWYWx1ZSBcbiAqL1xudmFyIHNwbGl0QnlDb2xvbiA9IGZ1bmN0aW9uICh2YWxpZGF0ZVJ1bGUpIHtcbiAgdmFyIHNwbGl0dGVkID0gdmFsaWRhdGVSdWxlLnNwbGl0KCc6Jyk7XG4gIHJldHVybiBzcGxpdHRlZDtcbn07XG5cbmV4cG9ydHMuc3BsaXRCeUNvbG9uID0gc3BsaXRCeUNvbG9uO1xuXG4vKipcbiAqIFtzcGxpdEJ5U2VwYXJ0b3IgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG52YXIgc3BsaXRCeVNlcGFydG9yID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgdmFyIHNwbGl0dGVkID0gdmFsdWUuc3BsaXQoJ3wnKTtcbiAgcmV0dXJuIHNwbGl0dGVkO1xufTtcblxuZXhwb3J0cy5zcGxpdEJ5U2VwYXJ0b3IgPSBzcGxpdEJ5U2VwYXJ0b3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWdleCA9IHt9O1xuXG5SZWdleC5hbHBoYSA9IC9eW2EtekEtWl0qJC87XG5cblJlZ2V4LmFscGhhX251bSA9IC9eW2EtekEtWjAtOV0qJC87XG5cblJlZ2V4LmFscGhhX2Rhc2ggPSAvXlthLXpBLVpfLV0qJC87XG5cblJlZ2V4LmVtYWlsID0gL15bXFx3LVxcLl0rQChbXFx3LV0rXFwuKStbXFx3LV17Miw0fSQvO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVnZXg7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBidWlsdEluUnVsZXMgPSByZXF1aXJlKCcuL2J1aWx0SW5SdWxlcycpO1xuXG52YXIgUnVsZXNDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnJ1bGVzID0gYnVpbHRJblJ1bGVzO1xufTtcblxudmFyIF9ydWxlc1Byb3RvID0gUnVsZXNDb250cm9sbGVyLnByb3RvdHlwZTtcblxuLyoqXG4gKiBBZGQgbmV3IHJ1bGUgdG8gdXNlIGluIHZhbGlkYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBydWxlTmFtZSAgICAgUnVsZSBuYW1lLCB3aGljaCB3aWxsIGJlIHVzZWQgaW4gXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBydWxlRnVuY3Rpb24gUnVsZSBmdW5jdGlvbiB0YWtlcyAzIGFyZ3VtZW50cyAodmFsdWUsIHJ1bGVWYWx1ZSwgdmFsdWVzT2JqZWN0KVxuICovXG5fcnVsZXNQcm90by5hZGRSdWxlID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBydWxlRnVuY3Rpb24pIHtcbiAgaWYgKCF0aGlzLnJ1bGVzW3J1bGVOYW1lXSkge1xuICAgIHRoaXMucnVsZXNbcnVsZU5hbWVdID0gcnVsZUZ1bmN0aW9uO1xuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IEVycm9yKCdZb3VcXCdyZSBvdmVycmlkaW5nIGEgYnVpbHQtaW4gcnVsZSwgdXNlIG92ZXJyaWRlUnVsZSBtZXRob2QuJyk7XG4gIH1cblxufTtcblxuLyoqXG4gKiBPdnJyaWRlIFJ1bGUgdG8gdXNlIGluIHZhbGlkYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBydWxlTmFtZSAgICAgUnVsZSBuYW1lLCB3aGljaCB3aWxsIGJlIHVzZWQgaW4gXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBydWxlRnVuY3Rpb24gUnVsZSBmdW5jdGlvbiB0YWtlcyAzIGFyZ3VtZW50cyAodmFsdWUsIHJ1bGVWYWx1ZSwgdmFsdWVzT2JqZWN0KVxuICovXG5fcnVsZXNQcm90by5vdmVycmlkZVJ1bGUgPSBmdW5jdGlvbiAocnVsZU5hbWUsIHJ1bGVGdW5jdGlvbikge1xuICB0aGlzLnJ1bGVzW3J1bGVOYW1lXSA9IHJ1bGVGdW5jdGlvbjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZXNDb250cm9sbGVyO1xuIl19
(2)
});
