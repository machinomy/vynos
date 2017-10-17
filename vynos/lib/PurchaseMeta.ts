export default interface PurchaseMeta {
  title: string
  description: string
  icon?: string
  siteName: string
  siteIcon?: string
  url: string
  origin: string
}

function openGraph(attribute: string, document: HTMLDocument): string {
  let metaTag = document.querySelector('meta[property="og:' + attribute + '"]')
  if (metaTag) {
    return metaTag.getAttribute('content') || ''
  } else {
    return ''
  }
}

function appleTouchIcon(document: HTMLDocument): string|undefined {
  let links = [].slice.call(document.querySelectorAll('link')) as Array<HTMLLinkElement>
  let icons = links.filter(link => /apple-touch-icon/.test(link.rel))
  if (icons.length) {
    let maxSize = icons.reduce((acc, link) => {
      let size = parseInt(link.getAttribute('sizes') as string) || 0
      if (size > parseInt(acc.getAttribute('sizes') as string)) {
        return link
      } else {
        return acc
      }
    })
    return maxSize.href
  }
}

function icon(document: HTMLDocument): string|undefined {
  let links = [].slice.call(document.querySelectorAll('link')) as Array<HTMLLinkElement>
  let found = links.find(link => {
    return /icon/.test(link.rel) &&
      (!link.type || link.type !== 'image/x-icon') &&
      !(/shortcut/.test(link.rel)) &&
      (/\.png|\.jpg/.test(link.href))
  })
  if (found) {
    return found.href
  }
}

function openGraphIcon(document: HTMLDocument): string|undefined {
  let ogLinks = [].slice.call(document.querySelectorAll("meta[property='og:image']")) as Array<HTMLMetaElement>
  if (ogLinks.length) {
    let found = ogLinks.find(link => {
      return /logo|icon/.test(link.content)
    })
    if (found) {
      return found.content
    } else {
      return ogLinks[0].content
    }
  }
}

export function purchaseMetaFromDocument (document: HTMLDocument): PurchaseMeta {
  return {
    title: openGraph('title', document),
    description: openGraph('description', document),
    siteName: openGraph('site_name', document),
    url: document.location.href,
    origin: document.location.origin,
    icon: openGraphIcon(document),
    siteIcon: appleTouchIcon(document) || icon(document)
  }
}
