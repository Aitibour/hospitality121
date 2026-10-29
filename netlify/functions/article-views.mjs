import { getStore } from '@netlify/blobs'
import index from '../../out/search-index.json' with { type: 'json' }
import { createViewsHandler } from '../lib/article-views.mjs'

export default createViewsHandler({
  openStore: () => getStore({ name: 'article-view-sessions', consistency: 'strong' }),
  slugs: index.filter(item => ['news', 'blog', 'article'].includes(item.type)).map(item => item.slug),
})
