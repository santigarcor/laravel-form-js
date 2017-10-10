class RequestDataContainer {

  /**
   * Set up the class.
   *
   * @param  {String} type
   * @return {this}
   */
  constructor(type) {
    this.type = type;

    if (this.type == 'json') {
      this.data = {};
    } else if (this.type == 'form-data') {
      this.data = new FormData();
    } else {
      this.data = null;
    }
  }

  /**
   * Set a value in the respective key inside the data object.
   *
   * @param {String} key
   * @param {mixed} value
   */
  set(key, value) {
    if (this.type == 'json') {
      this.data[key] = value;
    } else if (this.type == 'form-data') {
      if (Array.isArray(value)) {
        value.forEach(element => {
          this.data.append(`${key}[]`, this.parseToFormData(element));
        });
      } else {
        this.data.append(key, this.parseToFormData(value));
      }
    }
  }

  /**
   * Parse the value to the FormData value type.
   *
   * @param  {mixed} value
   * @return {string}
   */
  parseToFormData(value) {
    if (typeof(value) === "boolean") {
      return value ? 1 : 0;
    }

    return  value == null ? '' : value;
  }
}

module.exports = RequestDataContainer;
