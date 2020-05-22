class AwesomeError extends Error {

  constructor (message, description) {
    super(message);
    this.description = description;
  }

  toString () {
    return `AwesomeError: ${this.message} ${this.description ? `(${this.description})` : ''}`;
  }

}

const types = {
  NOT_FOUND: 'Object not found',
  DUPLICATE_ENTRY: 'Duplicate entry'
}

module.exports = AwesomeError;
module.exports.types = types;
