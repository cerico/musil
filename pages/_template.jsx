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
        <div role="hero" className="hero">
        <Link  to="/" className="inverse-topper">Cerico</Link>
        </div>
        <svg width="100%" height="47px" viewBox="0 0 1440 47" version="1.1" xmlns="http://www.w3.org/2000/svg" className="hero__div" preserveAspectRatio="none"><defs data-reactid="15"></defs><g id="Page-1" stroke="none" strokeWidth="1" fill="#1e1e1e" fillRule="evenodd" data-reactid="16"><path d="M0,0.0577405639 C117.504588,18.44359 269.602477,22.1720696 456.293666,11.2431795 C562.076057,5.05068514 730.784198,0.911127653 885.297232,3.27366179 C1157.17617,7.43074321 1386.98062,21.3276838 1440,38.3891927 L1440,46.9388979 L0,46.9388979 L0,0.0577405639 Z" id="Path-9" fill="#1e1e1e" data-reactid="17"></path></g>
        </svg>
      </Headroom>
      <section className="intro wrapper gradient-links">
      <div className="leftside">
      <Bio/>
      <LinksBar/>
            </div>
    <div className="text-col">

      {children}

    </div>
    </section>
    
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