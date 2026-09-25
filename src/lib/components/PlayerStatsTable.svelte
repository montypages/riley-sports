<script>
	let { categories } = $props(); // array of { name, label, labels[], athletes: [{ name, stats[] }] }
</script>

{#each categories as category (category.name)}
	{#if category.athletes.length}
		<div class="stats-block">
			<h4>{category.label}</h4>
			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							<th class="name-col"></th>
							{#each category.labels as label (label)}
								<th>{label}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each category.athletes as player (player.name)}
							<tr>
								<td class="name-col">{player.name}</td>
								{#each player.stats as stat, i (i)}
									<td>{stat}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
{/each}

<style>
	.stats-block {
		margin-bottom: 1.5em;
	}

	.stats-block h4 {
		margin: 0 0 0.5em;
	}

	.table-scroll {
		overflow-x: auto;
		border: 1px solid #444;
		border-radius: 0.5em;
	}

	table {
		border-collapse: collapse;
		white-space: nowrap;
		width: 100%;
	}

	th,
	td {
		padding: 0.5em 0.9em;
		text-align: right;
		background-color: #1a1a1a;
	}

	thead th {
		background-color: #222;
		color: #aaa;
		font-size: 0.75rem;
		font-weight: normal;
		border-bottom: 1px solid #444;
	}

	tbody tr:nth-child(even) td {
		background-color: #202020;
	}

	.name-col {
		position: sticky;
		left: 0;
		text-align: left;
		font-weight: bold;
		min-width: 8em;
		box-shadow: 1px 0 0 #444;
	}
</style>