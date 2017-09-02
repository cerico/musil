import React from 'react'
import { prune, include } from 'underscore.string'
import { fixLinks } from '../utils/fixLinks'

class Summary extends React.Component {
  componentDidMount () {
    fixLinks(this.refs.markdown, this.context.router)
  }

  summary (body) {
      return prune(body, 200)
  }

  render () {
    return (
      <div style={this.props.style} ref='markdown' dangerouslySetInnerHTML={{ __html: this.summary(this.props.body) }} />
    )
  }
}

Summary.propTypes = {
  body: React.PropTypes.string.isRequired
}

Summary.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Summary
