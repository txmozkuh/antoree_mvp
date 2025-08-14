export type SuccessReponse<T> = {
  status: 'success'
  message: string
  data?: T
}

export type FailureRespose = {
  status: 'error'
  message: string
}
