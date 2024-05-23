import {getRootPageRouteItem} from '@/feature/admin/util/RootPage.js'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@/feature/admin/util/Main.jsx'
import {populate, truncateUser, truncateData, assignAdmin} from '@feature/admin/dev/FormAction.js'
import {TestingToolsSection} from '@feature/admin/dev/Pane.jsx'

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
