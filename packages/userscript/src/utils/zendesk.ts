export async function getZendeskDate(url: string) {
  const req = new Promise((rs, rj) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: '/api/v2/help_center/en-us/articles/' + url.match(/\/articles\/(\d+)/)![1],
      fetch: true,
      nocache: true,
      timeout: 7_000,
      onload: (r) => {
        try {
          rs(r.responseText)
        } catch (e) {
          rj(e)
        }
      },
      onabort: () => rj(new Error('Aborted')),
      onerror: (e) => rj(e),
      ontimeout: () => rj(new Error('Time out')),
    })
  })
  let res: any
  await req.then((value) => {
    const rsp = JSON.parse(value as string)
    res = new Date(rsp.article.created_at)
  })

  const year = res.getFullYear()
  const month = res.getMonth() + 1
  const day = res.getDate()
  return { year, month, day }
}
