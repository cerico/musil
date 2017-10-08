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
          <svg width="100%" height="47px" viewBox="0 0 1440 47" version="1.1" xmlns="http://www.w3.org/2000/svg" className="hero__div" preserveAspectRatio="none"><defs data-reactid="15"></defs><g id="Page-1" stroke="none" strokeWidth="1" fill="#fff" fillRule="evenodd" data-reactid="16"><path d="M0,0.0577405639 C117.504588,18.44359 269.602477,22.1720696 456.293666,11.2431795 C562.076057,5.05068514 730.784198,0.911127653 885.297232,3.27366179 C1157.17617,7.43074321 1386.98062,21.3276838 1440,38.3891927 L1440,46.9388979 L0,46.9388979 L0,0.0577405639 Z" id="Path-9" fill="#96d4e2" data-reactid="17"></path></g>
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

<h2>What We Believe</h2>
<h3>Waste is an opportunity.</h3>
<p>The best natural resource is the one that has already been extracted.</p>
</div>

<div className="events-list content-right flex-item one-half">
<h2>Upcoming Events</h2>

<article className="event bigclicky" data-url="http://plantchicago.org/events/open-house-chicago-pop-market/" data-lat="41.8107409" data-lng="-87.6606389" data-title="Open House Chicago Pop-up Market" data-desc="Oct 14, 2017 @ 10:00am–4:00pm" data-id="907">
<div className="article-content">
<time className="article-date" datetime="2017-10-14T10:00:00+00:00">
<span className="-inner">      
<span className="day">Sat</span> 
<span className="date">10/14/17</span>
<span className="time">10:00am</span>
</span>
</time>
<div className="article-content-wrap"> 
<h1 className="article-title"><a href="http://plantchicago.org/events/open-house-chicago-pop-market/">Open House Chicago Pop-up Market</a></h1>
<p className="event-summary">Join Plant Chicago for a pop-up farmers market during this years' Open House Chicago. The market will feature vendors from inside of The Plant and beyond. </p>
</div>
</div>
</article>
<article className="event bigclicky" data-url="http://plantchicago.org/events/open-house-chicago-pop-market-2/" data-lat="41.8107409" data-lng="-87.6606389" data-title="Open House Chicago Pop-up Market" data-desc="Oct 15, 2017 @ 10:00am–4:00pm" data-id="909">
<div className="article-content">
<time className="article-date" datetime="2017-10-15T10:00:00+00:00">
<span className="-inner">      
<span className="day">Sun</span> 
<span className="date">10/15/17</span>
<span className="time">10:00am</span>
</span>
</time>
<div className="article-content-wrap"> 
<h1 className="article-title"><a href="http://plantchicago.org/events/open-house-chicago-pop-market-2/">Open House Chicago Pop-up Market</a></h1>
<p className="event-summary">Join Plant Chicago for a pop-up farmers market during this years’ Open House Chicago. The market will feature vendors from inside of The Plant and beyond.</p>
</div>
</div>
</article>



<a href="http://plantchicago.org/news-events" className="btn">See more <span className="arrow -right"></span></a>      
</div>

</div>

</div>





</main>

<footer className="site-footer" role="contentinfo">
<div className="site-grid grid">

  <div className="main-gutter main-column-left">
    <a href="http://plantchicago.org/" className="footer-logo"><svg className="icon icon-logo"><use xmlnlink="http://www.w3.org/1999/xlink" xlinref="#icon-logo"></use></svg><span className="sr-only">Plant Chicago</span></a>
        </div>

  <div className="main-column-right">

    <div className="grid">

      <div className="content-left flex-item one-half">
        <div className="social">
          <h3>Connect with us</h3>
          <ul>
            <li><a href="https://www.facebook.com/plantchicagonotforprofit"><span className="sr-only">Facebook</span><svg className="icon icon-facebook"><use xmlnlink="http://www.w3.org/1999/xlink" xlinref="#icon-facebook"></use></svg></a></li>
            <li><a href="https://www.instagram.com/plantchicago"><span className="sr-only">Instagram</span><svg className="icon icon-instagram"><use xmlnlink="http://www.w3.org/1999/xlink" xlinref="#icon-instagram"></use></svg></a></li>
            <li><a href="https://www.twitter.com/plantchicago"><span className="sr-only">Twitter</span><svg className="icon icon-twitter"><use xmlnlink="http://www.w3.org/1999/xlink" xlinref="#icon-twitter"></use></svg></a></li>
          </ul>
        </div>
        <div className="newsletter">
          <h3>Subscribe to our newsletter</h3>
          <form className="newsletter-form" action="http://plantchicago.createsend.com/t/r/s/ajdjky/" method="post">
<label for="fieldEmail" className="sr-only">Email</label>
<input id="fieldEmail" name="cm-ajdjky-ajdjky" type="email" placeholder="Your email address" required=""/>
<button type="submit">Go <span className="arrow"></span></button>
</form>          </div>
      </div>

      <div className="content-right flex-item one-half">    
        <div className="visit">
          <h3>Visit us at The Plant</h3>
          <address className="vcard"> 
            <a target="_blank" href="https://goo.gl/maps/RRoM9Dco5BC2">1400 W 46th St, Chicago, IL 60609</a>
          </address>
          <a href="tel:7738475523">773.847.5523</a> +
          <a href="mailto:info@plantchicago.org">info@plantchicago.org</a>
        </div>
        <div className="copyright">
          <p>Copyright Plant Chicago 2017<br/> <em>Plant Chicago is a registered 501(c)3 organization</em></p>
        </div>
      </div>

    </div>

  </div>

</div>
<svg className="footer-pattern">
  <rect x="0" y="0" width="100%" height="36" fill="url(#footerPattern)">
</rect></svg>
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