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
