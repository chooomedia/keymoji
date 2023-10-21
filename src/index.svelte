<script>
	import EmojiDisplay from './EmojiDisplay.svelte';
	import DonateButton from './DonateButton.svelte';
	import ContactForm from './ContactForm.svelte';
	import ErrorModal from './ErrorModal.svelte';
	import LoginMenu from './LoginMenu.svelte';
	import EraseLocalstorage from './EraseLocalstorage.svelte';
	import { fade } from 'svelte/transition';
	import { modalMessage } from './stores.js';
	import { Router, Route, Link } from 'svelte-routing';

	function setModalMessage(message) {
		modalMessage.set(message);  // Directly set the store value
	}

	let darkMode = localStorage.getItem('darkMode') === 'dark';
	let showResult = false;
	let emojiSummary = '';
	let showForm = false;

	function toggleDarkMode() {
		darkMode = !darkMode;
		localStorage.setItem('darkMode', darkMode ? 'dark' : 'light');
	}

	function showContactForm() {
		showForm = true;
		if (showForm) {

		} 
	}
</script>

<svelte:head>
<title>Keymoji - High securely Emoji Password Generator</title>
<meta name="description" content="Generate passwords using emojis. Safe, fun, and innovative.">
<!-- Other meta tags -->
</svelte:head>

{#if $modalMessage && $modalMessage.trim() !== ''}
	<ErrorModal />
{/if}

<main class:dark={darkMode} class="container mx-auto flex flex-col justify-center items-center h-screen py-5 overflow-auto touch-none z-10">
	<h1 class="text-5xl font-semibold text-center mb-2 dark:text-white">
		<Router>
			<Link to="/">Keymoji</Link><span class="text-xs absolute">v0.1</span>
		</Router>
	</h1>
	<h2 class="md:w-1/3 w-80 text-sm text-center mb-8 dark:text-white">
	Emoji Passwort Generator
	</h2>
	<h2 class="md:w-1/3 w-80 text-sm text-center mb-4 dark:text-white z-10">
	Click "Story" for your AI emoji tale 📖🌀<br> 
	"Random" is self-explanatory 🎯😜.<br>
	After generating, it's saved to your clipboard! 📋✨
	</h2>

	<div class="neumorphic pl-5 pr-5 pb-5 w-80 md:w-1/3 rounded-xl bg-creme dark:bg-aubergine backdrop-opacity-60 backdrop-blur md:max-w-lg">
	{#if showForm}
		<ContactForm setModalMessage={setModalMessage} />
	{:else}
		<EmojiDisplay setModalMessage={setModalMessage} />
	{/if}
	</div>

	<p class="md:w-1/3 w-80 text-xs text-center mt-4 dark:text-white">
		<Router>
		{#if showForm}
			Click on below 👇 to get back<br>
			<Link to="/" class="font-bold cursor-pointer">Back to main view 🔙</Link>
		{:else}
			Got a question or a cool suggestion?<br>
			<Link to="/contactform" class="font-bold cursor-pointer" on:click={showContactForm}>Send me a message! 💌🙏🏽</Link>
		{/if}
		</Router>
	</p>

	<LoginMenu />

	<button class="bg-blue transition transform hover:scale-105 fixed top-4 right-4 py-2 px-3 rounded-full" on:click={toggleDarkMode}>
		{darkMode ? '🌙' : '☀️'}
	</button>

	{#if showResult}
	<div class="neumorphic fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-gray-600 dark:text-white" in:fade out:fade>
		{emojiSummary}
	</div>
	{/if}

	<EraseLocalstorage />

	<DonateButton />
</main>

<style>
	main.dark {
		background: linear-gradient(-45deg, #0a0824, #0c0c0c, #04022b, #080715, #0a0824);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
	}
	main {
		background: linear-gradient(-45deg, #e0e0e0, #f5f5f5, #e0e0e0, #ECECEC, #e0e0e0);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.neumorphic {
	  box-shadow:  20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
	}
	.dark .neumorphic {
	  box-shadow:  20px 20px 60px #0c0d22, -20px -20px 60px #1c1c1c;
	}
</style>