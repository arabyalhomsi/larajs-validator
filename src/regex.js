'use strict';

var Regex = {};

Regex.alpha = /^[a-zA-Z]*$/;

Regex.alpha_num = /^[a-zA-Z0-9]*$/;

Regex.alpha_dash = /^[a-zA-Z_-]*$/;

Regex.email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


module.exports = Regex;
