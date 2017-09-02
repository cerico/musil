import React from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import { rhythm } from '../../utils/typography'
import { Link } from 'react-router'
import 'css/markdown-styles.css'

import { prefixLink } from 'gatsby-helpers'


const style = {
  about: {
    marginTop: '1rem',
  },
  listItem: {
    marginBottom: rhythm(1),
    listStyle: 'none'
  },
  list: {
    marginLeft: 0
  },
  date: {
    fontSize: rhythm(0.5),
    color: 'gray',
    marginBottom: rhythm(0.1)
  },
  h3: {
    marginBottom: rhythm(0.5),
    display: 'inline-block'
  },
  img: {
    float: 'left',
    marginTop: rhythm(-0.1),
    marginBottom: 0,
    marginRight: rhythm(0.25),
    width: rhythm(2),
    height: rhythm(2),
    borderRadius: '50%',
    border: '1px gray solid'
  },
  inlineviewMoreLink: {
    marginLeft: rhythm(0.1),
    display: 'inline-block'
  }
}

class PostsIndex extends React.Component {



  render () {
    return (
 
        <div className="page-content" style={style.about}>

          <div>
          </div>
          <p style={style.p}>
            I'm currently a web developer for <a target='blank_' href='https://www.rocopartners.com'>rocopartners.com</a> and also available for freelance work.
          </p>
          <p style={style.p}>
            I work primarily on the front end with React, Vue or vanilla JS. I'm also beginning to work with Elm. And i love d3! On the server side I started out with Ruby on Rails, and also use Node and Express. I'm now also beginning to learn Clojure.
          </p>
          <p style={style.p}>
            Prior to becoming a developer I worked at <a target='blank_' href='http://www.sungardas.com/en/'>sungardas.com</a> on the devops side. Originally I came from a RedHat/CentOS background but these days I prefer CoreOS and Debian.
          </p>
          <p style={style.p}>
            For my development setup I use a mixture of VS Code and vim. I use Docker locally, via a CoreOS vm using Vagrant. In the cloud I use Digital Ocean, AWS, Exoscale and Netlify, and a mixture of Docker Machine and Ansible for orchestration. Some of this stuff is in my <a target='blank_' href='https://github.com/cerico/dotfiles'>dotfiles</a>
          </p>
          <p style={style.p}>
            <a target='blank_' href='https://github.com/cerico'>github</a> | <a target='blank_' href='https://www.linkedin.com/in/garethrobertlee'>linkedin</a> 
          </p>
        </div>

    )
  }
}

PostsIndex.propTypes = {
  route: React.PropTypes.object
}

export default PostsIndex
