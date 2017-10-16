import slugify from 'slugify'

export function tagMap (tag) {
    return slugify(tag).toLowerCase()
  }