var larajsValidator = require('../../../dist/larajsValidator');
var rules = require('../../../src/builtInRules');

describe('Rule: required', function () {
  it('must be `true` when the value is a non-empty string', function () {
    var status = rules.required('string');
    expect(status)
      .toBe(true);
  });

  it('must be `false` when the value is an empty string', function () {
    var status = rules.required('');
    expect(status)
      .toBe(false);
  });

  it('must be `true` when the value is a non-empty object', function () {
    var status = rules.required({
      a: 'a'
    });
    expect(status)
      .toBe(true);
  });

  it('must be `false` when the value is an empty object', function () {
    var status = rules.required({});
    expect(status)
      .toBe(false);
  });

  it('must be `true` when the value is a non-empty array', function () {
    var status = rules.required(['value', 1]);
    expect(status)
      .toBe(true);
  });

  it('must be `false` when the value is an empty array', function () {
    var status = rules.required([]);
    expect(status)
      .toBe(false);
  });

  it('must be `true` when the value is a number', function () {
    var status = rules.required(1);
    expect(status)
      .toBe(true);
  });

  it('must be `true` when the value is 0', function () {
    var status = rules.required(0);
    expect(status)
      .toBe(true);
  });

  it('must be `false` when the value is undefined', function () {
    var status = rules.required(undefined);
    expect(status)
      .toBe(false);
  });

  it('must be `false` when the value is null', function () {
    var status = rules.required(null);
    expect(status)
      .toBe(false);
  });

});

describe('validation with required', function () {
  var validation,
    values = {
      username: 'arabyalhomsi'
    },
    rules = {
      username: 'required'
    };

  beforeEach(function () {
    validation = larajsValidator(values, rules);
  });

  it('must pass when the value is `arabyalhomsi`', function () {
    expect(validation.passed()).toBe(true);
  });
});