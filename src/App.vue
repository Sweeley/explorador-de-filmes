<script setup>
import { useFavorites } from '@/composables/useFavorites'

const { favorites, storageError } = useFavorites()
</script>

<template>
  <a class="skip-link" href="#conteudo" @click.prevent="$refs.content.focus()">Saltar para o conteúdo</a>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink class="brand" :to="{ name: 'catalog' }">
        <span class="brand-icon" aria-hidden="true">▶</span>
        <span>Explorador<span class="brand-accent">.</span> <small>de filmes</small></span>
      </RouterLink>
      <nav aria-label="Navegação principal">
        <RouterLink :to="{ name: 'catalog' }">Explorar</RouterLink>
        <RouterLink :to="{ name: 'favorites' }">Favoritos <span class="nav-count">{{ favorites.length }}</span></RouterLink>
      </nav>
    </div>
  </header>
  <main id="conteudo" ref="content" tabindex="-1">
    <p v-if="storageError" class="container notice" role="status">
      O navegador não permitiu gravar os favoritos. As alterações duram até fechares ou actualizares a página.
    </p>
    <RouterView />
  </main>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>Explorador de Filmes</strong><p>Sweeley da Barca · Programação Web II · ISUTC</p></div>
      <section class="credits" aria-label="Créditos">
        <a href="https://www.themoviedb.org/" aria-label="The Movie Database"><img src="@/assets/tmdb.svg" alt="TMDB" width="72"></a>
        <p lang="en">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </section>
    </div>
  </footer>
</template>
