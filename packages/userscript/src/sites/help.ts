import fireZendesk from '../utils/zendesk'

export function help() {
  fireZendesk((button: HTMLElement) => {
    const nav = document.createElement('nav')
    nav.classList.add('my-0')
    nav.append(button)
    document.querySelector('.topNavbar .d-flex')!.append(nav)
  }, ' – Home', 'article-body', null)
}
