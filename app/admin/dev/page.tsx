import {getRootPageRouteItem} from '@app/admin/RootPage'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@app/admin/Main'
import {populate, truncateUser, truncateData, assignAdmin} from './FormAction'
import {TestingToolsSection} from './Pane'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('dev'),
]

const Page = async ({}) =>
  <div className="px-8">
    <TestingToolsSection
      assignAdmin={assignAdmin}
      populate={populate}
      truncateData={truncateData}
      truncateUser={truncateUser}
    />
  </div>

export default makeMain({Page, getRoute})
