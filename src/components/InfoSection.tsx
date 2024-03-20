import './InfoSection.css'

export const None = () =>
  <span className="text-gray-400">(none)</span>

export const Unknown = () =>
  <span className="text-gray-400">(unknown)</span>

export const Empty = () =>
  <p className="text-gray-400 italic text-center my-2">Empty</p>

export const NoResults = () =>
  <p className="text-gray-400 italic text-center my-2">No results</p>

export const InfoSection = ({children}) =>
  <section className="InfoSection">
    {children}
  </section>

