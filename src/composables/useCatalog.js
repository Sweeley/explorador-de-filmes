import { computed, onScopeDispose, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFilms, getGenres, MAX_PAGE } from '@/services/tmdb'

const sorts = ['relevance', 'popularity.desc', 'vote_average.desc', 'primary_release_date.desc']
const ratings = ['6', '7', '8', '9']

export function useCatalog() {
  const route = useRoute()
  const router = useRouter()
  const filters = computed(() => {
    const { q, genero, ano, nota, ordem, pagina } = route.query
    return {
      query: typeof q === 'string' ? q.trim().slice(0, 120) : '',
      genre: typeof genero === 'string' && /^\d{1,5}$/.test(genero) ? genero : '',
      year: typeof ano === 'string' && /^\d{4}$/.test(ano) ? ano : '',
      rating: ratings.includes(nota) ? nota : '',
      sort: sorts.includes(ordem) ? ordem : 'relevance',
      page: Math.min(MAX_PAGE, Math.max(1, Number.parseInt(pagina, 10) || 1)),
    }
  })

  const search = ref(filters.value.query)
  const films = ref([])
  const genres = ref([])
  const genreError = ref(false)
  const totalPages = ref(0)
  const loading = ref(true)
  const error = ref('')
  const refresh = ref(0)
  const genreRefresh = ref(0)
  let debounceTimer

  watch(() => filters.value.query, (query) => { search.value = query })
  onScopeDispose(() => clearTimeout(debounceTimer))

  function updateQuery(patch, replace = false) {
    const query = { ...route.query, ...patch }
    for (const key of Object.keys(query)) {
      if (!query[key]) delete query[key]
    }
    return router[replace ? 'replace' : 'push']({ name: 'catalog', query })
  }

  function updateSearch(value, immediate = false) {
    search.value = value
    clearTimeout(debounceTimer)
    const apply = () => {
      const next = search.value.trim()
      if (next !== filters.value.query) updateQuery({ q: next, pagina: undefined }, !immediate)
    }
    if (immediate) apply()
    else debounceTimer = setTimeout(apply, 350)
  }

  function updateFilter(name, value) {
    clearTimeout(debounceTimer)
    updateQuery({ q: search.value.trim(), [name]: value, pagina: undefined })
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      updateQuery({ pagina: page === 1 ? undefined : String(page) })
    }
  }

  function clearFilters() {
    clearTimeout(debounceTimer)
    search.value = ''
    router.push({ name: 'catalog' })
  }

  watch([filters, refresh], async ([current], _, onCleanup) => {
    const controller = new AbortController()
    onCleanup(() => controller.abort())
    loading.value = true
    error.value = ''
    films.value = []
    totalPages.value = 0

    try {
      const data = await getFilms(current, controller.signal)
      if (controller.signal.aborted) return
      films.value = data.results
      totalPages.value = Math.min(data.total_pages, MAX_PAGE)
      if (totalPages.value && current.page > totalPages.value) {
        updateQuery({ pagina: totalPages.value === 1 ? undefined : String(totalPages.value) }, true)
      }
    } catch (failure) {
      if (!controller.signal.aborted) error.value = failure.message
    } finally {
      if (!controller.signal.aborted) loading.value = false
    }
  }, { immediate: true })

  watch(genreRefresh, async (_, __, onCleanup) => {
    const controller = new AbortController()
    onCleanup(() => controller.abort())
    genreError.value = false

    try {
      const data = await getGenres(controller.signal)
      if (!controller.signal.aborted) genres.value = data.genres
    } catch {
      if (!controller.signal.aborted) genreError.value = true
    }
  }, { immediate: true })

  return {
    filters, search, films, genres, genreError, totalPages, loading, error,
    updateSearch, updateFilter, goToPage, clearFilters,
    retry: () => { refresh.value++ },
    retryGenres: () => { genreRefresh.value++ },
  }
}
