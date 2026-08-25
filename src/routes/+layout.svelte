<script>
	import favicon from '$lib/assets/favicon-32.png';
	import '../lib/style/app.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ('serviceWorker' in navigator) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({ immediate: true });
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<h1>Riley's Sports App</h1>

{@render children()}

<style>
	h1 {
		text-align: center;
	}
</style>
