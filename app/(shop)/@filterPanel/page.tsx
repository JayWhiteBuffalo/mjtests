import { FilterPaneWrapper} from

export default async filterPanel = ({layout})=>{

    const Page = ({layout}) => (
        <AnimatedPane
          className={clsx(
            'FilterPaneWrapper flex-1',
            'flex flex-col relative transition-all items-center',
          )}
          open={layout.showFilterPane}
        >
          <FilterPaneContainer />
        </AnimatedPane>
      )

    return(
        (
    <main>

      <FilterPaneWrapper layout={layout} />

    </main>
  )
    )
 } 

