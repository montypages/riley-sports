<script>
	import BaseBug from "$lib/components/BaseBug.svelte";
	import BattingCount from "$lib/components/BattingCount.svelte";
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import StrikeZone from "$lib/components/StrikeZone.svelte";
	import AtBatProfile from "$lib/components/AtBatProfile.svelte";
	import { resolve } from "$app/paths";
	import StatsLeaders from "$lib/components/StatsLeaders.svelte";
	import FieldPossessionTracker from "$lib/components/FieldPossessionTracker.svelte";
	import PlayByPlay from "$lib/components/PlayByPlay.svelte";

	let { data } = $props();
	let intervalId;

	const backHref = page.url.searchParams.get('back') ?? '/';

	$effect(() => {
		if (data.status === 'Live') {
			intervalId = setInterval(() => {
				invalidate(`game:${page.params.id}`);
			}, 10000);
		}
		return () => clearInterval(intervalId);
	});
</script>

<a href={resolve(backHref)} class="back-link">← Back to games</a>

<div class="score-banner container">
	<h2 class="team">
		<span class="name">{data.away.abbreviation}</span>
		<span class="score">{data.away.score}</span></h2>
	{#if data.league === 'mlb'}
		{#if data.status === 'Live'}
			<div class="game-bug">
				<h3>{data.inning}</h3>
				<BaseBug offense={data.offense} />
			</div>
		{:else}
			<h3 class="center-text">{data.status}</h3>
		{/if}
	{:else}
			<div class="flex-center">
				<h3 class="center-text no-margin">{data.compStatus.type.shortDetail}</h3>
			</div>
	{/if}
	<h2 class="team">
		<span class="score">{data.home.score}</span>
		<span class="name">{data.home.abbreviation}</span>
	</h2>
</div>

{#if data.league === 'mlb'}
	<div class="at-bat container">
		<AtBatProfile pitching={data.inningState === "Bottom"} atBat={data.atBat} />
		<div class="ball-strike-container">
			<StrikeZone playEvents={data.playEvents} />
			<BattingCount offense={data.offense} />
		</div>
		<AtBatProfile pitching={data.inningState === "Top"} atBat={data.atBat} />
	</div>
{/if}

<table class="periods container">
	<thead>
		<tr><th></th>{#each data.periods as p}<th>{p.label}</th>{/each}</tr>
	</thead>
	<tbody>
		<tr><td>{data.away.name}</td>{#each data.periods as p}<td>{p.away}</td>{/each}</tr>
		<tr><td>{data.home.name}</td>{#each data.periods as p}<td>{p.home}</td>{/each}</tr>
	</tbody>
</table>

{#if data.league === 'nfl' && data.currentPlay}
	<FieldPossessionTracker homeTeam={data.home} awayTeam={data.away} play={data.currentPlay} />
{/if}

{#if data.league === 'nfl' && data.drives?.length}
	<PlayByPlay drives={data.drives} homeTeam={data.home} awayTeam={data.away} />
{/if}

{#if data.league === 'nfl'}
	<StatsLeaders stats={data} />
{/if}

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

	.score-banner {
		display: flex;
		justify-content: space-between;
	}

	.team {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.score {
		font-size: 3rem;
	}

	.game-bug {
		display: flex;
		gap: 1rem;
	}

	.at-bat {
		display: flex;
		justify-content: space-around;
	}

	.no-margin {
		margin: 0;
	}

	.flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>