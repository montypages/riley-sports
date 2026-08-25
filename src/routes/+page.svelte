<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import GameListTile from '$lib/components/GameListTile.svelte';
	import { addDays } from '$lib/normalize.js';
	import { formatDisplayDate } from '$lib/normalize.js';

	let { data } = $props();

	function setLeague(newLeague) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('league', newLeague);
		params.delete('date');
		goto(`?${params}`, { keepFocus: true });
	}

	function shiftDate(direction) {
		const step = data.league === 'nfl' ? 7 : 1;
		const params = new URLSearchParams(page.url.searchParams);
		params.set('date', addDays(data.date, direction * step));
		goto(`?${params}`, { keepFocus: true });
	}

	function formatShort(dateStr) {
		return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<nav>
	<button class="nav-link" class:active={data.league === 'mlb'} onclick={() => setLeague('mlb')}>
		MLB
	</button>
	<button class="nav-link" class:active={data.league === 'nfl'} onclick={() => setLeague('nfl')}>
		NFL
	</button>
</nav>

<h2>{data.league.toUpperCase()}</h2>
<div class="date-nav">
	<button class="prev" onclick={() => shiftDate(-1)}>prev</button>
	<h3>
		{#if data.league === 'nfl'}
			{formatDisplayDate(data.date)} – {formatDisplayDate(data.weekEnd)}
		{:else}
			{formatDisplayDate(data.date)}
		{/if}
	</h3>
	<button class="next" onclick={() => shiftDate(1)}>next</button>
</div>
<ul class="game-list">
	{#each data.games as game (game.id)}
		{#if data.games.length === 0}
			<p class="empty">No games found.</p>
		{/if}
		<GameListTile {game} />
	{/each}
</ul>

<style>
	nav {
		margin: 0 auto;
		width: fit-content;
		display: flex;
		justify-content: space-around;
		gap: 01em;
		padding: 0.25em;
		background: var(--clr-light-200, #ddd);
		border-radius: 100vw;
	}

	.nav-link {
		border: none;
		border-radius: 100vw;
		background-color: transparent;
		color: var(--clr-dark, #000);
		padding: 0.25em 1em;
	}

	.nav-link.active {
		font-weight: bold;
		color: var(--clr-light, #fff);
		background-color: var(--clr-accent, hsl(270, 50%, 70%));
	}

	h2 {
		text-align: center;
	}

	.date-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
