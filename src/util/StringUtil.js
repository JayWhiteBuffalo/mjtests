const StringUtil = {
  normalizeForSearch: x => x.toLowerCase().replaceAll(/\s/g, ''),

  keywordSearch: items => keyword => {
    const normKeyword = StringUtil.normalizeForSearch(keyword)
    return items.filter(item => StringUtil.normalizeForSearch(item.name).includes(normKeyword))
  },

  toLowerCamelCase(x) {
    const words = x.replace(/[^\w\s]/, '').split(/\s+/)
    return words.map((word, i) => 
      (i !== 0 ? word.substring(0, 1).toUpperCase() : word.substring(0, 1).toLowerCase())
        + word.substring(1).toLowerCase()
    ).join('')
  },
}

export default StringUtil
