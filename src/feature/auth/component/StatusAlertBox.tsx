import {AlertBox} from '@/feature/shared/component/Form'

export type StatusKey = 'checkEmail' | 'success'
export type StatusAlertBoxProps = {
  status?: StatusKey
}

export const StatusAlertBox = ({status}: StatusAlertBoxProps) => {
  if (status === 'checkEmail') {
    return (
      <AlertBox color="success">
        <p className="mb-1">Account creation successful!</p>
        <p>Please check your email for further instructions</p>
      </AlertBox>
    )
  } else if (status === 'success') {
    return (
      <AlertBox color="success">
        <p>Account creation successful!</p>
      </AlertBox>
    )
  }
}
