import React from 'react'
import { Link } from 'react-router'
import { Container } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import Headroom from 'react-headroom'
import flatten from 'lodash/flatten'
import includes from 'lodash/includes'
import LinksBar from '../components/LinksBar'
import Bio from '../components/Bio'

const logoSize = 60
const smallerLogoSize = 35

class Template extends React.Component {
 
  
  render () {
    const { children } = this.props
    return (
      <div>
       
        <Headroom >
        <header role="banner">
        <Link  to="/" className="inverse-topper">{config.siteName}</Link>
        </header>
      </Headroom>
       <div style={{marginLeft:'2%'}}>
        <Bio/>
        <LinksBar/>
        </div>
        {children}
      </div>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.any,
  location: React.PropTypes.object,
  route: React.PropTypes.object
}

export default Template


// <Headroom >
// <Link  to="/" className="topper">{config.siteName}</Link>
// </Headroom>


// <hr style={{marginTop: '1.07rem'}}/>