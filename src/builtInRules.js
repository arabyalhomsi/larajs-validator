'use strict';

var regex = require('./regex');
var h = require('./helpers');

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
