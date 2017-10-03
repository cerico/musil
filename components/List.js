import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { rhythm } from '../utils/typography'
import { getPageDate } from '../utils/getPageDate'
import access from 'safe-access'

import Summary from './Summary'
import Tags from './Tags'

const style = {
  listItem: {
    margin: '0 auto',
    width: '100%',
    marginBottom: rhythm(1),
    listStyle: 'none'
  },
  list: {
    marginLeft: 0
  },
  date: {
    fontSize: rhythm(0.8),
    color: 'gray',
    marginBottom: rhythm(0.1),
    marginLeft: '0px'
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
  headline: {
    fontSize: '1.6rem',
    lineHeight: '1',
    fontFamily: 'raleway',
    marginBottom:'15px',
    fontFamily: '-apple-system,".SFNSText-Regular","San Francisco","Roboto","Segoe UI","Helvetica Neue","Lucida Grande",Arial,sans-serif',
    marginBottom: '15px',
    color: '#607D8B',
    fontWeight: '700'
  },
  altDate: {
      fontSize:'1.05rem',
      color:' rgb(158, 171, 179)',
      // textAlign:'right',
      marginLeft:'4%',
      color:'yellow'
    },
    summary: {
      color: '#4a4e53',
      fontSize: '1.12rem'
    }
  }

class PostsList extends React.Component {

  makeListItem (page) {
    const pageTitle = access(page, 'data.title') || page.path
    const image = access(page, 'data.image')

  //  console.log(page.data.tags)

    let listItemContents = (

    
      <div>
        <div style={style.date}>
          {getPageDate(page)} in <Tags page={page.data}/>
        </div>
        <Link style={style.headline} to={prefixLink(page.path)}>
          {pageTitle}
        </Link>
        <Summary style={style.summary} body={page.data.brief} />
   
        
      </div>
    )

    if (image) {
      listItemContents = (
        <div>
          <Link to={prefixLink(page.path)}>
            <img src={prefixLink(image)} alt={pageTitle} style={style.img} />
          </Link>
          <span>
            {listItemContents}
          </span>
        </div>
      )
    }

    return (
      <li key={page.path} style={style.listItem}>
        {listItemContents}
      </li>
    )
  }

  // overrride this
  get list () {
    return this.props.route.pages
  }

  get title () {
    let titleText = ''
    let viewMoreLink = null
    if (this.props.limit > 12) {
      titleText += 'Latest '
      viewMoreLink = (<div style={style.inlineviewMoreLink}>
        {'| '}
        <Link to={prefixLink(this.props.viewAllPath)}>View all</Link>
      </div>)
    } else {
      // titleText += 'All '
    }
    titleText += this.props.title

    return (
      <span>
        <h3 style={style.h3}></h3>
        {viewMoreLink}
      </span>
    )
  }

  render () {
    let list = this.list.map(this.makeListItem)

    if (this.props.limit > 12) {
      list = list.slice(0, this.props.limit)
      list.push(
        <li key={'more'} style={style.listItem}>
          Showing last {this.props.limit} | <Link to={prefixLink(this.props.viewAllPath)}>View all</Link>
        </li>,
      )
    }

    return (
      <div className="content">
        {this.title}
        <ul style={style.list}>
          {list}
        </ul>
      </div>
    )
  }
}

PostsList.defaultProps = {
  limit: -1,
  title: 'Pages'
}

PostsList.propTypes = {
  title: React.PropTypes.string,
  route: React.PropTypes.object,
  limit: React.PropTypes.number,
  viewAllPath: React.PropTypes.string
}

export default PostsList


// in  <Tags page={page.data} />