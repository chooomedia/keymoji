<script>
	import EmojiDisplay from './EmojiDisplay.svelte';
	import ContactForm from './ContactForm.svelte';
	import ErrorModal from './ErrorModal.svelte';
	import Header from './Header.svelte';
	import { fade } from 'svelte/transition';
	import { modalMessage, darkMode, languageText, showDonateMenu } from './stores.js';
	import FixedMenu from './widgets/FixedMenu.svelte';

	let showMenu = false;
	let showResult = false;
	let emojiSummary = '';
	let showForm = false;
	const hieroglyphicEmojisSrc = './images/keymoji-emoji-pattern-background-egypt-hieroglyphes-ai-dall-e.png';

	$: bgImage = `background-image: url("${hieroglyphicEmojisSrc}");background-size:16%;`;

	function handleGlobalClick(event) {
		const target = event.target;
		const isInsideMenu = target.closest('#fixed-menu') || target.closest('.overlay');

		if (!isInsideMenu) {
			showMenu = false;
			showDonateMenu = false;
		}
	}

	function setModalMessage(message) {
		modalMessage.set(message);
	}

	function showContactForm() {
		showForm = !showForm;
	}

	function toggleDonateMenu() {
        showDonateMenu.update(v => !v);
    }
</script>

<svelte:head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$languageText.index.pageTitle}</title>
  <meta name="description" content="{$languageText.index.pageDescription}">
  <meta name="keywords" content="{$languageText.index.pageKeywords}">
  <meta name="author" content="Keymoji Team">
  <meta property="og:title" content="{$languageText.index.pageTitle}">
  <meta property="og:description" content="{$languageText.index.pageDescription}">
  <meta property="og:image" content="URL_zum_Keymoji_Logo">
  <meta property="og:url" content="https://🔑moji.ws/images/keymoji-c-matt-frontend-developer-javascript-php-svelte-wordpress-creator-smirking-face_1f60f.gif">
  <meta property="og:type" content="website">
</svelte:head>

<svelte:window on:click={handleGlobalClick}/>

{#if $modalMessage && $modalMessage.trim() !== ''}
	<ErrorModal />
{/if}

<main class:dark={$darkMode} class="hieroglyphemojis" style="{bgImage}">
	<Header />
	<section class:dark={$darkMode} class="container mx-auto flex flex-col justify-center items-center min-h-screen py-5 overflow-auto touch-none z-10">
		<div class="neumorphic pl-5 pr-5 pb-5 w-80 md:w-25r rounded-xl backdrop-blur-sm bg-creme-80 dark:bg-aubergine-80 backdrop-opacity-60 backdrop-blur transition duration-300 ease-in-out transform">
		{#if showForm}
			<ContactForm {setModalMessage} />
		{:else}
			<EmojiDisplay {setModalMessage} />
		{/if}

			<p class="text-xs text-center mt-2 pt-2 pb-1 px-2 rounded-xl dark:text-white bg-creme-80 dark:bg-aubergine-80">
				{#if showForm}
					{$languageText.index.backToMainText}<br>
					<button class="font-bold cursor-pointer" on:click={showContactForm}>{$languageText.index.backToMainButtonText}</button>
				{:else}
					{$languageText.index.contactText}<br>
					<button class="font-bold cursor-pointer" on:click={showContactForm}>{$languageText.index.contactButtonText}</button>
				{/if}
			</p>
		</div>

		{#if showResult}
		<div class="neumorphic fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-gray-600 dark:text-white" in:fade out:fade>
			{emojiSummary}
		</div>
		{/if}

		<FixedMenu 
			align='bottom'
			bind:showMenu
			bind:showDonateMenu={$showDonateMenu}
		/>
	</section>
</main>

<style>
	section.dark {
		background-image: linear-gradient(-45deg, #050413f8, #040320f5, #080715f7, #040310f8);
	}
	section {
		background-image: linear-gradient(-45deg, #e0e0e0eb, #e0e0e0e7, #ecececef, #e0e0e0ee);
	}

	.hieroglyphemojis {
		animation: gradient 270s ease infinite;
		background-size: 16%;
	}

	@keyframes gradient {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	.neumorphic {
		box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
	}
	.dark .neumorphic {
		box-shadow: 20px 20px 60px #0c0d22, -20px -20px 60px #1c1c1c;
	}
</style>