# LaraJS Validator
Awesome values validator inspired by Laravel Validator.

## Installation
### html
```
<script src="dist/larajsValidator.js"></script>
```
### via NPM
```
npm i larajs-validator
```

## how to use

### Sample Example

```js
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

var validation = larajsValidator(values, rules);
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
  username: 'required|min:3|max:12',
  age: 'required|min:3|max:20'
};

var validation = larajsValidator(values, rules, function (propName, status) {
   console.log(
   propName, // property name (ex: username)
   status // if the validation fails `false` if success `true`
   );
});

```

## Validation Rules
- <code>min:[value]</code>: Must be the same or above [value]
- <code>max:[value]</code>: Must be the same or under [value]
- <code>same:[value]</code>: Must be the same as [value]
- <code>type:[value]</code>: Must be the same as type (string, number, array, object, boolean)
- <code>sameAttr:[attribute]</code>: Must be the same as the value of [attribute]
- <code>required</code>: Must be non-empty and existed.
- <code>alpha</code>: Must be entirely alphabetic characters.
- <code>alpha_num</code>: Must be entirely alpha-numeric characters.
- <code>alpha_dash</code>: May have alpha-numeric, dashes, and underscores.
- <code>email</code>: Must be an email.


## Contribution guide (soon)

## Todo
1. Complete Validation Rules.
2. Errors System.
