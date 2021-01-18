const { badRequest, serverError, notFound } = require('../utils/messageCode')

const commonError = (res, err) => {
  if (/must not be/.test(err.message) || /must be/.test(err.message)) return handleStatus(res, badRequest(err.message))
  if (/not found/.test(err.message)) return handleStatus(res, notFound(err.message))

  return handleStatus(res, serverError(err.message))
}

const handleStatus = (res, message) => {
  return res.status(message.code).json(message.data)
}

module.exports = {
  commonError,
  handleStatus
}