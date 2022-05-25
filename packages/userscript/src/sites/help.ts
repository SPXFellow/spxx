import getZendesk from '../utils/zendesk'

export function help() {
  getZendesk(
    (button: HTMLElement) => {
      const nav = document.createElement('nav')
      nav.classList.add('my-0')
      nav.append(button)
      document.querySelector('.topNavbar .d-flex')!.append(nav)
    },
    ' – Home',
    'article-body',
    null
  )
}
