let FormErrors = require('./FormErrors');
let RequestDataContainer = require('./RequestDataContainer');

/**
* this class handles everything that concerns
* about forms. Submit and errors and considered too
*/
class Form {

  /**
   * Set up the form class setting the data properties
   * directly to the form properties
   *
   * @param  {Object}  data
   * @param  {Boolean} clearAfterResponse
   * @return {void}
   */
  constructor(data, method = 'post', clearAfterResponse = false) {
    this.originalData = data;
    Object.assign(this, data);
    this.method = method;
    this.clearAfterResponse = clearAfterResponse;
    this.errors = new FormErrors();

    if (window.axios == undefined) {
      this.axios = require('axios');
    } else {
      this.axios = window.axios;
    }
  }

  static makeFrom(data, method = 'post', clearAfterResponse = false) {
    return new this(data, method, clearAfterResponse);
  }

  /**
   * Reset the form data
   *
   * @return {void}
   */
  reset() {
    Object.assign(this, this.originalData);
    this.errors.clear();
  }

  /**
   * Return the form data
   *
   * @todo Add the option to choose between form data and plain object
   * @return {Object}
   */
  data(type) {
    let container = new RequestDataContainer(type);

    for (let field in this.originalData) {
      container.set(field, this[field]);
    }

    return container.data;
  }

  /**
   * Set the form method.
   *
   * @param {String} method
   */
  setMethod(method) {
    this.method = method;

    return this;
  }

  /**
   * Get the errors for a field.
   *
   * @param  {String} field
   * @return {String}
   */
  errorsFor(field) {
    return this.errors.get(field);
  }

  /**
   * Submit the form and return a promise
   *
   * @param  {string} url
   * @return {Promise}
   */
  submit(url, dataType = 'form-data') {
    let supportedMethods = ['post', 'put', 'patch'];

    if (supportedMethods.indexOf(this.method.toLowerCase()) == -1) {
      throw new Error('Unssuported method');
    }

    return new Promise((resolve, reject) => {
      this.axios[this.method](url, this.data(dataType))
        .then(response => {
          this.formSubmitSucceded(response);
          resolve(response);
        })
        .catch(error => {
          this.formSubmitFailed(error);
          reject(error);
        });
    });
  }

  /**
   * Perform actions after submition succeded
   *
   * @param  {Object} response
   * @return {void}
   */
  formSubmitSucceded(response) {
    if (this.clearAfterResponse) {
      this.reset();
    }
  }

  /**
   * Perform actions after submition failed
   *
   * @param  {Object} errors
   * @return {void}
   */
  formSubmitFailed(errors) {
    if (errors.response.status == 422) {
      this.errors.record(errors.response.data.errors);
    }
  }
}

module.exports = Form;
