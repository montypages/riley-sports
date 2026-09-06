<script>
    let { pitching, atBat } = $props();
</script>

<div class="at-bat-profile-container">
	{#if pitching}
		<h3>Pitching</h3>
		<p class="bold">{atBat.pitcher.name}</p>
		<p class="stats">{atBat.pitcher.inningsPitched}IP, {atBat.pitcher.pitchCount}PC</p>
		<p class="stats">{atBat.pitcher.earnedRuns}ER, {atBat.pitcher.strikeOuts}K, {atBat.pitcher.hand}</p>
	{:else}
		<h3>Batting</h3>
		<p class="bold">{atBat.batter.name}</p>
		<p class="stats">{atBat.batter.gameHits} - {atBat.batter.gameAtBats}</p>
		<p class="stats">{atBat.batter.seasonAvg} AVG, {atBat.batter.side}</p>
	{/if}
</div>

<style>
    .bold {
        font-weight: bold;
    }

    p {
        margin: 0;
    }
</style>