import React from 'react'
import { prune, include } from 'underscore.string'
import { fixLinks } from '../utils/fixLinks'

class Summary extends React.Component {
  componentDidMount () {
    fixLinks(this.refs.markdown, this.context.router)
  }

  summary (body) {
    const explicitSplit = '<div class="summary-end"></div>'
    if (include(body, explicitSplit)) {
      return body.split(explicitSplit)[0]
    } else {
      return prune(body.replace(/<(?!\/?a)[^>]*>/g, ''), 200)
    }
  }

  render () {
    return (
      <div ref='markdown' dangerouslySetInnerHTML={{ __html: this.summary(this.props.body) }} />
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
