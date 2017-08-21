import moment from 'moment'

export function getPageDate (page) {
    return moment(page.data.date).add(0.5, 'days').format(page.data.dateFormat ? page.data.dateFormat : 'MM/DD/YYYY')
  }