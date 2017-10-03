import React from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import { rhythm } from '../../utils/typography'
import { getAllTags, getTags, tagMap } from '../../utils/getAllTags'
import { Link } from 'react-router'
import { getPageDate } from '../../utils/getPageDate'
import 'css/markdown-styles.css'
import Summary from '../../components/Summary'

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
  },
  tagLink: {
    // color:' rgb(158, 171, 179)',
    // fontFamily: '"Fira Sans",sans-serif',
    // fontSize: '2rem',
    // fontWeight:'200'
  },
  taggedPage: {
    listStyle: 'none',
    fontFamily: 'Raleway',
    fontSize: '4rem',
    lineHeight:'1.18'
    // fontFamily: 'roboto'
  },
  date: {
    // fontSize:'1.05rem',
    // color:' rgb(158, 171, 179)',
    // textAlign:'right',
    // marginRight:'8%'
  }
}

class PostsIndex extends React.Component {




  render () {
    

    const TaggedPage = ({ page }) => (
      <li style={style.taggedPage}>
        <Link style={style.taggedPage} to={prefixLink(page.path)}>
          {page.data.title}
        </Link>
        {<Summary style={style.tagLink} body={page.data.brief} />}
        <div style={style.date}>
        {getPageDate(page)}
      </div>
      </li>
    )

    const ShowTag = ({ tag, pages, hideSummary }) => {
      const taggedPages = pages
        .filter(page => getTags(page).map(tagMap).indexOf(tag) !== -1).reverse()
        // debugger
        const a = pages.filter(getTags)
        // debugger
      return (
        <div>
          <h2>
          </h2>
          <ul style={style.taggedPage}>
            {taggedPages.map((page, i) => (<TaggedPage key={i} page={page} />))}
          </ul>
        </div>
      )
    }
  
    const tag = this.props.location.hash.replace('#', '')
    const allTags = tag ? [] : getAllTags(this.props.route.pages)
   const mate = getAllTags(this.props.route.pages)

   return (
 
        <div className="page-content" style={style.about}>
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
