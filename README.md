# JS-Validator
JS Validator inspired by Laravel Validator.

## how to use

### Sample Example
``` js

// Our Values
var values = {
  username: 'arabyalhomsi',
  age: 18,
  skills: ['CSS3', 'JavaScript', 'HTML5'],
  email: 'araby.ami@gmail.com'
};

// Rules
var rules = {
  username: [
    'required:true',
    'min:3',
    'max:12',
  ],
  age: [
    'required:true'
    'min:3',
    'max: 20'
  ],
  skills: ['min:2', 'max:5'],
  email: ['required:true', 'same:araby.ami@gmail.com']
};

var validation = JSValidator(values, rules);
console.log(validation.passed()); // -> true or false.
console.log(validation.errors); // -> all errors.
```

### Callback Example

```js

// Our Values
var values = {
  username: 'arabyalhomsi',
  age: 18
};

// Rules
var rules = {
  username: [
    'required:true',
    'min:3',
    'max:12',
  ],
  age: [
    'required:true'
    'min:3',
    'type:number',
    'max: 20'
  ]
};

var validation = JSValidator(values, rules, function (propName, status) {
   console.log(
   propName, // property name (ex: username)
   status // if the validation fails `false` if success `true`
   );
});

```

## Validation Rules
- <code>min:[value]</code>: must be the same or above [value]
- <code>max:[value]</code>: must be the same or under [value]
- <code>same:[value]</code>: must be the same as [value]
- <code>required:true</code>: must be non-empty and existed.
- <code>type:[value]</code>: must be the same as type (string, number, array, object, boolean)

## Contribution guide (soon)

## Todo
1. Complete Validation Rules.
2. Errors System.
3. Add Custom Validation Rule.
