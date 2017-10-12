export default interface PurchaseMeta {
  title: string
  description: string
  siteName: string
  icon?: string
  url: string
  origin: string
}

function readOpenGraph(attribute: string, document: HTMLDocument): string {
  let metaTag = document.querySelector('meta[property="og:' + attribute + '"]')
  if (metaTag) {
    return metaTag.getAttribute('content') || ''
  } else {
    return ''
  }
}

export function purchaseMetaFromDocument (document: HTMLDocument): PurchaseMeta {
  return {
    title: readOpenGraph('title', document),
    description: readOpenGraph('description', document),
    siteName: readOpenGraph('site_name', document),
    url: document.location.href,
    origin: document.location.origin
  }
}
