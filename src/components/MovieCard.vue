<script setup>
import { useFavorites } from '@/composables/useFavorites'
import { filmRating, filmYear, imageUrl } from '@/services/tmdb'

defineProps({ film: { type: Object, required: true } })
const { isFavorite, toggleFavorite } = useFavorites()
</script>

<template>
  <article class="movie-card">
    <RouterLink class="movie-link" :to="{ name: 'movie', params: { id: film.id } }">
      <div class="poster">
        <img v-if="film.poster_path" :src="imageUrl(film.poster_path)" alt="" loading="lazy" decoding="async">
        <span v-else class="poster-empty">Sem cartaz</span>
        <span v-if="film.vote_count" class="rating" :aria-label="'Avaliação: ' + filmRating(film) + ' em 10'">
          <span aria-hidden="true">★</span> {{ filmRating(film) }}
        </span>
      </div>
      <div class="movie-caption">
        <h3>{{ film.title }}</h3>
        <p>{{ filmYear(film.release_date) }}</p>
      </div>
    </RouterLink>
    <button class="save-button" type="button" :aria-pressed="isFavorite(film.id)"
      :aria-label="'Favorito: ' + film.title" @click="toggleFavorite(film)">
      <span aria-hidden="true">{{ isFavorite(film.id) ? '♥' : '♡' }}</span>
    </button>
  </article>
</template>
