import React from 'react'
import { Link } from 'react-router'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'
import { municipal } from '../utils/grainy'
import ReactDOM from 'react-dom'
import { tagMap } from '../utils/tagMap'
import {  getTags } from '../utils/getAllTags'


const style = {

    p: {
      marginBottom: rhythm(0.2),
      width:'100%',
      display:'inline-block',
      border:'2px solid white',
      marginBottom: '1.23rem',
      textAlign:'center',
      paddingTop:'7%',
      width: '80px',
        display: 'block',
        border: '2px solid white',
        height: '80px',
        background: 'yellow',
        marginRight: '20px',
        color:'#ffffff'
    },
    q: {
      fontSize:'50%',
      color:'yellowgreen',
      fontWeight:'100'
    },
    r: {
      fontSize:'150%',
      color:'yellowgreen',
      fontWeight:'100'
    }
    
  }

  export class Swimmer extends React.Component {

    constructor(){
        super()
        this.getTags = getTags
    }

    componentDidMount(){
        const node = ReactDOM.findDOMNode(this);
        //  Municipal(node)
         let opts = ({
           intensity: 1,
           size: 525,
           color: '#000000',
           backgroundColor: '#134568',
           opacity: 0.12,
           monochrome: true,
         });
       
         municipal.grainy(node,opts)
    }

  render(){
  
    const taggedPages = this.props.pages
    .filter(page => this.getTags(page).map(tagMap).indexOf(this.props.tag) !== -1).length
        return(
          <Link to={{ pathname: prefixLink('/tags/'), hash: `#${tagMap(this.props.tag)}` }} style={style.p}>
          {this.props.tag.substr(0,2)}<br/>
          <div style={style.q}>{this.props.tag}<br/>
          <span style={style.r}>{taggedPages}</span>
          </div>
          
        </Link>
        )
    }
  }
  


// export default Swimmer