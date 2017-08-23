import slugify from 'slugify'

export function tagMap (tag) {
  console.log(tag)
    return slugify(tag).toLowerCase()
  }