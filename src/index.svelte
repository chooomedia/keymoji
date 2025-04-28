<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { modalMessage, currentLanguage, darkMode } from './stores.js';
  import { linkedinIcon } from './shapes.js';
  import { fade, fly } from 'svelte/transition';
  import Layout from './Layout.svelte';
  import Header from './Header.svelte';
  import UserCounter from './UserCounter.svelte';
  import EmojiDisplay from './EmojiDisplay.svelte';
  import ContactForm from './ContactForm.svelte';
  import ErrorModal from './ErrorModal.svelte';
  import VersionHistory from './VersionHistory.svelte';
  import FixedMenu from './widgets/FixedMenu.svelte';
  import content from './content.js';
  import { getText } from './stores.js';

  let url = "";

  function navigateToVersion() {
    navigate("/versions", { replace: false });
  }
</script>

<Layout {url}>
  <Router {url}>
    <div class="app-container">
      {#if $modalMessage && $modalMessage.trim() !== ''}
        <ErrorModal />
      {/if}
      
      <main class="scroll-container">
        <Header />
        
        <div class="container mx-auto min-h-screen">
          <Route path="/">
            <div in:fly={{y: 50, duration: 400, delay: 2400}} out:fade> 
              <section class="flex flex-col justify-center items-center min-h-screen py-5 overflow-auto touch-none z-10 gap-4">
                <UserCounter />
                <!-- Main content -->
                <div class="w-11/12 md:w-26r flex flex-wrap justify-center" role="banner">
                  <h1 class="md:text-3xl text-2xl font-semibold dark:text-white mb-2 text-center w-full">
                    {content[$currentLanguage]?.index?.pageTitle}
                  </h1>
                  <p class="dark:text-gray mb-3 text-center w-full leading-relaxed">
                    {content[$currentLanguage]?.index?.pageDescription}
                  </p>
                </div>

                <div class="content-wrapper pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60">
                  <EmojiDisplay />
                </div>

                <footer>
                  <div class="flex items-center justify-center space-x-2 text-sm text-gray dark:text-gray">
                    <button class="hover:text-yellow transition-colors duration-200" on:click={navigateToVersion} type="button">{getText('header.pageVersion')}</button>
                    <span class="w-1 h-1 rounded-full bg-gray dark:bg-gray"></span>
                    <span>Created by</span>
                    <a
                      href="https://www.linkedin.com/in/chooomedia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 hover:text-yellow transition-colors duration-200"
                    >
                      Christopher Matt
                      <svg class="w-4 h-4 transform translate-y-[0.5px]" viewBox="0 0 24 24" fill="currentColor">
                        {@html linkedinIcon}
                      </svg>
                    </a>
                  </div>
                </footer>
              </section>
            </div>
          </Route>

          <Route path="/versions">
            <VersionHistory currentVersion={content[$currentLanguage]?.header?.pageVersion} />
          </Route>

          <Route path="/contact">
            <div in:fly={{y: 50, duration: 400, delay: 400}} out:fade>
              <section class="flex flex-col justify-center items-center min-h-screen py-5">
                <div class="content-wrapper backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 pl-4 pr-4 pb-4 w-11/12 md:w-26r rounded-xl">
                  <ContactForm />
                </div>
              </section>
            </div>
          </Route>
        </div>

        <FixedMenu align={'bottom'} />
      </main>
    </div>
  </Router>
</Layout>

<style>
  .content-wrapper {
    box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
  }
  
  :global(.dark) .content-wrapper {
    box-shadow: 20px 20px 60px #0c0d22, -20px -20px 60px #1c1c1c;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>