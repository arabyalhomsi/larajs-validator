var larajsValidator = require('../../dist/larajsValidator');

var rules = {
  user: 'required',
  age: 'type:number'
};

describe('validation with correct values', function () {
  var validation,
    values = {
      user: 'arabyalhomsi',
      age: 16
    };

  beforeEach(function () {
    validation = larajsValidator(values, rules);
  });

  it('must return an object', function () {
    expect(typeof validation)
      .toBe('object');
  });

  it('must have passed function and passed() must be true', function () {
    expect(validation.passed())
      .toBe(true);
  });

  it('must have an empty errors array when validation passed', function () {
    expect(validation.errors.length)
      .toBe(0);
  });
});

describe('validation with incorrect values', function () {
  var validation,
    values = {
      user: '',
      age: '16'
    };

  beforeEach(function () {
    validation = larajsValidator(values, rules);
  });

  it('must return an object', function () {
    expect(typeof validation)
      .toBe('object');
  });

  it('must have passed function and passed() must be false', function () {
    expect(validation.passed())
      .toBe(false);
  });

  it('must have an non-empty errors array when validation passed', function () {
    expect(validation.errors.length)
      .not.toBe(0);
  });
});