<script setup>
import MovieCard from '@/components/MovieCard.vue'
import { useFavorites } from '@/composables/useFavorites'

const { favorites } = useFavorites()
</script>

<template>
  <section class="container secondary" aria-labelledby="favorites-title">
    <h1 id="favorites-title">Os teus favoritos</h1>
    <p class="subtitle">Os filmes que guardaste neste navegador.</p>
    <div v-if="favorites.length" class="movie-grid">
      <MovieCard v-for="film in favorites" :key="film.id" :film="film" />
    </div>
    <div v-else class="state">
      <p>A tua lista de favoritos ainda está vazia.</p>
      <RouterLink class="button button-accent" :to="{ name: 'catalog' }">Explorar filmes</RouterLink>
    </div>
  </section>
</template>
