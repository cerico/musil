import React from 'react'
import 'css/marv.css'
import 'css/pal.css'
import Helmet from "react-helmet"
import { config } from 'config'
import { getPageDate } from '../utils/getPageDate'
import Tags from '../components/Tags'
import Bio from '../components/Bio'
import LinksBar from '../components/LinksBar'

class Wrapper extends React.Component {

  
  render () {

    const style = {
      date: {
        fontSize: '2rem',
        color: '#9EABB3',
        marginBottom: '1px',
        textAlign: 'center',
        fontSize: '1rem',
        textAlign: 'right',
        color:'#d2f0dc'
      },
      pageTitle: {
        fontSize: '2.2rem',
        marginBottom:'1rem',
        marginTop: '2rem'
      },
      pageBody: {
      }
    }
    const post = this.props.route.page.data
    const page = this.props.route.page.data
    const header = (
      <div>
        
        {!page.date ? null : <div style={style.date}>{getPageDate(this.props.route.page)} in <Tags page={page} style={style.Tags} /></div>}
      </div>
    )

    const footer = (
      <div>
        <Tags page={page} style={style.Tags} />
        <hr style={{marginTop: '1.07rem'}}/>
        <Bio />
        <LinksBar/>
      </div>
    )
    
    
    return (
      <div className="markdown page-content">
        <Helmet
          title={`${config.siteTitle} | ${post.title}`}
        />
        {header}
        <h1 style={style.pageTitle}>{post.title}</h1>
        <div style={style.pageBody} dangerouslySetInnerHTML={{ __html: post.body }} />
        {footer}
      </div>
    )
  }
}

export default Wrapper
