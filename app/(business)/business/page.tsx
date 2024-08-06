import clsx from 'clsx'
import Link from 'next/link'
import {Button} from '@nextui-org/react'

export const Card = ({children}) => (
  <section
    className={clsx(
      'rounded-xl bg-slate-200 border-gray-500 border',
      'w-2/5 h-full *:p-6 flex flex-col items-center justify-center',
    )}
  >
    {children}
  </section>
)

const Page = async () => (
  <main className="flex flex-col items-center justify-center h-screen bg-slate-100">
    <div className="my-8">
      <span className="text-xl font-bold">Sell with us!</span>
    </div>
    <div className="flex gap-12 flex-row flex-wrap items-center justify-center">
      <Card>
        <header>
          <h2 className="font-bold">For Dispensaries</h2>
        </header>
        <ul className="flex-1 list-disc ml-4 my-4 space-y-2 ">
          <li>
            Differentiate your products from your competitors with the test
            results of your products!
          </li>
          <li>
            Compare your product pricing against your competitors based on the
            test results, not just the strain name!
          </li>
          <li>Find producers to purchase your stock from!</li>
        </ul>

        <Link href="/admin/apply/vendor">
          <Button className="w-full" color="secondary">
            Apply as dispensary
          </Button>
        </Link>
      </Card>

      <Card>
        <header>
          <h2 className="font-bold">For Producers</h2>
        </header>
        <ul className="flex-1 list-disc ml-4 my-4 space-y-2">
          <li>
            Advertise your marijuana-related produce to the dispensaries,
            reducing the time &amp; hassle of finding dispensaries to sell your
            produce to at every harvest.
          </li>
          <li>
            Compare your produces&apos; test results &amp; pricing against other
            producers.
          </li>
        </ul>

        <Link href="/admin/apply/producer">
          <Button className="w-full" color="secondary">
            Apply as producer
          </Button>
        </Link>
      </Card>
    </div>
  </main>
)

export default Page
