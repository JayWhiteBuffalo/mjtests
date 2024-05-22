export class JsonApiError extends Error {
  constructor(data, response) {
    super(`${response.status} ${response.statusText}`)
    this.data = data
    this.response = response
  }
}

export class TextApiError extends Error {
  constructor(text, response) {
    super(`${response.status} ${response.statusText}: ${text}`)
    this.text = text
    this.response = response
  }
}

export const jsonOnOk = async response => {
  if (response.ok) {
    return response.json()
  } else {
    if (response.headers.get('Content-Type') === 'application/json') {
      const data = await response.json()
      return Promise.reject(new JsonApiError(data, response))
    } else {
      const text = await response.text()
      return Promise.reject(new TextApiError(text, response))
    }
  }
}
