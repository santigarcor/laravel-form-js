/**
* this class handles the possible errors
* in a form
*/
export default class FormErrors {

  /**
   * Create an instance of formerrors
   * @return {void}
   */
  constructor() {
    this.errors = {};
  }

  /**
   * Check if the field exists in the errors
   *
   * @param  {String}  field
   * @return {Boolean}
   */
  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  /**
   * Return the error for the field
   *
   * @param  {String} field
   * @return {String}
   */
  get(field) {
    if (!this.has(field)) {
      return null;
    }

    return this.errors[field][0];
  }

  /**
   * Record new errors
   *
   * @param  {Object} errors
   * @return {void}
   */
  record(errors) {
    this.errors = errors;
  }

  /**
   * Clear error for specific field or for all errors
   *
   * @param  {String} field
   * @return {void}
   */
  clear(field) {
    if (!field) {
      this.errors = {};
      return;
    }

    delete this.errors[field];
  }

  /**
   * Check if there are any errors
   *
   * @return {Boolean}
   */
  any() {
    return Object.keys(this.errors).length > 0;
  }
}

module.exports = FormErrors;
