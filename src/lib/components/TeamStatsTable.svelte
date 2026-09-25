<script>
	let {
		stats,     // array of { label, away, home }
		awayAbbr,
		homeAbbr
	} = $props();
</script>

<table class="team-stats">
	<thead>
		<tr>
			<th></th>
			<th>{awayAbbr}</th>
			<th>{homeAbbr}</th>
		</tr>
	</thead>
	<tbody>
		{#each stats as row (row.label)}
			<tr>
				<td class="label">{row.label}</td>
				<td>{row.away}</td>
				<td>{row.home}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.team-stats {
		width: min(98%, 800px);
		margin: 0 auto;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.5em 0.9em;
		text-align: center;
		border-bottom: 1px solid #333;
	}

	thead th {
		color: #aaa;
		font-size: 0.8rem;
		font-weight: normal;
		border-bottom: 1px solid #444;
	}

	.label {
		text-align: left;
		color: #ccc;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}
</style>