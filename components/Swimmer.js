import React from 'react'
import { Link } from 'react-router'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'
import { municipal } from '../utils/grainy'
import ReactDOM from 'react-dom'
import { tagMap } from '../utils/tagMap'
import {  getTags } from '../utils/getAllTags'



const colours = ["orange","yellow","white","green","purple"]

const style = {

    p: {
      marginBottom: rhythm(0.2),
      width:'100%',
      display:'inline-block',
      border:'2px solid white',
      textAlign:'center',
      // paddingTop:'7%',
      width: '80px',
        display: 'block',
        border: '2px solid white',
        height: '80px',
        background: 'yellow',
        marginRight: '20px',
        color:'#ffffff',
        fontWeight:'800'
    },
    s: {
      fontWeight:'800',
      color:'#ffffff',
      display:'inline-block'
    },
    q: {
      fontSize:'50%',
      color:'#1e1e1e',
      fontWeight:'100'
    },
    r: {
      fontSize:'150%',
      color:'#ffffff',
      fontWeight:'100',
      background:'yellow',
      fontSize: '150%',
      color: '#fff',
            fontWeight: '100',
      // background: colours[parseInt(Math.random()*5)],
      /* width: 60px; */
      paddingLeft: '10px',
      borderRadius: '50%',
      paddingRight: '10px'
    },
    tod: {
      // backgroundImage: `radial-gradient(circle at 100% 0, ${colours[parseInt(Math.random()*5)]} 14px, rgba(0,0,0,0) 0px)`
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
           backgroundColor: '#758ac6',
           opacity: 0.12,
           monochrome: true,
         });
       
         municipal.grainy(node,opts)
    }

  render(){
    const cornerColour = colours[parseInt(Math.random()*5)]
    const taggedPages = this.props.pages
    .filter(page => this.getTags(page).map(tagMap).indexOf(this.props.tag) !== -1).length
        return(
          
          <Link id="thelink" to={{ pathname: prefixLink('/tags/'), hash: `#${tagMap(this.props.tag)}` }} style={style.p}>
          <div style={{backgroundImage: `radial-gradient(circle at 100% 0, ${cornerColour} 14px, rgba(0,0,0,0) 0px)`}}>
 
          <div style={style.s}>{this.props.tag.substr(0,2)}</div><br/>
          <div style={style.q}>{this.props.tag}<br/>
          <span style={{fontSize:'150%',
          color:'#ffffff',
          fontWeight:'100',
          // background:'yellow',
          fontSize: '150%',
          color: '#fff',
                fontWeight: '100',
          /* width: 60px; */
          paddingLeft: '10px',
          borderRadius: '50%',
          paddingRight: '10px'}}>{taggedPages}</span>
          </div>
          </div>
        </Link>
      
        )
    }
  }
  


// export default Swimmer