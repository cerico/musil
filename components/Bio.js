import React from 'react'
import { Link } from 'react-router'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'


const style = {
    img: {
      float: 'left',
      marginTop: 0,
      marginBottom: 0,
      marginRight: rhythm(0.25),
      width: rhythm(2),
      height: rhythm(2),
      borderRadius: '50%',
      border: '1px gray solid'
    },
    p: {
      marginBottom: rhythm(0.2)
    },
    grl: {
      display:'inline-block'
    }
  }
  
class authorBio extends React.Component {
  render(){
    return(
      <p style={style.p}>
      <Link to={prefixLink('/about/')} style={style.grl}>
        <img src="https://s3.eu-west-2.amazonaws.com/io1937/ghpages/linkedin.jpg" alt={config.authorName} style={style.img} />
      </Link>
      <div style={style.grl}>
        <span className="authorbio">{config.authorBio}</span>
        <Link to={prefixLink('/about/')}>{config.authorName}</Link>
      </div>
    </p>
    )
  }
}

export default authorBio