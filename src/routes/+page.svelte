<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import GameListTile from '$lib/components/GameListTile.svelte';
	import { addDays, formatDisplayDate } from '$lib/normalize.js';

	let { data } = $props();

	function setLeague(newLeague) {
		const params = new URLSearchParams();
		params.set('league', newLeague);
		goto(`?${params}`, { keepFocus: true });
	}

	function shiftMlbDate(direction) {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('date', addDays(data.date, direction));
		goto(`?${params}`, { keepFocus: true });
	}

	function goToNflWeek(weekParam) {
		if (!weekParam) return;
		const params = new URLSearchParams(page.url.searchParams);
		params.set('week', weekParam);
		goto(`?${params}`, { keepFocus: true });
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
	{#if data.league === 'nfl'}
		<button
			class="prev"
			disabled={!data.prevWeekParam}
			onclick={() => goToNflWeek(data.prevWeekParam)}
		>
			<span class="material-symbols-outlined"> chevron_left </span>
		</button>
		<h3>{data.weekLabel}</h3>
		<button
			class="next"
			disabled={!data.nextWeekParam}
			onclick={() => goToNflWeek(data.nextWeekParam)}
		>
			<span class="material-symbols-outlined"> chevron_right </span>
		</button>
	{:else}
		<button class="prev" onclick={() => shiftMlbDate(-1)}>
			<span class="material-symbols-outlined"> chevron_left </span>
		</button>
		<h3>{formatDisplayDate(data.date)}</h3>
		<button class="next" onclick={() => shiftMlbDate(1)}>
			<span class="material-symbols-outlined"> chevron_right </span>
		</button>
	{/if}
</div>
<ul class="game-list">
	{#each data.games as game (game.id)}
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
		margin: 0 auto;
		width: min(95%, 800px);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.prev, .next {
		padding: 0 1em;
		border-radius: 100vw;
		border: 1px solid #444;
	}
</style>
