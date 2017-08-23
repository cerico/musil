import React from 'react'
import { Link } from 'react-router'
import { tagMap } from '../utils/tagMap'
import { prefixLink } from 'gatsby-helpers'

const Tags = props => (props.page && props.page.tags || []).length
  ? (
    <div>
      <span>
      {console.log(props.page)}
        Tags: {props.page.tags.map((tag, i) => (
            // console.log(tag)
            <span key={i}>
          <Link  to={{ pathname: prefixLink('/tags/'), hash: `#${tagMap(tag)}` }}>
            {tag}
          </Link>
          <span>  </span>
          </span>
        ))}
      </span>
    </div>
  ) : null

export default Tags
