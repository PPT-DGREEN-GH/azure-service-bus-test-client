const { check } = require('express-validator')

const validateConnectionString = [
  check('connectionString')
    .contains('Endpoint=sb://')
    .withMessage('Connection string Endpoint missing')
    .contains(';SharedAccessKeyName=')
    .withMessage('Connection string SharedAccessKeyName missing')
    .contains(';SharedAccessKey=')
    .withMessage('Connection string SharedAccessKey missing')
    .trim(),
]

const validateAddress = [
  check('address').isLength({ min: 1 })
    .withMessage('Invalid queue/topic')
    .trim(),
]

const validateMessage = [
  check('message')
    .custom((value, { req }) => {
      if (req.body.format === 'json') {
        try {
          JSON.parse(value)
          return true
        } catch (e) {
          throw new Error('Invalid JSON message')
        }
      }
      return true
    })
    .trim(),
]

const validateSend = [].concat(validateConnectionString, validateAddress, validateMessage)
const validateReceive = [].concat(validateConnectionString, validateAddress)

module.exports = {
  validateSend,
  validateReceive,
}
