import ArrayUtil from '@util/ArrayUtil'
import cityData from './cityData'
import StringUtil from '@util/StringUtil'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword')
  for (const x of cityData) {
    x.name = `${x.tags.name}, Oklahoma`
    x.normName = StringUtil.normalizeForSearch(x.name)
  }

  const items = runSearch(cityData, keyword)
  return Response.json(items)
}

const runSearch = (cityData, keyword) => {
  const normKeyword = StringUtil.normalizeForSearch(keyword)

  const computeRelevance = x => {
    let relevance = 0
    const loc = x.normName.indexOf(normKeyword)
    if (loc < x.normName.length - 8) {
      relevance += 3
    }
    if (loc === 0) {
      relevance += 3
    }
    relevance += (2 * normKeyword.length) / x.normName.length
    relevance += Math.log10(+x.tags.population || 0)
    return relevance
  }

  const xs = cityData.filter(x => x.normName.includes(normKeyword))

  for (const x of xs) {
    x.relevance = computeRelevance(x)
  }
  ArrayUtil.sortInPlaceBy(xs, x => -x.relevance)

  return xs.slice(0, 10).map(x => ({
    name: x.name,
    latLon: [x.lat, x.lon],
  }))
}
