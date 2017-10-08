import React from 'react'
import { Link } from 'react-router'
import { tagMap } from '../utils/tagMap'
import { prefixLink } from 'gatsby-helpers'

const Comma = props =>  (props.i < props.length-1) ? (
  <span>,</span>
) : <span></span>

// const Tags = props => (props.page) ? <span>yes</span> : null

const Tags = props => (props.page && props.page.tags || []).length
  ? (
    
      <span style={{display:'inline'}}>
        {props.page.tags.map((tag, i) => (
          <span key={i} style={{marginRight:'8px',lineHeight:'1.2',display:'inline-block'}}>
            <Link style={{color:'rgb(158, 171, 179)',display:'inline-block',color:'#d2f0dc',fontSize:'1rem'}} to={{ pathname: prefixLink('/tags/'), hash: `#${tagMap(tag)}` }}>
              {tag}
            
            </Link>
            <Comma length={props.page.tags.length} i={i}/> 
          </span>
        ))}
      </span>

  ) : null

export default Tags
