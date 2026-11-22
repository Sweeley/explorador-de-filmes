const API_ROOT = 'https://api.themoviedb.org/3'
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN?.trim()
export const MAX_PAGE = 500

async function request(path, params = {}, signal) {
  if (!READ_TOKEN) {
    throw new Error('Falta configurar o acesso à TMDB. Consulta o guia do projecto.')
  }

  const url = new URL(API_ROOT + path)
  url.searchParams.set('language', 'pt-PT')
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value != null) url.searchParams.set(key, value)
  }

  let response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + READ_TOKEN },
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('Não foi possível ligar à TMDB. Verifica a ligação e tenta novamente.')
  }

  if (response.ok) return response.json()
  if (response.status === 401 || response.status === 403) {
    throw new Error('A TMDB recusou o acesso. Confirma o token configurado.')
  }
  if (response.status === 404) throw new Error('Este filme não foi encontrado na TMDB.')
  if (response.status === 429) throw new Error('A TMDB recebeu demasiados pedidos. Tenta novamente dentro de instantes.')
  throw new Error('A TMDB está indisponível de momento. Tenta novamente.')
}

export function getGenres(signal) {
  return request('/genre/movie/list', {}, signal)
}

export function getFilm(id, signal) {
  return request('/movie/' + encodeURIComponent(id), {}, signal)
}

export async function getFilms(filters, signal) {
  const { query, genre, year, rating, sort, page } = filters

  if (!query) {
    return request('/discover/movie', {
      include_adult: false,
      with_genres: genre,
      primary_release_year: year,
      'vote_average.gte': rating,
      'vote_count.gte': rating || sort === 'vote_average.desc' ? 20 : undefined,
      sort_by: sort === 'relevance' ? 'popularity.desc' : sort,
      page,
    }, signal)
  }

  const data = await request('/search/movie', {
    query, include_adult: false, primary_release_year: year, page,
  }, signal)
  const results = data.results.filter((film) => {
    return (!genre || film.genre_ids?.includes(Number(genre))) &&
      (!rating || (film.vote_average >= Number(rating) && film.vote_count >= 20))
  })

  if (sort === 'vote_average.desc') {
    results.sort((a, b) => b.vote_average - a.vote_average)
  } else if (sort === 'primary_release_date.desc') {
    results.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
  } else if (sort === 'popularity.desc') {
    results.sort((a, b) => b.popularity - a.popularity)
  }

  return { ...data, results }
}

export function imageUrl(path, size = 'w342') {
  return path ? 'https://image.tmdb.org/t/p/' + size + path : ''
}

export function filmYear(date) {
  return date ? date.slice(0, 4) : 'Ano desconhecido'
}

export function filmRating(film) {
  return film.vote_count ? Number(film.vote_average).toLocaleString('pt-PT', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) : 'Sem nota'
}
