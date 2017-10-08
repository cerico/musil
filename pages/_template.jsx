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

    const style = {
      byline: {
        color: '#eadfc1'
      },
      top: {
        position:'relative'
      }
    }
    const { children } = this.props
    return (
      <div className="content"> 
        <div style={style.top}>
          <div role="hero" className="hero">
          <Link  to="/" className="inverse-topper">Cerico</Link>
          <h3>Javascript, Docker, Elixir, Nginx, and other fun and games</h3>
          </div>
          <svg width="100%" height="47px" viewBox="0 0 1440 47" version="1.1" xmlns="http://www.w3.org/2000/svg" className="hero__div" preserveAspectRatio="none"><defs data-reactid="15"></defs><g id="Page-1" stroke="none" strokeWidth="1" fill="#fff" fillRule="evenodd" data-reactid="16"><path d="M0,0.0577405639 C117.504588,18.44359 269.602477,22.1720696 456.293666,11.2431795 C562.076057,5.05068514 730.784198,0.911127653 885.297232,3.27366179 C1157.17617,7.43074321 1386.98062,21.3276838 1440,38.3891927 L1440,46.9388979 L0,46.9388979 L0,0.0577405639 Z" id="Path-9" fill="#9fcae3" data-reactid="17"></path></g>
          </svg>
        </div>
    

<div className="clear-both"></div>
<div className="mini">
<Bio/>
<LinksBar/>
</div>

<main className="site-main" role="main">

<div className="site-grid grid">
<div className="main-gutter main-column-left">

<div className="header-gutter-icons">
<svg className="icon icon-community"><use d="http://www.w3.org/1999/xlink" d="#icon-community"></use></svg>
<svg className="icon icon-land"><use d="http://www.w3.org/1999/xlink" d="#icon-land"></use></svg>
<svg className="icon icon-water"><use d="http://www.w3.org/1999/xlink" d="#icon-water"></use></svg>
</div>
<svg className="icon icon-factory"><use d="http://www.w3.org/1999/xlink" d="#icon-factory"></use></svg>
</div>

<div className="main-column-right grid">

<div className="content-left flex-item one-half">

<Bio/>
<LinksBar/>
</div>

<div className="events-list content-right flex-item one-half">
<h2>Posts</h2>



{children}



</div>

</div>

</div>





</main>






<footer className="site-footer" role="contentinfo">

<svg width="100%" height="47px" viewBox="0 0 1440 100" version="1.1" xmlns="http://www.w3.org/2000/svg" className="hero__divu" preserveAspectRatio="none">


 <path transform="scale(1, -1) translate(0, -47)"
 d="M0,0.0577405639 C117.504588,18.44359 269.602477,22.1720696 456.293666,11.2431795 C562.076057,5.05068514 730.784198,0.911127653 885.297232,3.27366179 C1157.17617,7.43074321 1386.98062,21.3276838 1440,38.3891927 L1440,46.9388979 L0,46.9388979 L0,0.0577405639 Z" id="Path-9" fill="#9fcae3" data-reactid="19"></path>
</svg>



</footer>
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