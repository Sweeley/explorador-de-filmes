# Explorador de Filmes

Aplicação individual de Programação Web II, ISUTC, turma LECC31. Desenvolvida por Sweeley da Barca para estudantes e cineclubes universitários. Consulta a TMDB para explorar filmes, pesquisar títulos, combinar filtros, consultar fichas e guardar favoritos no navegador.

## 1. Executar localmente

Usa o Node.js 24 (24.12 ou posterior). A partir da raiz deste repositório, no terminal do VS Code:

```powershell
npm.cmd ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Na [área de API da conta TMDB](https://www.themoviedb.org/settings/api), obtém o **API Read Access Token** (Bearer). No ficheiro `.env.local`, define `VITE_TMDB_READ_TOKEN` com esse valor. Se o ficheiro já existir, edita-o directamente.

```powershell
npm.cmd run dev
```

Abre o endereço indicado no terminal. Em macOS ou Linux, usa `npm` e `cp` nos comandos correspondentes. Para testar o pacote de produção, executa `npm run build` e `npm run preview`.

## 2. Ler o projecto ficheiro a ficheiro

Os ficheiros indicados abaixo já contêm o código completo. Para acompanhar a implementação, abre-os nesta ordem.

| Ficheiro | Responsabilidade |
| --- | --- |
| `package.json`, `package-lock.json` | Declaram as dependências e fixam as versões instaladas com `npm ci`. |
| `.gitignore`, `.env.example` | Excluem as configurações locais do Git e mostram o nome da variável exigida. |
| `vite.config.js`, `index.html` | Configuram o compilador, a base do Pages e o documento inicial em português. |
| `src/main.js`, `src/App.vue` | Iniciam o Vue e montam a navegação, a vista activa e os créditos oficiais da TMDB. |
| `src/router/index.js` | Liga o catálogo, as fichas e os favoritos. As rotas com `#` permitem recarregar uma ficha no Pages. |
| `src/services/tmdb.js` | Envia pedidos à TMDB, trata erros HTTP e prepara os URLs dos cartazes. |
| `src/composables/useCatalog.js` | Mantém a pesquisa e os filtros no URL, aguarda 350 ms durante a digitação, cancela pedidos obsoletos e gere a paginação. |
| `src/composables/useFavorites.js` | Partilha os favoritos entre as vistas e grava-os no `localStorage`. |
| `src/components/CatalogFilters.vue` | Apresenta os controlos de pesquisa, género, ano, nota e ordenação. |
| `src/components/MovieCard.vue` | Apresenta cartaz, título, ano e nota. O botão de favorito é independente da ligação para a ficha. |
| `src/views/CatalogView.vue` | Compõe o catálogo com os estados de carregamento, falha e ausência de resultados. |
| `src/views/MovieView.vue` | Usa o identificador da rota para carregar dados individuais, incluindo duração, géneros e sinopse. |
| `src/views/FavoritesView.vue`, `src/views/NotFoundView.vue` | Mostram os filmes guardados e permitem recuperar de um endereço inválido. |
| `src/assets/main.css`, `src/assets/tmdb.svg` | Definem a apresentação responsiva e apresentam a marca oficial da API nos créditos. |
| `.github/workflows/deploy.yml` | Compila o projecto em `main` e publica apenas a pasta `dist` no GitHub Pages. |

O catálogo chama `/discover/movie` e envia os filtros ao servidor. Quando há título, chama `/search/movie`, que aceita o ano de estreia. A aplicação aplica o género, a nota e a ordenação a cada página recebida. Uma página vazia pode ter outras páginas de pesquisa disponíveis. O filtro de nota exige pelo menos 20 votos para reduzir resultados sustentados por poucas avaliações. Os géneros vêm de `/genre/movie/list` e as fichas de `/movie/{id}`.

### Token num site estático

O segredo no GitHub Actions e o ficheiro ignorado `.env.local` mantêm o valor fora do Git. O Vite, contudo, inclui a variável `VITE_TMDB_READ_TOKEN` no JavaScript compilado. Um visitante pode recuperá-la pelo código distribuído ou nos pedidos de rede. Usa um token de aplicação dedicado a este projecto. Uma arquitectura que precise preservar a credencial teria de consultar a TMDB por intermédio de um serviço do lado do servidor. [Variáveis do Vite](https://vite.dev/guide/env-and-mode) · [Autenticação TMDB](https://developer.themoviedb.org/docs/authentication-application)

## 3. Git e publicação

O histórico local inclui `main`, `dev` e um merge. Para o trabalho futuro, cria os commits em `dev` e integra-os em `main`:

```sh
git switch dev
git add <ficheiros-alterados>
git commit -m "Descrever a alteração"
git switch main
git merge --no-ff dev
```

1. Confirma que `origin` aponta para o repositório certo com `git remote -v`. Se precisares de um novo repositório, cria-o vazio no GitHub e aponta `origin` para o URL desse repositório.
2. Autentica-te no GitHub e executa `git push -u origin main` e `git push -u origin dev`. Nas definições do repositório, escolhe `main` como branch predefinida e confirma que o repositório é público para a avaliação.
3. Em **Settings → Secrets and variables → Actions → New repository secret**, cria `VITE_TMDB_READ_TOKEN` com o mesmo token de leitura.
4. Em **Settings → Pages → Build and deployment → Source**, escolhe **GitHub Actions**. O workflow usa a base devolvida pelo Pages, normalmente `/explorador-de-filmes/`.
5. Na aba **Actions**, abre **Publicar no GitHub Pages → Run workflow**, selecciona `main` e executa. Espera que a execução fique verde e copia o URL indicado pelo ambiente `github-pages`. [Configuração oficial do Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 4. Checklist de entrega

- [ ] Abrir o repositório e a aplicação publicada numa janela privada.
- [ ] Confirmar no GitHub que `main` e `dev` estão visíveis e que o merge aparece no histórico.
- [ ] Ver cartazes e navegar entre páginas com o catálogo sem filtros.
- [ ] Pesquisar um título conhecido e testar a mensagem para uma pesquisa sem correspondências.
- [ ] Combinar género, ano e nota, testar a ordenação e limpar os filtros.
- [ ] Abrir uma ficha e recarregar o endereço no Pages. Confirmar o título, os géneros e a sinopse quando disponível.
- [ ] Guardar um filme, desactivar e voltar a activar o favorito e confirmar que permanece após recarregar.
- [ ] Testar a aplicação num ecrã estreito e navegar com a tecla Tab.
- [ ] Anexar no campus virtual os dois links e o relatório PDF de uma página.
