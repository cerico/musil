


export function tagLookup (tag) {
  
    const defaulta = {
      
            shortName: tag.substr(0,2),
            shade: '#1e1e1e'
    
    }
    const tags = 
      
        {babel: {
            shortName: 'ba',
            shade: 'orange'
        },
        javascript: {
            shortName: 'js',
            shade: 'yellow'
        },
        clojure: {
            shortName: 'clj',
            shade: 'cornflowerblue'
        },
        coreos: {
            shortName: 'Cos',
            shade: 'yellowgreen'
        },
        deploy: {
            shortName: 'd',
            shade: 'red'
        },
        docker: {
            shortName: 'do',
            shade: 'pink'
        },
        es6: {
            shortName: 'es6',
            shade: 'pink'
        },
        webpack: {
            shortName: 'wp',
            shade: 'purple'
        }
    }  
    return tags[tag] ||  defaulta
  }