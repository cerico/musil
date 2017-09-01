import moment from 'moment'

export function getPageDate (page) {
    return moment(page.data.date).format(page.data.dateFormat ? page.data.dateFormat : "D MMM YYYY")
  }