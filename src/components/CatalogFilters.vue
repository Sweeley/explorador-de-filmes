<script setup>
defineProps({
  filters: { type: Object, required: true },
  genres: { type: Array, required: true },
  genreError: Boolean,
  search: { type: String, required: true },
})
defineEmits(['search', 'filter', 'clear', 'retryGenres'])

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear + 2 - 1874 }, (_, i) => currentYear + 1 - i)
</script>

<template>
  <div class="filters">
    <form class="search" role="search" @submit.prevent="$emit('search', search, true)">
      <label for="title-search">Título do filme</label>
      <div class="search-control">
        <input id="title-search" type="search" placeholder="Ex.: Interstellar" maxlength="120"
          :value="search" @input="$emit('search', $event.target.value)">
        <button class="button button-accent" type="submit">Pesquisar</button>
      </div>
    </form>
    <div class="filter-options">
      <div class="filter-field">
        <label for="filter-genre">Género</label>
        <select id="filter-genre" :value="filters.genre" @change="$emit('filter', 'genero', $event.target.value)">
          <option value="">Todos os géneros</option>
          <option v-for="genre in genres" :key="genre.id" :value="String(genre.id)">{{ genre.name }}</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="filter-year">Ano</label>
        <select id="filter-year" :value="filters.year" @change="$emit('filter', 'ano', $event.target.value)">
          <option value="">Todos os anos</option>
          <option v-for="year in years" :key="year" :value="String(year)">{{ year }}</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="filter-rating">Nota mínima</label>
        <select id="filter-rating" :value="filters.rating" @change="$emit('filter', 'nota', $event.target.value)">
          <option value="">Qualquer nota</option>
          <option v-for="rating in [6, 7, 8, 9]" :key="rating" :value="String(rating)">{{ rating }} / 10</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="filter-sort">Ordenar por</label>
        <select id="filter-sort" :value="filters.sort" @change="$emit('filter', 'ordem', $event.target.value)">
          <option value="relevance">{{ filters.query ? 'Relevância' : 'Predefinição' }}</option>
          <option value="popularity.desc">Popularidade</option>
          <option value="vote_average.desc">Melhor avaliação</option>
          <option value="primary_release_date.desc">Mais recentes</option>
        </select>
      </div>
    </div>
    <button class="text-button" type="button" @click="$emit('clear')">Limpar filtros</button>
    <p v-if="genreError" class="filter-note">Não foi possível carregar os géneros.
      <button class="text-button" type="button" @click="$emit('retryGenres')">Tentar novamente</button>
    </p>
  </div>
</template>
