<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import { filmRating, filmYear, getFilm, imageUrl } from '@/services/tmdb'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const film = ref(null)
const error = ref('')
const loading = ref(true)
const attempt = ref(0)
const { isFavorite, toggleFavorite } = useFavorites()
const background = computed(() => film.value?.backdrop_path
  ? { '--backdrop': 'url("' + imageUrl(film.value.backdrop_path, 'w1280') + '")' }
  : {})

function backToCatalog() {
  const previous = router.options.history.state.back
  if (typeof previous === 'string' && router.resolve(previous).name === 'catalog') {
    router.back()
  } else {
    router.push({ name: 'catalog' })
  }
}

watch([() => props.id, attempt], async ([id], _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  film.value = null
  error.value = ''
  loading.value = true
  try {
    const data = await getFilm(id, controller.signal)
    if (!controller.signal.aborted) film.value = data
  } catch (failure) {
    if (!controller.signal.aborted) error.value = failure.message
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <div class="container secondary">
    <button class="text-button back-link" type="button" @click="backToCatalog">← Voltar ao catálogo</button>
    <p v-if="loading" class="state" role="status">A carregar o filme…</p>
    <div v-else-if="error" class="state" role="alert">
      <p>{{ error }}</p>
      <button class="button" type="button" @click="attempt++">Tentar novamente</button>
    </div>
    <article v-else-if="film" class="detail" :style="background">
      <div class="detail-poster poster">
        <img v-if="film.poster_path" :src="imageUrl(film.poster_path, 'w500')" :alt="'Cartaz de ' + film.title">
        <span v-else class="poster-empty">Sem cartaz</span>
      </div>
      <div class="detail-content">
        <h1>{{ film.title }}</h1>
        <p v-if="film.original_title && film.original_title !== film.title" class="original-title">{{ film.original_title }}</p>
        <dl class="detail-meta">
          <div><dt>Ano</dt><dd>{{ filmYear(film.release_date) }}</dd></div>
          <div v-if="film.runtime"><dt>Duração</dt><dd>{{ film.runtime }} min</dd></div>
          <div><dt>Avaliação</dt><dd>{{ filmRating(film) }}<template v-if="film.vote_count"> / 10</template></dd></div>
        </dl>
        <ul v-if="film.genres?.length" class="genre-list" aria-label="Géneros">
          <li v-for="genre in film.genres" :key="genre.id">{{ genre.name }}</li>
        </ul>
        <h2>Sinopse</h2>
        <p class="overview">{{ film.overview || 'A TMDB ainda não disponibiliza uma sinopse em português.' }}</p>
        <button class="button button-accent" type="button" :aria-pressed="isFavorite(film.id)"
          :aria-label="'Favorito: ' + film.title" @click="toggleFavorite(film)">
          {{ isFavorite(film.id) ? '♥ Guardado nos favoritos' : '♡ Guardar nos favoritos' }}
        </button>
      </div>
    </article>
  </div>
</template>
