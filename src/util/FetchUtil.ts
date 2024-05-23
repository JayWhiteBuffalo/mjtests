export class JsonApiError extends Error {
  constructor(public data, public response: Response) {
    super(`${response.status} ${response.statusText}`)
  }
}

export class TextApiError extends Error {
  constructor(public text: string, public response: Response) {
    super(`${response.status} ${response.statusText}: ${text}`)
  }
}

export const jsonOnOk = async (response: Response) => {
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
