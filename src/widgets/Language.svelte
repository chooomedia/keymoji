<script context="module">
  import { readable } from 'svelte/store';
  import content from '../content.js';

  function getLanguage() {
      const lang = document.documentElement.lang || 'en';
      return content[lang] ? lang : 'en';
  }

  let language = getLanguage();
  let textContent = content[language];

  export const languageText = readable(textContent);
</script>