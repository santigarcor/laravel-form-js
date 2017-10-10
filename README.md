# Laravel Form Javascript Object

This is a package for handling forms using an object oriented approach.

## Installation
In your console run:
```bash
  # Using npm
  npm install laravel-form-js

  # Using yarn
  yarn add laravel-form-js
```

## Usage
Example using Vue
```javascript
<template>
  <form @submit.prevent="submit">
    <input type="text" name="name" v-model="form.name">
    <div v-text="form.errorsFor('name')"></div>

    <input type="text" name="email" v-model="form.email">
    <div v-text="form.errorsFor('email')"></div>
  </form>
</template>
<script>
let Form = require('laravel-form-js');
export default {
  props: {
    url: { type: String, required: true },
    method: { type: String, required: true },
    user: {
      default() {
        return {
          name: '',
          email: ''
        };
      }
    }
  },
  data() {
    return {
      form: Form.makeFrom(this.user, this.method) // If no method is given, the default is post.
    }
  },
  methods: {
    submit() {
      this.form.submit(this.url)
        .then(response => {
        })
        .catch(error => {
          // If it gets here, and there are validation errors, they are automatically set for the form.
        });
    }
  }
}

</script>
```

### Note
This library works with the validation of laravel >= 5.5, because now the errors are given like this:

```javascript
{
  errors: {
    name: [],
    email: []
  }
}

```
## Creating a form
There are two ways to create a new form:

```javascript
Form.makeFrom(data, method = 'post', clearAfterResponse = false);
// Or
new Form(data, method = 'post', clearAfterResponse = false);
```

## Available Methods

The methods you can call from the form object are:

- `form.data(dataType)`: Get the form data in a given format. Supported data types: `json`, `form-data`;
- `form.errorsFor(field)`: Return the errors for the given field. If there are not errors it returns `null`.
- `form.setMethod(method)`: Change the form method. Supported methods: `post`, `put`, `patch`.
- `form.submit(url, dataType = 'form-data')`: Submit the form to the given url using the form method and passing the data in the given type. Supported data types: `json`, `form-data`;
- `form.reset()`: Reset the form to the original data.
