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
          <Link  to="/" className="topper">{config.siteName}</Link>
        </Headroom>
        <hr style={{marginTop: '1.07rem'}}/>
        <Bio/>
        <LinksBar/>
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
