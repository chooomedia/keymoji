<script context="module">
  import { readable, writable } from 'svelte/store';
  import content from '../content.js';

  function getLanguage() {
      const lang = document.documentElement.lang || 'en';
      return content[lang] ? lang : 'en';
  }

  let language = getLanguage();
  let textContent = content[language];

  export const languageStore = writable(language);
  export const languageText = readable(textContent);

  export function setLanguage(newLang) {
    if (content[newLang]) {
      language = newLang;
      textContent = content[newLang];
      languageStore.set(newLang);
      languageText.set(textContent);
      document.documentElement.lang = newLang;
    }
  }
</script>