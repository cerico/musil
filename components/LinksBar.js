import React from 'react'
import { Link } from 'react-router'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'

const style = {
  img: {
    float: 'left',
    marginTop: 0,
    marginBottom: 0,
    marginRight: rhythm(0.25),
    width: rhythm(2),
    height: rhythm(2),
    borderRadius: '50%',
    border: '1px gray solid'
  },
  p: {
    marginBottom: rhythm(1)
  }
}

class LinksBar extends React.Component {
  // const LinksBarParts = config.authorBio.split(config.authorName)

  get navItems () {
    const navItems = [
      ['Posts | ', '/'],
      ['About | ', '/about/'],
    ]

    navItems.forEach((navItem) => {
      navItem[1] = prefixLink(navItem[1])
    })

    return navItems
  }

  get nav () {
    return (
      <div>
        <span>
          {this.navItems.map((navItem, i) => <Link key={i} to={prefixLink(navItem[1])}>{navItem[0]}</Link>)}
        </span>
        
        <a key={'contact'} href={'mailto:garethrobertlee@gmail.com?Subject=Hello'} target='blank_'>Contact</a>
    </div>
    )
  }

  render(){
    return (
      <div>
       
        {this.nav}
      </div>
    )
  }
}

export default LinksBar
