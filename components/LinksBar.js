import React from 'react'
import { Link } from 'react-router'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'

const style = {
  img: {
    // float: 'left',
    marginTop: 0,
    marginBottom: 0,
    marginRight: rhythm(0.25),
    width: rhythm(2),
    height: rhythm(2),
    borderRadius: '50%',
    border: '3px solid #7e9aa3'
  },
  p: {
    marginBottom: rhythm(1)
  },
  sidelink: {
    color:'#7e9aa3',
    color:'#8ab1d6',
    color:'#707274',
    color:'#fff',
    fontWeight:'800'
  }
}

class LinksBar extends React.Component {
  // const LinksBarParts = config.authorBio.split(config.authorName)


  get navItems () {
    const navItems = [
      ['Posts  ', '/'],
      ['About  ', '/about/'],
    ]

    navItems.forEach((navItem) => {
      navItem[1] = prefixLink(navItem[1])
    })

    return navItems
  }

  get nav () {
    return (
      <div className="linx">
        <span>
          {this.navItems.map((navItem, i) => <Link style={style.sidelink} key={i} to={prefixLink(navItem[1])}>{navItem[0]}<br/></Link>)}
        </span>
        
        <a style={style.sidelink} key={'contact'} href={'mailto:garethrobertlee@gmail.com?Subject=Hello'} target='blank_'>Contact</a>
    </div>
    )
  }

  render(){
    return (
      <div className="linx">
       
        {this.nav}
      </div>
    )
  }
}

export default LinksBar
