const StringUtil = {
  normalizeForSearch: x => x.toLowerCase().replaceAll(/\s/g, ''),

  keywordSearch: items => keyword => {
    const normKeyword = StringUtil.normalizeForSearch(keyword)
    return items.filter(item => StringUtil.normalizeForSearch(item.name).includes(normKeyword))
  },

  wordsFromSpaced(s) {
    return s.replace(/[^\w\s]/, '').split(/\s+/).map(x => x.toLowerCase())
  },

  wordsToSpaced: words => words.join(' '),
  wordsToKebab: words => words.join('-'),
  wordsToSnake: words => words.join('_'),

  wordsToLowerCamel(words) {
    return words.map((word, i) =>
      i !== 0
        ? word.substring(0, 1).toUpperCase() + word.substring(1)
        : word
    ).join('')
  },

  toLowerCamel(s) {
    return StringUtil.wordsToLowerCamel(StringUtil.wordsFromSpaced(s))
  },
}

export default StringUtil
