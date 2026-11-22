import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogView from '@/views/CatalogView.vue'
import MovieView from '@/views/MovieView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'catalog', component: CatalogView },
    { path: '/filme/:id(\\d+)', name: 'movie', component: MovieView, props: true },
    { path: '/favoritos', name: 'favorites', component: FavoritesView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || (to.path !== from.path ? { top: 0 } : undefined)
  },
})
