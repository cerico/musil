import React from 'react'
import { Link } from 'react-router'
// import { tagMap, capitalizeFirstLetter } from 'utils'
import { prefixLink } from 'gatsby-helpers'


const Tags = props => (props.page && props.page.tags || []).length
  ? (
    <div {...props}>
      <span>
        Tags: {props.page.tags.map((tag, i) => (
          <Link key={i} to={{ pathname: prefixLink('/tags/'), hash: `#${tag}` }}>
            {tag}
          </Link>
        )).reduce((accu, elem) => accu === null ? [elem] : [...accu, ' | ', elem], null)}
      </span>
    </div>
  ) : null

export default Tags
