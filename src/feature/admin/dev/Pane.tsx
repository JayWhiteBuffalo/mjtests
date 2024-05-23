'use client'
import {Button} from '@nextui-org/react'
import {InfoSection} from '@/feature/shared/component/InfoSection'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

const DevActionButton = ({action, children, ...rest}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Button
      isLoading={isLoading}
      onPress={async () => {
        setIsLoading(true)
        try {
          await action()
        } finally {
          setIsLoading(false)
        }
        router.refresh()
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}

export const TestingToolsSection = ({
  populate,
  truncateUser,
  truncateData,
  assignAdmin,
}) => (
  <InfoSection>
    <header>
      <h2>Testing tools</h2>
    </header>
    <div
      className="grid gap-x-2 gap-y-4 items-center"
      style={{
        gridTemplateColumns: '300px auto',
      }}
    >
      <div>
        <DevActionButton action={populate}>
          Populate database with test data
        </DevActionButton>
      </div>
      <p>
        Fills the database with test data from <code>src/test/testData.js</code>
      </p>

      <div>
        <DevActionButton action={assignAdmin}>Make me admin</DevActionButton>
      </div>
      <p>Assigns the admin role to the currently logged in user</p>

      <div>
        <DevActionButton action={truncateData}>
          Truncate Data Tables
        </DevActionButton>
      </div>
      <p>Wipes the product, vendor, producer, and imageRef tables</p>

      <div>
        <DevActionButton action={truncateUser}>
          Truncate User Tables
        </DevActionButton>
      </div>
      <p>Wipes the user, account, and session tables</p>
    </div>
  </InfoSection>
)
