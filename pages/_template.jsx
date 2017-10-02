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
        <Link  to="/" className="inverse-topper"></Link>
        <h3>Firefox DevTools</h3>
        <h1>Introduction to CSS Grid Layout</h1>
        </div>
        <svg width="100%" height="47px" viewBox="0 0 1440 47" version="1.1" xmlns="http://www.w3.org/2000/svg" className="hero__div" preserveAspectRatio="none"><defs data-reactid="15"></defs><g id="Page-1" stroke="none" stroke-width="1" fill="#1e1e1e" fill-rule="evenodd" data-reactid="16"><path d="M0,0.0577405639 C117.504588,18.44359 269.602477,22.1720696 456.293666,11.2431795 C562.076057,5.05068514 730.784198,0.911127653 885.297232,3.27366179 C1157.17617,7.43074321 1386.98062,21.3276838 1440,38.3891927 L1440,46.9388979 L0,46.9388979 L0,0.0577405639 Z" id="Path-9" fill="#1e1e1e" data-reactid="17"></path></g>
        </svg>
      </Headroom>
      <section className="intro wrapper gradient-links">
      <div className="leftside">
      <Bio/>
      <LinksBar/>
            </div>
    <div className="text-col">
      <p>
        Marvin Visions is a more modern and consistent reinterpretation of <a target="_blank" href="https://fontsinuse.com/typefaces/10891/marvin-face">Marvin</a>, a typeface originally designed by Michael Chave in 1969 and published by <a target="_blank" href="http://luc.devroye.org/fonts-51663.html">Face Photosetting</a>. It has been revived by <a target="_blank" href="http://www.mathieutriay.com">Mathieu Triay</a> for the identity of <a target="_blank" href="https://www.readvisions.com">Visions</a>, a new science fiction magazine that aims to be a literary introduction to the genre, mixing classic texts with new writing.
      </p>
      {children}
      <p>
        When everyone is looking for their next workhorse, here comes Marvin Visions – a typeface with character, made to stand out. Like the original, it’s uppercase only and solely for display use. Unlike the original, this new design wants to be more sturdy and versatile. It has tight-not-touching default spacing, and it sports diacritics for most European languages as well as Cyrillic glyphs. It has been enhanced with a number of symbols, including arrows and an ‘at sign’, on top of a completely redrawn figure set. You can see it in action throughout this page and in the <a href="#in-use">postcards below</a>.
      </p>
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