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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL3NyYy9idWlsdEluUnVsZXMuanMiLCIvaG9tZS9lbmljaGVyczMvUHJvamVjdHMvbGFyYWpzLXZhbGlkYXRvci9zcmMvZmFrZV85ZTlmOWIxOC5qcyIsIi9ob21lL2VuaWNoZXJzMy9Qcm9qZWN0cy9sYXJhanMtdmFsaWRhdG9yL3NyYy9oZWxwZXJzLmpzIiwiL2hvbWUvZW5pY2hlcnMzL1Byb2plY3RzL2xhcmFqcy12YWxpZGF0b3Ivc3JjL3JlZ2V4LmpzIiwiL2hvbWUvZW5pY2hlcnMzL1Byb2plY3RzL2xhcmFqcy12YWxpZGF0b3Ivc3JjL3J1bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnZXggPSByZXF1aXJlKCcuL3JlZ2V4Jyk7XG52YXIgaCA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG52YXIgYnVpbHRJblJ1bGVzID0ge1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdmFsdWUgYWJvdmUgdGhlIG1pbmltdW0gXG4gICAqIEBwYXJhbSAge21peGVkfSB2YWx1ZSAgdGhlIHZhbHVlIHRoYXQgd2lsbCBiZSBjaGVja2VkLlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHJ1bGUgIHRoZSBydWxlLlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgbWluOiBmdW5jdGlvbiAodmFsdWUsIHJ1bGUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGguY2hlY2tUeXBlKHZhbHVlKSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmdOdW1iZXInOlxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID49IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGlmICh2YWx1ZSA+PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlKVxuICAgICAgICAgIC5sZW5ndGggPj0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB2YWx1ZSB1bmRlciB0aGUgbWF4aW11bSBcbiAgICogQHBhcmFtICB7bWl4ZWR9IHZhbHVlICB0aGUgdmFsdWUgdGhhdCB3aWxsIGJlIGNoZWNrZWQuXG4gICAqIEBwYXJhbSAge251bWJlcn0gcnVsZSAgdGhlIHJ1bGUuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBtYXg6IGZ1bmN0aW9uICh2YWx1ZSwgcnVsZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN3aXRjaCAoaC5jaGVja1R5cGUodmFsdWUpKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoIDw9IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmluZ051bWJlcic6XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPD0gcnVsZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaWYgKHZhbHVlIDw9IHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA8PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpXG4gICAgICAgICAgLmxlbmd0aCA8PSBydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHZhbHVlIGV4aXN0ZWRcbiAgICogQHBhcmFtICB7bWl4ZWR9ICAgIHZhbHVlICAgdGhlIHZhbHVlIHRoYXQgd2lsbCBiZSBjaGVja2VkLlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBydWxlICB0aGUgcnVsZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHJlcXVpcmVkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgc3RhdHVzID0gaC5jaGVja0lmSGF2ZSh2YWx1ZSk7XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIHRoZSBzYW1lIGFzIHRoZSBydWxlLlxuICAgKiBAcGFyYW0gIHttaXhlZH0gdmFsdWUgdGhlIHZhbHVlIHRoYXQgd2lsbCBiZSBjaGVja2VkLlxuICAgKiBAcGFyYW0gIHttaXhlZH0gcnVsZSAgdGhlIHJ1bGUuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBzYW1lOiBmdW5jdGlvbiAodmFsdWUsIHJ1bGUpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IHJ1bGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogW2NoZWNrVHlwZSBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB2YWx1ZSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcnVsZSAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHR5cGU6IGZ1bmN0aW9uICh2YWx1ZSwgcnVsZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gaC5jaGVja1R5cGUodmFsdWUpO1xuICAgIGlmICh0eXBlID09PSBydWxlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFtjaGVja1NhbWVBdHRyIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcnVsZSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB2YWx1ZXNPYmplY3QgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzYW1lQXR0cjogZnVuY3Rpb24gKHZhbHVlLCBydWxlLCB2YWx1ZXNPYmplY3QpIHtcbiAgICB2YXIgdmFsdWVUb0MgPSB2YWx1ZXNPYmplY3RbcnVsZV07XG5cbiAgICAvLyBpZiBpcyBzZXR0ZXItZ2V0dGVyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZVRvQyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFsdWVUb0MgPSB2YWx1ZVRvQygpO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gdmFsdWVUb0MpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogW2NoZWNrQWxwaGEgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGFscGhhOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgc3QgPSByZWdleC5hbHBoYS50ZXN0KHZhbHVlKTtcbiAgICByZXR1cm4gc3Q7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFtjaGVja0FscGhhTnVtIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhbHBoYV9udW06IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBzdCA9IHJlZ2V4LmFscGhhX251bS50ZXN0KHZhbHVlKTtcbiAgICByZXR1cm4gc3Q7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFtjaGVja0FscGhhRGFzaCBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSB2YWx1ZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgYWxwaGFfZGFzaDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHN0ID0gcmVnZXguYWxwaGFfZGFzaC50ZXN0KHZhbHVlKTtcbiAgICByZXR1cm4gc3Q7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFtjaGVja0VtYWlsIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHZhbHVlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBlbWFpbDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB2YXIgc3QgPSByZWdleC5lbWFpbC50ZXN0KHZhbHVlKTtcbiAgICAgIHJldHVybiBzdDtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYnVpbHRJblJ1bGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUnVsZXNDb250cm9sbGVyID0gcmVxdWlyZSgnLi9ydWxlcycpO1xudmFyIGggPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcbnZhciBydWxlc0NvbnRyb2xsZXIgPSBuZXcgUnVsZXNDb250cm9sbGVyKCk7XG5cblxuLyoqXG4gKiBmdW5jdGlvbiB0aGF0IHJldHVybiBpbnN0YW5jZSBvZiBsYXJhanNWYWxpZGF0b3IuY2xhc3NcbiAqL1xudmFyIGxhcmFqc1ZhbGlkYXRvciA9IGZ1bmN0aW9uICh2YWx1ZXMsIHJ1bGVzLCBvbkV2ZXJ5KSB7XG4gIHZhciB2YWxpZGF0aW9uID0gbmV3IGxhcmFqc1ZhbGlkYXRvci5jbGFzcyh2YWx1ZXMsIHJ1bGVzLCBvbkV2ZXJ5KVxuICAgIC5pbml0KCk7XG4gIHJldHVybiB2YWxpZGF0aW9uO1xufTtcblxuXG4vLyBBZGQgcnVsZXNDb250cm9sbGVyIHRvIHRoZSBtYWluIGZ1bmN0aW9uXG5sYXJhanNWYWxpZGF0b3IucnVsZXMgPSBydWxlc0NvbnRyb2xsZXI7XG5cbi8qKlxuICogdGhlIG1haW4gZnVuY3Rpb24gdGhhdCBjb250YWlucyBhbGwgZnVuY3Rpb25hbGl0eVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgdmFsdWVzICAgIG9iamVjdCBoYXZlIHRoZSB2YWx1ZXMgYW5kIHRoZWlyIG5hbWVzLlxuICogQHBhcmFtICB7b2JqZWN0fSAgIHJ1bGVzICAgICBydWxlcyB0byB0aGUgdmFsdWVzLlxuICogQHBhcmFtICB7ZnVuY3Rpb259IG9uRXZlcnkgICBmdW5jdGlvbiBydW5zIG9uIGV2ZXJ5IHByb3BlcnR5IHZhbGlkYXRpb24uIFxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICBPYmplY3QgY29udGFpbnMgZXJyb3JzIGFuZCBwYXNzZWQgZnVuY3Rpb25zLlxuICovXG5sYXJhanNWYWxpZGF0b3IuY2xhc3MgPSBmdW5jdGlvbiAodmFsdWVzLCBydWxlcywgb25FdmVyeSkge1xuICB0aGlzLnVzZXJWYWx1ZXMgPSB2YWx1ZXM7XG4gIHRoaXMudXNlclJ1bGVzID0gcnVsZXMgfHwge307XG4gIHRoaXMuT25FdmVyeSA9IG9uRXZlcnk7XG4gIHRoaXMuZXJyb3JzID0gW107XG59O1xuXG5sYXJhanNWYWxpZGF0b3IuY2xhc3MucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhc3NlZDogdGhpcy5wYXNzZWQsXG4gICAgICBlcnJvcnM6IHRoaXMuZXJyb3JzXG4gICAgfTtcbiAgfSxcbiAgcGFzc2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGgucGFzc2VkKHRoaXMuZXJyb3JzKTtcbiAgfSxcblxuICB2YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZXMgPSB0aGlzLnVzZXJWYWx1ZXM7XG4gICAgdmFyIHJ1bGVzID0gdGhpcy51c2VyUnVsZXM7XG5cbiAgICBmb3IgKHZhciB2YWx1ZSBpbiB2YWx1ZXMpIHtcbiAgICAgIHZhciBwcm9wTmFtZSA9IHZhbHVlLFxuICAgICAgICBwcm9wID0gdmFsdWVzW3Byb3BOYW1lXSxcbiAgICAgICAgcnVsZXNTdHJpbmcgPSBydWxlc1twcm9wTmFtZV0sXG4gICAgICAgIHJ1bGUgPSBoLnNwbGl0QnlTZXBhcnRvcihydWxlc1N0cmluZyksXG4gICAgICAgIHJ1bGVFcnJvcnMgPSBbXTtcblxuICAgICAgLy8gaWYgdGhlIHZhbHVlcyBhcmUgc2V0dGVyLWdldHRlclxuICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcHJvcCA9IHByb3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJ1bGUpIHtcbiAgICAgICAgcnVsZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIHZhciBvbmVSdWxlID0gaC5zcGxpdEJ5Q29sb24odmFsdWUpLFxuICAgICAgICAgICAgb25lUnVsZU5hbWUgPSBvbmVSdWxlWzBdLFxuICAgICAgICAgICAgb25lUnVsZVZhbHVlID0gb25lUnVsZVsxXSB8fCAnJyxcbiAgICAgICAgICAgIHZhbGlkYXRvciA9IHJ1bGVzQ29udHJvbGxlci5ydWxlc1tvbmVSdWxlTmFtZV0gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdmFsaWRhdGlvblN0YXR1cztcblxuICAgICAgICAgIGlmICh2YWxpZGF0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgICdUaGVyZSBpcyBubyBydWxlIHRvIFwiJyArIG9uZVJ1bGVOYW1lICsgJ1wiJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG9uZVJ1bGVWYWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0dXMgPSB2YWxpZGF0b3IocHJvcCwgdmFsdWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWxpZGF0aW9uU3RhdHVzID0gdmFsaWRhdG9yKHByb3AsIG9uZVJ1bGVWYWx1ZSwgdmFsdWVzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXZhbGlkYXRpb25TdGF0dXMpIHtcbiAgICAgICAgICAgIHJ1bGVFcnJvcnMucHVzaChwcm9wTmFtZSArICcuJyArIG9uZVJ1bGVOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLk9uRXZlcnkpIHtcbiAgICAgICAgICB0aGlzLk9uRXZlcnkocHJvcE5hbWUsIGgucGFzc2VkKHJ1bGVFcnJvcnMpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9ycyA9IHRoaXMuZXJyb3JzLmNvbmNhdChydWxlRXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGFyYWpzVmFsaWRhdG9yOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDaGVjayB0aGUgdHlwZSBvZiB0aGUgdmFsdWVcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHR5cGUgb2YgdGhlIGdpdmVuIHZhbHVlXG4gKi9cbnZhciBjaGVja1R5cGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIGlmIChpc05hTihwYXJzZUludCh2YWx1ZSkpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICdzdHJpbmdOdW1iZXInO1xuICAgIH1cbiAgICByZXR1cm4gJ3N0cmluZyc7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIGlmIChpc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiAnTmFOJztcbiAgICB9XG4gICAgcmV0dXJuICdudW1iZXInO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuICdib29sZWFuJztcbiAgfVxufTtcblxuZXhwb3J0cy5jaGVja1R5cGUgPSBjaGVja1R5cGU7XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgdmFsdWUgaXMgZW1wdHkgb3Igbm90LlxuICogQHBhcmFtICB7bWl4ZWR9IHZhbHVlICBhIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybiB7Ym9vbGVhbn0gICB0cnVlIGlmIHllcywgZmFsc2UgaWYgbm8uXG4gKi9cbnZhciBjaGVja0lmSGF2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcmV0dXJuZWQgPSBmYWxzZTtcbiAgaWYgKGNoZWNrVHlwZSh2YWx1ZSkgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfWVsc2UgaWYgKE9iamVjdC5rZXlzKHZhbHVlKVxuICAgICAgLmxlbmd0aCkge1xuICAgICAgcmV0dXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChjaGVja1R5cGUodmFsdWUpID09PSAnYXJyYXknKSB7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0dXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChjaGVja1R5cGUodmFsdWUpID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGVsc2Uge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcmV0dXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0dXJuZWQ7XG59O1xuXG5leHBvcnRzLmNoZWNrSWZIYXZlID0gY2hlY2tJZkhhdmU7XG5cbi8qKlxuICogQ2hlY2sgaWYgZXJyb3JzIGFycmF5IGlzIGVtcHR5IG9yIG5vdC5cbiAqIEBwYXJhbSAge2FycmF5fSBlcnJvcnNBcnJheSAgZXJyb3JzIGFycmF5LlxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICB0cnVlIGlmIGhhcywgZmFsc2UgaWYgbm90LlxuICovXG52YXIgcGFzc2VkID0gZnVuY3Rpb24gKGVycm9yc0FycmF5KSB7XG4gIGlmIChlcnJvcnNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydHMucGFzc2VkID0gcGFzc2VkO1xuXG4vKipcbiAqIFNwbGl0IHRoZSB2YWx1ZSBieSBDb2xvblxuICogQHBhcmFtICB7c3RyaW5nfSB2YWxpZGF0ZVJ1bGUgc3RyaW5nIHRvIHNwbGl0LlxuICogQHJldHVybiB7YXJyYXl9ICAgICAgICAgICAgICAgYW4gYXJyYXkgdGhhdCBoYXZlIDIgdmFsdWVzLCBydWxlTmFtZSBhbmQgcnVsZVZhbHVlIFxuICovXG52YXIgc3BsaXRCeUNvbG9uID0gZnVuY3Rpb24gKHZhbGlkYXRlUnVsZSkge1xuICB2YXIgc3BsaXR0ZWQgPSB2YWxpZGF0ZVJ1bGUuc3BsaXQoJzonKTtcbiAgcmV0dXJuIHNwbGl0dGVkO1xufTtcblxuZXhwb3J0cy5zcGxpdEJ5Q29sb24gPSBzcGxpdEJ5Q29sb247XG5cbi8qKlxuICogW3NwbGl0QnlTZXBhcnRvciBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gdmFsdWUgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbnZhciBzcGxpdEJ5U2VwYXJ0b3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICB2YXIgc3BsaXR0ZWQgPSB2YWx1ZS5zcGxpdCgnfCcpO1xuICByZXR1cm4gc3BsaXR0ZWQ7XG59O1xuXG5leHBvcnRzLnNwbGl0QnlTZXBhcnRvciA9IHNwbGl0QnlTZXBhcnRvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlZ2V4ID0ge307XG5cblJlZ2V4LmFscGhhID0gL15bYS16QS1aXSokLztcblxuUmVnZXguYWxwaGFfbnVtID0gL15bYS16QS1aMC05XSokLztcblxuUmVnZXguYWxwaGFfZGFzaCA9IC9eW2EtekEtWl8tXSokLztcblxuUmVnZXguZW1haWwgPSAvXltcXHctXFwuXStAKFtcXHctXStcXC4pK1tcXHctXXsyLDR9JC87XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWdleDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ1aWx0SW5SdWxlcyA9IHJlcXVpcmUoJy4vYnVpbHRJblJ1bGVzJyk7XG5cbnZhciBSdWxlc0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMucnVsZXMgPSBidWlsdEluUnVsZXM7XG59O1xuXG52YXIgX3J1bGVzUHJvdG8gPSBSdWxlc0NvbnRyb2xsZXIucHJvdG90eXBlO1xuXG4vKipcbiAqIEFkZCBuZXcgcnVsZSB0byB1c2UgaW4gdmFsaWRhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IHJ1bGVOYW1lICAgICBSdWxlIG5hbWUsIHdoaWNoIHdpbGwgYmUgdXNlZCBpbiBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJ1bGVGdW5jdGlvbiBSdWxlIGZ1bmN0aW9uIHRha2VzIDMgYXJndW1lbnRzICh2YWx1ZSwgcnVsZVZhbHVlLCB2YWx1ZXNPYmplY3QpXG4gKi9cbl9ydWxlc1Byb3RvLmFkZFJ1bGUgPSBmdW5jdGlvbiAocnVsZU5hbWUsIHJ1bGVGdW5jdGlvbikge1xuICBpZiAoIXRoaXMucnVsZXNbcnVsZU5hbWVdKSB7XG4gICAgdGhpcy5ydWxlc1tydWxlTmFtZV0gPSBydWxlRnVuY3Rpb247XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoJ1lvdVxcJ3JlIG92ZXJyaWRpbmcgYSBidWlsdC1pbiBydWxlLCB1c2Ugb3ZlcnJpZGVSdWxlIG1ldGhvZC4nKTtcbiAgfVxuXG59O1xuXG4vKipcbiAqIE92cnJpZGUgUnVsZSB0byB1c2UgaW4gdmFsaWRhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IHJ1bGVOYW1lICAgICBSdWxlIG5hbWUsIHdoaWNoIHdpbGwgYmUgdXNlZCBpbiBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJ1bGVGdW5jdGlvbiBSdWxlIGZ1bmN0aW9uIHRha2VzIDMgYXJndW1lbnRzICh2YWx1ZSwgcnVsZVZhbHVlLCB2YWx1ZXNPYmplY3QpXG4gKi9cbl9ydWxlc1Byb3RvLm92ZXJyaWRlUnVsZSA9IGZ1bmN0aW9uIChydWxlTmFtZSwgcnVsZUZ1bmN0aW9uKSB7XG4gIHRoaXMucnVsZXNbcnVsZU5hbWVdID0gcnVsZUZ1bmN0aW9uO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSdWxlc0NvbnRyb2xsZXI7XG4iXX0=
(2)
});
