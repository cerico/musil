import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { Container } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import  PostTemplate from '../components/postTemplate'
import Headroom from 'react-headroom'
import flatten from 'lodash/flatten'
import includes from 'lodash/includes'
import LinksBar from '../components/LinksBar'
import Bio from '../components/Bio'

const grainy = require('grainy');




const logoSize = 60
const smallerLogoSize = 35

class Template extends React.Component {

  heart()
  {
    var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    e.setAttribute("width","100%");
    e.setAttribute("height","47px");
    e.setAttribute("viewbox","0 0 1440 47");
    e.setAttribute("class","hero__div")
    e.setAttribute("xmlns","http://www.w3.org/2000/svg" )
    e.setAttribute("version","1.1" )
    var op = document.getElementById('blueboy')
    var s = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // s.setAttribute("d","M0,0.0577405639 C117.504588,18.44359 269.602477,22.1720696 456.293666,11.2431795 C562.076057,5.05068514 730.784198,0.911127653 885.297232,3.27366179 C1157.17617,7.43074321 1386.98062,21.3276838 1440,38.3891927 L1440,46.9388979 L0,46.9388979 L0,0.0577405639 Z"  );
    // s.setAttribute("fill","url('http://www.visitoruk.com/images/franchises/Huddersfield/gallery/largegallery_6182.jpg')");
    // debugger
    var defs = document.createElementNS ('xmlns', "defs");
    var pattern = document.createElementNS ('xmlns', "pattern");
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    pattern.setAttribute('id','img2')
    pattern.setAttribute('patternUnits','userSpaceOnUse')
  
    var image = document.createElementNS ('xmlns', "image");
    image.setAttribute('xlink:href',"http://www.visitoruk.com/images/franchises/Huddersfield/gallery/largegallery_6182.jpg")
  
    image.setAttribute('x','0')
    image.setAttribute('y','0')
    pattern.appendChild(image)
    defs.appendChild(pattern)
    e.appendChild(defs)
    g.appendChild(s);
    e.appendChild(g);
    // s.setAttributeNS(null,'fill','url(#img1)')
    return e;
  }

  swirl(){
    // debugger
  

    return (
      <svg width="100%" height="47px" viewBox="0 0 1440 47" version="1.1" xmlns="http://www.w3.org/2000/svg" className="hero__div" preserveAspectRatio="xMinYMax meet">
      <defs data-reactid="15">
    <pattern id="img1" patternUnits="userSpaceOnUse" x="0" y="0"  width="100" height="100">
    <image xlinkHref="https://f001.backblazeb2.com/file/margate/sda.png" x="0" y="0" width="100" height="100" />
  </pattern>
  <pattern id="pattern1"
  x="10" y="10" width="20" height="20"
  patternUnits="userSpaceOnUse" >
  <image id="u" xlinkHref="https://f001.backblazeb2.com/file/margate/runu.png" />
<circle id="circle" cx="10" cy="10" r="100" style={{"opacity":"0","stroke": "none", "fill": "#0000ff"}} />

</pattern>
      </defs>
      <g  id="Page-1" stroke="none" strokeWidth="1"  data-reactid="16">
      <path d="M0,0.0577405639 C117.504588,18.44359 269.602477,22.1720696 456.293666,11.2431795 C562.076057,5.05068514 730.784198,0.911127653 885.297232,3.27366179 C1157.17617,7.43074321 1386.98062,21.3276838 1440,38.3891927 L1440,46.9388979 L0,46.9388979 L0,0.0577405639 Z"  fill="url(#pattern1)" id="Path-9" data-reactid="17"></path></g>
      </svg>
    )
  }

  componentDidMount(){
    
     const node = ReactDOM.findDOMNode(this);
     console.log(node)
     console.log(document.getElementById('blueboy'))
     node.grainy({
       intensity: 1,
       size: 525,
       color: '#000000',
       backgroundColor: '#85b6d3',
       opacity: 0.12,
       monochrome: true,
     });
     var u = document.getElementById('u')
     var hero = document.getElementById('hero')
     u.setAttribute('src',node.style['background-image'])
     hero.grainy({
      intensity: 1,
      size: 125,
      color: '#85b6d3',
      backgroundColor: 'a9e274',
      backgroundColor:'#96d15b',
      opacity: 0.72,
      monochrome: true,
    });
  

    }


    updatedSVG() {

      // var el = document.querySelector('.icon-user');
      var el = document.getElementById('Path-9')
      // var style = window.getComputedStyle(el);
  
      // style.backgroundImage = 'http://www.visitoruk.com/images/franchises/Huddersfield/gallery/largegallery_6182.jpg'
      // var uri = style.backgroundImage;
      // var svg64 = uri.replace(/^.+base64,/, "").replace(/\"?\)$/, "")
      // var xml = window.atob(svg64);
      // var hex = '#' + Math.floor(Math.random()*16777215).toString(16);
      // var color = xml.replace(/fill="#[A-Za-z0-9]+"/, 'fill="' + hex + '"');
      // var color64 = window.btoa(color);
      // var colorUri = "url('data:image/svg+xml;base64," + color64 + ",http://www.visitoruk.com/images/franchises/Huddersfield/gallery/largegallery_6182.jpg)";

      // el.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAg0AAAINCAYAAAC9GEyUAAAgAElEQ…7jWzKEd8ZsSXvLomBtTfNWTszOgTeHju1cpymeWhON/v5fZNtNuDN+l/cAAAAASUVORK5CYII=)';
  var x = document.createElement('div')
      x.grainy({
        intensity: 1,
        size: 525,
        color: '#000000',
        backgroundColor: '#85b6d3',
        opacity: 0.12,
        monochrome: true,
      });
      var y = document.getElementById('img1')
      // debugger
      console.log(y)
      var oo = document.getElementById('blueboy')
   
      var z = document.getElementById('Path-9')
      // el.style.fill = 'url(#img1)'
  // debugger
  

  
      // debugger
      console.log(el)
      // debugger
      // el.style.fill = 'yellow'
    
      // el.style.fill = x.style.backgroundImage
     
      // el.style.backgroundImage = ""
    
      console.log(el)
      // el.style.backgroundImage = colorUri;
  }
 
  
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
    // debugger
    return (
      <div className="content" id="blueboy"> 
        <div style={style.top}>
          <div id="hero" role="hero" className="hero">
          <Link  to="/" className="inverse-topper">Cerico</Link>
          <h3>Javascript, Docker, Elixir, Nginx, and other fun and games</h3>
          </div>
   
         <div id="add-swirl">
         {this.swirl()}
        </div>
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



<PostTemplate posts={children}/>




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