import moment from 'moment'

export function time (time) {
  const now = moment(moment().format())
  const past = moment(time)

  let days = now.diff(past, 'd') === 1
    ? now.diff(past, 'd') + ' day '
    : now.diff(past, 'd') + ' days '
  if (days[0] === '0') { days = '' }

  let hours = now.diff(past, 'h') % 24 === 1
    ? now.diff(past, 'h') % 24 + ' hour '
    : now.diff(past, 'h') % 24 + ' hours '
  if (hours[0] === '0') { hours = '' }

  let minutes = now.diff(past, 'm') % 60 === 1
    ? (now.diff(past, 'm')) % 60 + ' minute ago'
    : (now.diff(past, 'm')) % 60 + ' minutes ago'
  if (minutes[0] === '0') { minutes = 'less than 1 minute ago' }

  const rezult = days + hours + minutes

  return rezult
}
