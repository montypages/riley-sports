<script>
	import favicon from '$lib/assets/favicon.svg';
	import "../lib/style/app.css"

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<h1>Riley's Sports App</h1>



{@render children()}


<style>
	h1 {
		text-align: center;
	}
</style>