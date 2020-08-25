class AwesomeError extends Error {

  constructor (message, description, code) {
    super(message);
    this.message = typeof message === 'object' ? message.message : message;
    this.description = description;
    this.code = code;
  }

  toString () {
    return `AwesomeError: ${this.message} ${this.description ? `(${this.description})` : ''}`;
  }

}

const types = {
  NOT_FOUND: {
    message: 'Object not found',
    code: 404
  },
  DUPLICATE_ENTRY: {
    message: 'Duplicate entry',
    code: 403
  },
  INVALID_REQUEST: {
    message: 'Invalid request',
    code: 400
  }
}

module.exports = AwesomeError;
module.exports.types = types;
