import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  })

  router.subscribe('onResolved', () => {
    window.scrollTo({ top: 0, left: 0 })
  })

  return router
}
