import uniq from 'lodash/uniq'

import slugify from 'slugify'

export function tagMap (tag) {
    return slugify(tag).toLowerCase()
  }

export function getTags (page) {
    // console.log(page)
    return page.data.tags || []
  }

export function getAllTags (pages) {
    var s = pages.map(page => getTags(page))
    var r = s.map(e =>
        console.log(e)
        // tagMap(e)
    )
    // var t = [].concat(...pages.map(page => getTags(page).map(tagMap)))
     var t = uniq([].concat(...pages.map(page => getTags(page).map(tagMap)))).sort()
     return t
  }