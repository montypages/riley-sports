<script>
	let { data } = $props();
</script>

<a href="/" class="back-link">← Back to games</a>

<div class="score-banner container">
	<h2 class="team"><span class="name">{data.away.name}</span><span class="score">{data.away.score}</span></h2>
	<h2 class="team"><span class="name">{data.home.name}</span><span class="score">{data.home.score}</span></h2>
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
</style>