export const capitalize = (sequence: string) => {
  if (typeof sequence !== 'string') return ''
  return sequence.charAt(0).toUpperCase() + sequence.slice(1)
}

export const validateForm = (inputType: string, data: string) => {
  if(inputType === 'email') {
    const emailRegrex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!data) {
      return { status: true, message: 'Email is required' } 
    }
    if(!emailRegrex.test(data)) {
      return { status: true, message: 'Email is invalid' }
    } 
    else {
      return { status: false, message: '' }
    }
  }
  if(inputType === 'CA Port' || inputType === 'CouchDB Port') {
    if(!data) {
      return { status: true, message: `${capitalize(inputType)} is required` } 
    }
    if(data !== String(Number(data))) {
      return { status: true, message: `${capitalize(inputType)} must be number` }
    }
    if(parseInt(data) < 30001 || parseInt(data) > 32767) {
      return { status: true, message: `${capitalize(inputType)} must be between 30001 and 32627` }
    } 
    else {
      return { status: false, message: '' }
    }
  }
  if(inputType === 'Number Peer') {
    if(!data) {
      return { status: true, message: `${capitalize(inputType)} is required` } 
    }
    if(data !== String(Number(data))) {
      return { status: true, message: `${capitalize(inputType)} must be number` }
    }
    else {
      return { status: false, message: '' }
    }
  }
  else {
    if(!data) {
      return { status: true, message: `${capitalize(inputType)} is required` }
    }
    else {
      return { status: false, message: '' }
    }
  }
}