<script>
  import Nav from './lib/Nav.svelte'
  import Main from './pages/Main.svelte'
  import About from './pages/About.svelte'
  import Members from './pages/Members.svelte'

  import route from 'page.js'

  let page

  route('/', () => page = Main)
  route('/about', () => page = About)
  route('/members', () => page = Members)
  route.start()
</script>

<Nav />

<svelte:component this={page} />
