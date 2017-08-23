import slugify from 'slugify'
import uniq from 'lodash/uniq'

export function getAllTags (pages) {
    return uniq([].concat(...pages.map(page => getTags(page).map(tagMap)))).sort()
  }

  export function getTags (page) {
    return page.data.tags || []
  }

  export function tagMap (tag) {
  return slugify(tag).toLowerCase()
}