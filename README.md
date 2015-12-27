# JS-Validator
JS Validator inspired by Laravel Validator.

## Installation
### html
```
<script src="larajs-validator.js"></script>
```
### via NPM
```
npm i larajs-validator
```

## how to use

### Sample Example
``` js

var jsvalidator = require('larajs-validator');

// Our Values
var values = {
  username: 'arabyalhomsi',
  age: 18,
  skills: ['CSS3', 'JavaScript', 'HTML5'],
  email: 'araby.ami@gmail.com'
};

// Rules
var rules = {
  username: 'required|min:3|max:12|alpha',
  age: 'required|min:3|max:20|type:number',
  skills: 'min:2|max:5|type:array',
  email: 'required|same:araby.ami@gmail.com'
};

var validation = jsvalidator(values, rules);
console.log(validation.passed()); // -> true or false.
console.log(validation.errors); // -> all errors.
```

### Callback Example

```js

var jsvalidator = require('larajs-validator');

// Our Values
var values = {
  username: 'arabyalhomsi',
  age: 18
};

// Rules
var rules = {
  username: 'required|min:3|max:12',
  age: 'required|min:3|max:20'
};

var validation = jsvalidator(values, rules,{} , function (propName, status) {
   console.log(
   propName, // property name (ex: username)
   status // if the validation fails `false` if success `true`
   );
});

```

### Validation with Mithril framework example
When using Mithril framework, sometimes you need to make validation to some values, so this is a prefered way, I use.

```js
var m = require('mithril');
var jsvalidator = require('larajs-validator');

var HomeComponent = {
  controller: function(args) {
    var ctrl = this;
    // your values
    ctrl.values = {
      username: m.prop(),
      email: m.prop(),
      job: m.prop(),
    };
    ctrl.errors = m.prop([]);
    // your validation setter-getters, will be true when the validation success
    // and false when not.
    ctrl.validation = {
      username: m.prop(),
      email: m.prop(),
      job: m.prop(),
    };
    var rules = {
      username: 'required|alpha_dash|min:3|max:250',
      email: 'required|email',
      job: 'required|min:3',
    };
    ctrl.validate = function() {
      var validation = jsvalidator(ctrl.values, rules, {
        setget: true
      }, function(propName, success) {
        if (success) {
          ctrl.validation[propName](false);
        }else {
          ctrl.validation[propName](true);
        }
      });
      return validation;
    };
    ctrl.submit = function(e) {
      e.preventDefault();
      var validation = ctrl.validate();
      if (validation.passed()) {
        ctrl.errors([]);
        alert('success');
      } else {
        ctrl.errors(validation.errors);
      }
    };
  },
  view: function(ctrl, args) {
    return m('div', [
      m('input', {
        type: 'text',
        onchange: m.withAttr('value', ctrl.values.username),
        style: 'border-color:'+ (ctrl.validation.username() ? 'red' : '') 
      }),
      m('br'),
      m('input', {
        type: 'text',
        onchange: m.withAttr('value', ctrl.values.email),
        style: 'border-color:'+ (ctrl.validation.email() ? 'red' : '') 
      }),
      m('br'),
      m('input', {
        type: 'text',
        onchange: m.withAttr('value', ctrl.values.job),
        style: 'border-color:'+ (ctrl.validation.job() ? 'red' : '') 
      }),
      m('br'),
      m('button', {
        onclick: ctrl.submit
      }, 'submit'),
      m('div', [
        ctrl.errors().map(function(val) {
          return m('p', {
            style: 'color:red'
          }, val)
        })
      ])
    ]);
  }
};
m.mount(document.body, HomeComponent);

```

## Validation Rules
- <code>min:[value]</code>: Must be the same or above [value]
- <code>max:[value]</code>: Must be the same or under [value]
- <code>same:[value]</code>: Must be the same as [value]
- <code>type:[value]</code>: Must be the same as type (string, number, array, object, boolean)
- <code>sameAttr:[attribute]</code>: Must equals to [attribute]'s value.  
- <code>required</code>: Must be non-empty and existed.
- <code>alpha</code>: Must be entirely alphabetic characters.
- <code>alpha_num</code>: Must be entirely alpha-numeric characters.
- <code>alpha_dash</code>: May have alpha-numeric, dashes, and underscores.
- <code>email</code>: Must be an email.


## Contribution guide (soon)

## Todo
1. Complete Validation Rules.
2. Errors System.
3. Add Custom Validation Rule.
4. Testing.
