import React from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import { rhythm } from '../../utils/typography'
import { getAllTags, getTags, tagMap } from '../../utils/getAllTags'
import { Link } from 'react-router'

import { prefixLink } from 'gatsby-helpers'


const style = {
  about: {
    marginTop: '1rem'
  },
  listItem: {
    marginBottom: rhythm(1),
    listStyle: 'none'
  },
  list: {
    marginLeft: 0
  },
  date: {
    fontSize: rhythm(0.5),
    color: 'gray',
    marginBottom: rhythm(0.1)
  },
  h3: {
    marginBottom: rhythm(0.5),
    display: 'inline-block'
  },
  img: {
    float: 'left',
    marginTop: rhythm(-0.1),
    marginBottom: 0,
    marginRight: rhythm(0.25),
    width: rhythm(2),
    height: rhythm(2),
    borderRadius: '50%',
    border: '1px gray solid'
  },
  inlineviewMoreLink: {
    marginLeft: rhythm(0.1),
    display: 'inline-block'
  }
}

class PostsIndex extends React.Component {



  render () {

    const ShowTag = ({ tag, pages, hideSummary }) => {
      const taggedPages = pages
        .filter(getTags)
        .filter(page => getTags(page).map(tagMap).indexOf(tag) !== -1)
      return (
        <div>
          <h2>
            <Link style={style.tagLink} to={{ pathname: prefixLink('/tags/'), hash: `#${tagMap(tag)}` }}> {tag}
            </Link>
          </h2>
          <ul>
            {taggedPages.map((page, i) => (<div  key={i} page={page} />))}
          </ul>
        </div>
      )
    }
  
    const tag = this.props.location.hash.replace('#', '')
    const allTags = tag ? [] : getAllTags(this.props.route.pages)
   const mate = getAllTags(this.props.route.pages)

   return (
 
        <div style={style.about}>
        <div title={tag ? `${tag} - ${config.blogTitle}` : config.blogTitle}>
        <div>
          {tag ? <ShowTag tag={tag} pages={this.props.route.pages} /> : null}
        </div>
      </div>

          <div>
          </div>
      
        </div>

    )
  }
}

PostsIndex.propTypes = {
  route: React.PropTypes.object
}

export default PostsIndex
