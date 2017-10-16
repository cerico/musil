
import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { Container } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import Headroom from 'react-headroom'
import flatten from 'lodash/flatten'
import includes from 'lodash/includes'
import LinksBar from '../components/LinksBar'
import Bio from '../components/Bio'
// const grainy = require('grainy');
// const grainy = require('../uticjhrls/grainy');

import { municipal } from '../utils/grainy'


const logoSize = 60
const smallerLogoSize = 35

class PostTemplate extends React.Component {

  constructor(){
    super()
    this.municipal = municipal
  }

  componentDidMount(){
    
     const node = ReactDOM.findDOMNode(this);
     let opts = ({
       intensity: 1,
       size: 525,
       color: '#000000',
       backgroundColor: '#4cba7a',
       backgroundColor:'#79a613',
       opacity: 0.12,
       monochrome: true,
     });
     this.municipal.grainy(node,opts)
    }
 
  
  render () {
    const { children } = this.props.posts

    return(
    <div className="events-list content-right flex-item one-half">
    <h2>Posts</h2>
  
    
    { this.props.posts }
    
 
    
    
    
    </div>
    )
}
}



export default PostTemplate

