import {BlueLink} from '@/feature/shared/component/Link'
import {UserStore} from '@/feature/admin/state/DataStore'
import {useFluxStore} from '@/state/Flux'

export const UserLinkContainer = ({userId}) => {
  useFluxStore(UserStore)
  const text = UserStore.getPresentById(userId)
    .then(user => `<${user.email}>`)
    .orElse(() => `<user:${userId}>`)
  return <BlueLink href={`/admin/users/${userId}`}>{text}</BlueLink>
}
