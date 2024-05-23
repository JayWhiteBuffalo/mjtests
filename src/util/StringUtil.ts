import type {TypeaheadItem} from '@/state/TypeaheadStore'

const StringUtil = {
  normalizeForSearch: (x: string) => x.toLowerCase().replaceAll(/\s/g, ''),

  keywordSearch: (items: TypeaheadItem[]) => (keyword: string) => {
    const normKeyword = StringUtil.normalizeForSearch(keyword)
    return items.filter(item =>
      StringUtil.normalizeForSearch(item.name).includes(normKeyword),
    )
  },

  wordsFromSpaced(s: string) {
    return s
      .replace(/[^\w\s]/, '')
      .split(/\s+/)
      .map((x: string) => x.toLowerCase())
  },

  wordsToSpaced: (words: string[]) => words.join(' '),
  wordsToKebab: (words: string[]) => words.join('-'),
  wordsToSnake: (words: string[]) => words.join('_'),

  wordsToLowerCamel(words: string[]) {
    return words
      .map((word: string, i: number) =>
        i !== 0 ? word.substring(0, 1).toUpperCase() + word.substring(1) : word,
      )
      .join('')
  },

  toLowerCamel(s: string) {
    return StringUtil.wordsToLowerCamel(StringUtil.wordsFromSpaced(s))
  },

  orEmpty: (x: string | null | undefined): string =>
    x != null ? String(x) : '',

  unempty: (x: string): string | undefined => {
    x = x.trim()
    return x !== '' ? x : undefined
  },
}

export default StringUtil
