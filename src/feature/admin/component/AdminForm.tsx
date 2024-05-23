import {BlueLink} from '@/feature/shared/component/Link'

export const AdminOnlyText = ({isAdmin, ...rest}) =>
  isAdmin ? (
    <span {...rest}>(This field can only be modified by site admins.)</span>
  ) : (
    <span {...rest}>
      Please <BlueLink href="/help/contact">contact us</BlueLink> if you wish to
      change this.
    </span>
  )
