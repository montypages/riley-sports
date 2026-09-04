<script>
	import BaseBug from "$lib/components/BaseBug.svelte";
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();
	let intervalId;

	$effect(() => {
		if (data.status === 'Live') {
			intervalId = setInterval(() => {
				invalidate(`game:${page.params.id}`);
				console.log("updating...");
			}, 10000);
		}
		return () => clearInterval(intervalId);
	});
</script>

<a href="/" class="back-link">← Back to games</a>

<div class="score-banner container">
	<h2 class="team"><span class="name">{data.away.name}</span><span class="score">{data.away.score}</span></h2>
	<h2 class="team"><span class="name">{data.home.name}</span><span class="score">{data.home.score}</span></h2>
	{#if data.league === 'mlb'}
		{#if data.status === 'Live'}
			<div class="game-bug">
				<BaseBug offense={data.offense} />
				<h3>{data.inning}</h3>
			</div>
		{:else}
			<h3 class="center-text">{data.status}</h3>
		{/if}
	{/if}
</div>

<table class="periods container">
	<thead>
		<tr><th></th>{#each data.periods as p}<th>{p.label}</th>{/each}</tr>
	</thead>
	<tbody>
		<tr><td>{data.away.name}</td>{#each data.periods as p}<td>{p.away}</td>{/each}</tr>
		<tr><td>{data.home.name}</td>{#each data.periods as p}<td>{p.home}</td>{/each}</tr>
	</tbody>
</table>

{#if data.league === 'mlb'}
	{#each [['away', data.away.name], ['home', data.home.name]] as [side, name]}
		<section class="container">
			<h3>{name}</h3>
			<table class="players">
				<tbody>
					{#each data.players[side].lineup as p}
						<tr><td>{p.name}</td><td>{p.role}</td><td>{p.summary}</td></tr>
					{/each}
				</tbody>
			</table>

			<h4>Pitchers</h4>
			<table class="players">
				<tbody>
					{#each data.players[side].pitchers as p}
						<tr><td>{p.name}</td><td>{p.role}</td><td>{p.summary}</td></tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/each}
{:else}
	{#each [['away', data.away.name], ['home', data.home.name]] as [side, name]}
		<section class="container">
			<h3>{name}</h3>
			<table class="players">
				<tbody>
					{#each data.players[side] as p}
						<tr><td>{p.name}</td><td>{p.role}</td><td>{p.summary}</td></tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/each}
{/if}

<style>
    .team {
        display: flex;
        justify-content: space-between;
    }

	.back-link {
		color: var(--clr-accent, green);
	}

	.game-bug {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.center-text {
		text-align: center;
	}
</style>