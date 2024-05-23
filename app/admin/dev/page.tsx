import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {populate, truncateUser, truncateData, assignAdmin} from '@feature/admin/dev/FormAction'
import {TestingToolsSection} from '@feature/admin/dev/Pane'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('dev'),
]

const Page = async () => (
  <div className="px-8">
    <TestingToolsSection
      assignAdmin={assignAdmin}
      populate={populate}
      truncateData={truncateData}
      truncateUser={truncateUser}
    />
  </div>
)

export default makeMain({Page, getRoute})
