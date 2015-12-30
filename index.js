/**
 * LaraJS Validator
 * Awesome values validator inspired by Laravel Validator.
 * @author Araby Alhomsi
 * @version 0.1.5
 * 
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Araby Alhomsi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(name, context, definition){
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    } else if (typeof define === 'function' && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }

})('jsvalidator', this, function(){

  // Regex
  var regex_alpha = /^[a-zA-Z]*$/;
  var regex_alpha_num = /^[a-zA-Z0-9]*$/;
  var regex_alpha_dash = /^[a-zA-Z_-]*$/;
  var regex_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  /**
   * Check the type of the value
   * @return {string} The type of the given value
   */
  function _checkType(value) {
    if (typeof value == 'object') {
      if (Array.isArray(value)) {
          return 'array';
        } else {
          return 'object'
      }
    } else if (typeof value == 'string') {
      if (isNaN(parseInt(value)) == false) {
        return 'number';
      }
      return 'string';
    } else if (typeof value == 'number') {
      if (isNaN(value)) {
        return 'NaN';
      }
      return 'number';
    } else if (typeof value == 'boolean') {
      return 'boolean';
    }
  }

  /**
   * Check whether the value is empty or not.
   * @param  {mixed} value 		a value to check.
   * @return {boolean}				true if yes, false if no.
   */
  function _checkIfHave(value) {
    var returned = false;
    if (_checkType(value) == 'object') {
        if (Object.keys(value).length) {
            returned = true;
        }
    }
    else if (_checkType(value) == 'array') {
        if (value.length != 0) {
          returned = true;
        }
    } 
    else {
        if (value) {
            returned = true;
        }
    }
    return returned;
  }
  /**
   * Check if errors array is empty or not.
   * @param  {array} errorsArray 	errors array.
   * @return {boolean}            true if has, false if not.
   */
  function passed(errorsArray) {
    if (errorsArray.length == 0) {
      return true;
    }else {
      return false;
    }
  }

  /**
   * Split the value by Colon
   * @param  {string} validateRule string to split.
   * @return {array}               an array that have 2 values, ruleName and ruleValue 
   */
  function splitByColon(validateRule) {
    var splitted = validateRule.split(':');
    return splitted;
  }

  function splitBySepartor(value) {
    var splitted = value.split('|');
    return splitted;
  }

  /**
   * A list with all validators.
   * @type {Object}
   */
	var registredValidators = {
		min: checkMin,
		max: checkMax,
		required: checkRequired,
		same: checkSame,
    type: checkType,
    alpha: checkAlpha,
    alpha_num: checkAlphaNum,
    alpha_dash: checkAlphaDash,
    email: checkEmail,
    sameAttr: checkSameAttr
	};

	/**
	 * Check if the value above the minimum 
	 * @param  {mixed} value 	the value that will be checked.
	 * @param  {number} rule  the rule.
	 * @return {boolean}
	 */
  function checkMin(value, rule) {
  	if (!value) return true;

  	switch(_checkType(value)) {
  		case 'string':
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
  			if (Object.keys(value).length >= rule) {
  				return true;
  			}
  		break;
  	}

  	return false;
  }

  /**
   * Check if the value under the maximum 
   * @param  {mixed} value 	the value that will be checked.
   * @param  {number} rule  the rule.
   * @return {boolean}
   */
  function checkMax(value, rule) {
  	if (!value) return true;

  	switch (_checkType(value)) {
  		case 'string':
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
  			if (Object.keys(value).length <= rule) {
  				return true;
  			}
  		break;
  	}
  	return false;
 	}

  /**
   * Check if the value existed
   * @param  {mixed} 	value 	the value that will be checked.
   * @param  {boolean} rule  the rule.
   * @return {boolean}
   */
  function checkRequired(value) {
  		var status = _checkIfHave(value);
  		return status;
  }

  /**
   * Check if the value is the same as the rule.
   * @param  {mixed} value the value that will be checked.
   * @param  {mixed} rule  the rule.
   * @return {boolean}
   */
  function checkSame (value, rule) {
  	if (value == rule) {
  		return true;
  	}

  	return false;
  }

  function checkType (value, rule) {
    var type = _checkType(value);
    if (type == rule) {
      return true;
    }

    return false;
  }

  /**
   * [checkSameAttr description]
   * @param  {[type]} value        [description]
   * @param  {[type]} rule         [description]
   * @param  {[type]} valuesObject [description]
   * @return {[type]}              [description]
   */
  function checkSameAttr(value, rule, valuesObject) {
    var valueToC = valuesObject[rule];
    
    // if is setter-getter
    if(typeof valueToC == 'function') {
      valueToC = valueToC();
    }

    if (value === valueToC) {
      return true;
    }

    return false;
  }

  function checkAlpha(value) {
      var st = regex_alpha.test(value);
      return st;
  }

  function checkAlphaNum(value) {
      var st = regex_alpha_num.test(value);
      return st;
  }

  function checkAlphaDash(value) {
      var st = regex_alpha_dash.test(value);
      return st;
  }

  function checkEmail(value) {
    if (value) {
      var st = regex_email.test(value);
      return st;
    }
    return true;
  }

  /**
   * Validator function
   * @param  {object}   values    object have the values and their names.
   * @param  {object}   rules     rules to the values.
   * @param  {function} onEvery   function runs on every property validation. 
   * @return {object}             Object contains errors and passed functions.
   */
  return function(values, rules, options, onEvery){
    var values = values,
        rules = rules,
        options = options || {},
        onEvery = onEvery,
        errors = [];

    for (value in values) {
      var propName = value;
      var prop = values[propName];
      var rulesString = rules[propName];
      var rule = splitBySepartor(rulesString);
      var ruleErrors = [];
      
      // if the values are setter-getter
      if (options.setget == true) {
      	prop = prop();
      }
      
      if (rule) {
	      rule.forEach(function(value){
	        var oneRule = splitByColon(value);
	        var oneRuleName = oneRule[0];
	        var oneRuleValue = oneRule[1] || '';
	        var validator = registredValidators[oneRuleName] || undefined;
	        
          if (validator == undefined) throw Error ('There is no rule to "' + oneRuleName + '"');

	        if (oneRuleValue == '') {
            var validationStatus = validator(prop);
          }else {
            var validationStatus = validator(prop, oneRuleValue, values);
          }
	        
	        if (!validationStatus) {
	          ruleErrors.push(propName + '.' + oneRuleName);
	        }
        });

        if (onEvery) onEvery(propName, passed(ruleErrors));
        errors = errors.concat(ruleErrors);
      }
    };

    return {
      passed: passed.bind(null, errors),
      errors: errors
    };
  };
});
