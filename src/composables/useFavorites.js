import { readonly, ref } from 'vue'

const STORAGE_KEY = 'explorador-de-filmes:favoritos'

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved)
      ? saved.filter((film) => Number.isSafeInteger(film?.id) && typeof film.title === 'string')
      : []
  } catch {
    return []
  }
}

const favorites = ref(readFavorites())
const storageError = ref(false)

function isFavorite(id) {
  return favorites.value.some((film) => film.id === id)
}

function toggleFavorite(film) {
  if (isFavorite(film.id)) {
    favorites.value = favorites.value.filter((saved) => saved.id !== film.id)
  } else {
    const { id, title, poster_path, release_date, vote_average, vote_count } = film
    favorites.value = [{ id, title, poster_path, release_date, vote_average, vote_count }, ...favorites.value]
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    storageError.value = false
  } catch {
    storageError.value = true
  }
}

export function useFavorites() {
  return { favorites: readonly(favorites), storageError: readonly(storageError), isFavorite, toggleFavorite }
}
