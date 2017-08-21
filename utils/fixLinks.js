import catchLinks from 'catch-links';

export function fixLinks (ref, router) {
    catchLinks(ref, (href) => {
      const ext = href.split('.').pop().toLowerCase()
      if (['zip', 'png', 'jpg', 'jpeg', 'txt', 'md', 'pdf'].indexOf(ext) === -1) {
        router.push(href)
      } else {
        const link = document.createElement('a')
        link.href = href
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
      }
    })
  }