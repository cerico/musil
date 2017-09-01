import React from 'react'
import { Link } from 'react-router'
import { tagMap } from '../utils/tagMap'
import { prefixLink } from 'gatsby-helpers'

const Tags = props => (props.page && props.page.tags || []).length
  ? (
    
      <span style={{display:'inline'}}>
        {props.page.tags.map((tag, i) => (
          <span key={i} style={{marginRight:'8px',lineHeight:'1.5'}}>
            <Link style={{color:'rgb(158, 171, 179)',display:'inline-block'}} to={{ pathname: prefixLink('/tags/'), hash: `#${tagMap(tag)}` }}>
              {tag}, 
            </Link>
          </span>
        ))}
      </span>

  ) : null

export default Tags
