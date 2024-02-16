import {BlueLink} from '@components/Link'
import {FieldDesc} from '@components/Form'

export const AdminOnlyFieldDesc = ({isAdmin, ...rest}) =>
  isAdmin
    ? <FieldDesc {...rest}>
        (This field can only be modified by site admins.)
      </FieldDesc>
    : <FieldDesc {...rest}>
        Please <BlueLink href="/help/contact">contact us</BlueLink> if you wish to change this.
      </FieldDesc>
