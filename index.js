/**
 * JS Validator
 * Awesome values validator inspired by Laravel Validator.
 * @author Araby Alhomsi
 * @version 0.0.1
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

})('JSValidator', this, function(){

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
   * Split the value by :
   * @param  {string} validateRule string to split.
   * @return {array}               an array that have 2 values, ruleName and ruleValue 
   */
  function validateSplitter(validateRule) {
    var splitted = validateRule.split(':');
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
    type: checkType
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
  function checkRequired(value, rule) {
  	if (rule) {
  		var status = _checkIfHave(value);
  		return status;
  	}
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
   * Validator function
   * @param  {object}   values    object have the values and their names.
   * @param  {object}   rules     rules to the values.
   * @param  {function} onEvery   function runs on every property validation. 
   * @return {object}             Object contains errors and passed functions.
   */
  return function(values, rules, onEvery){
    var values = values,
        rules = rules,
        onEvery = onEvery,
        errors = [];

    for (value in values) {
      var propName = value;
      var prop = values[propName];
      var rule = rules[propName];

      if (rule) {
	      rule.forEach(function(value){
	        var oneRule = validateSplitter(value);
	        var oneRuleName = oneRule[0];
	        var oneRuleValue = oneRule[1];
	        var validator = registredValidators[oneRuleName] || undefined;
	        
	        if (validator == undefined) throw Error ('There is no rule to "' + oneRuleName + '"');
	        if (oneRuleValue == '') throw Error ('You should set value for ' + oneRuleName);

	        var validationStatus = validator(prop, oneRuleValue);
	        
	        if (onEvery) onEvery(propName, validationStatus);

	        if (!validationStatus) {
	          errors.push(propName + '.' + oneRuleName);
	        }
	      });
      }

    }

    return {
      passed: passed.bind(null, errors),
      errors: errors
    };
  };
});