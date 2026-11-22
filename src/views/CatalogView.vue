<script setup>
import { computed } from 'vue'
import CatalogFilters from '@/components/CatalogFilters.vue'
import MovieCard from '@/components/MovieCard.vue'
import { useCatalog } from '@/composables/useCatalog'
import { filmRating, filmYear, imageUrl } from '@/services/tmdb'

const {
  filters, search, films, genres, genreError, totalPages, loading, error,
  updateSearch, updateFilter, goToPage, clearFilters, retry, retryGenres,
} = useCatalog()

const featured = computed(() => {
  const { query, genre, year, rating, sort, page } = filters.value
  if (query || genre || year || rating || sort !== 'relevance' || page !== 1) return null
  return films.value.find((film) => film.backdrop_path) || null
})

function heroBackground(film) {
  return film ? { '--backdrop': 'url("' + imageUrl(film.backdrop_path, 'w1280') + '")' } : {}
}
</script>

<template>
  <div class="container catalog">
    <section class="hero" aria-labelledby="hero-title" :style="heroBackground(featured)">
      <div class="hero-content">
        <h1 id="hero-title">Encontra o teu<br>próximo <em>filme.</em></h1>
        <p>Do serão de sexta à próxima sessão do cineclube.</p>
        <RouterLink v-if="featured" class="hero-link" :to="{ name: 'movie', params: { id: featured.id } }">
          <span>Em destaque</span>
          {{ featured.title }} · {{ filmYear(featured.release_date) }} · ★ {{ filmRating(featured) }}
        </RouterLink>
      </div>
    </section>

    <section class="catalog-section" aria-labelledby="catalog-title">
      <div class="section-heading"><h2 id="catalog-title">Explorar o catálogo</h2></div>
      <CatalogFilters :filters="filters" :search="search" :genres="genres" :genre-error="genreError"
        @search="updateSearch" @filter="updateFilter" @clear="clearFilters" @retry-genres="retryGenres" />

      <div class="results" aria-labelledby="results-title" :aria-busy="loading">
        <div class="section-heading">
          <h2 id="results-title">{{ filters.query ? 'Resultados para «' + filters.query + '»' : 'Filmes' }}</h2>
          <p v-if="!loading && !error && totalPages > 0">Página {{ filters.page }} de {{ totalPages }}</p>
        </div>
        <p v-if="filters.query" class="filter-note">
          A pesquisa aplica o género, a nota e a ordenação aos filmes de cada página.
        </p>
        <p v-if="loading" class="state" role="status">A carregar filmes…</p>
        <div v-else-if="error" class="state" role="alert">
          <p>{{ error }}</p>
          <button class="button" type="button" @click="retry">Tentar novamente</button>
        </div>
        <div v-else-if="!films.length" class="state" role="status">
          <p>{{ totalPages > 1 ? 'Nesta página, nenhum filme corresponde aos filtros.' : 'Nenhum filme corresponde aos critérios.' }}</p>
          <button class="button" type="button" @click="clearFilters">Limpar pesquisa e filtros</button>
        </div>
        <div v-else class="movie-grid">
          <MovieCard v-for="film in films" :key="film.id" :film="film" />
        </div>
      </div>
      <nav v-if="!loading && !error && totalPages > 1" class="pagination" aria-label="Páginas de filmes">
        <button class="button" type="button" :disabled="filters.page === 1" @click="goToPage(filters.page - 1)">← Anterior</button>
        <span>{{ filters.page }} / {{ totalPages }}</span>
        <button class="button" type="button" :disabled="filters.page >= totalPages" @click="goToPage(filters.page + 1)">Seguinte →</button>
      </nav>
    </section>
  </div>
</template>
