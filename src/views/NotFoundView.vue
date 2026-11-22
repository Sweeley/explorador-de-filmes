<template>
  <section class="container secondary">
    <h1>Página não encontrada</h1>
    <p class="subtitle">O endereço que abriste não corresponde a uma página do Explorador.</p>
    <RouterLink class="button button-accent" :to="{ name: 'catalog' }">Voltar ao catálogo</RouterLink>
  </section>
</template>
