<script>
    let { stats } = $props();

    const homePassingLeader = stats.homeLeaders.find(leader => leader.name === 'passingYards')
    const awayPassingLeader = stats.awayLeaders.find(leader => leader.name === 'passingYards')
    const homeRushingLeader = stats.homeLeaders.find(leader => leader.name === 'rushingYards')
    const awayRushingLeader = stats.awayLeaders.find(leader => leader.name === 'rushingYards')
    const homeRecievingLeader = stats.homeLeaders.find(leader => leader.name === 'receivingYards')
    const awayRecievingLeader = stats.awayLeaders.find(leader => leader.name === 'receivingYards')
</script>

<section id="stats-leaders">
    <div class="container stats-leaders">
        <h2>Stats Leaders</h2>
        <div class="stats-grid">
            <!-- Teams -->
             <h3 class="team-name">{stats.away.abbreviation}</h3>
             <h3 class="team-name">{stats.home.abbreviation}</h3>
            <!-- Passing -->
            <h4 class="two-col">Passing</h4>
            <div class="stat-box" style="border-left: 3px solid #{stats.away.color}">
                <h5>{awayPassingLeader.leaders[0]?.athlete.shortName}</h5>
                <p class="bold">{awayPassingLeader.leaders[0]?.value} YDS</p>
                <p class="small">{awayPassingLeader.leaders[0]?.displayValue}</p>
            </div>
            <div class="stat-box" style="border-left: 3px solid #{stats.home.color}">
                <h5>{homePassingLeader.leaders[0]?.athlete.shortName}</h5>
                <p class="bold">{homePassingLeader.leaders[0]?.value} YDS</p>
                <p class="small">{homePassingLeader.leaders[0]?.displayValue}</p>
            </div>
            <!-- Rushing -->
            <h4 class="two-col">Rushing</h4>
            <div class="stat-box" style="border-left: 3px solid #{stats.away.color}">
                <h5>{awayRushingLeader.leaders[0]?.athlete.shortName}</h5>
                <p class="bold">{awayRushingLeader.leaders[0]?.value} YDS</p>
                <p class="small">{awayRushingLeader.leaders[0]?.displayValue}</p>
            </div>
            <div class="stat-box" style="border-left: 3px solid #{stats.home.color}">
                <h5>{homeRushingLeader.leaders[0]?.athlete.shortName}</h5>
                <p class="bold">{homeRushingLeader.leaders[0]?.value} YDS</p>
                <p class="small">{homeRushingLeader.leaders[0]?.displayValue}</p>
            </div>
            
            <!-- Receiving -->
            <h4 class="two-col">Recieving</h4>
            <div class="stat-box" style="border-left: 3px solid #{stats.away.color}">
                <h5>{awayRecievingLeader.leaders[0]?.athlete.shortName}</h5>
                <p class="bold">{awayRecievingLeader.leaders[0]?.value} YDS</p>
                <p class="small">{awayRecievingLeader.leaders[0]?.displayValue}</p>
            </div>
            <div class="stat-box" style="border-left: 3px solid #{stats.home.color}">
                <h5>{homeRecievingLeader.leaders[0]?.athlete.shortName}</h5>
                <p class="bold">{homeRecievingLeader.leaders[0]?.value} YDS</p>
                <p class="small">{homeRecievingLeader.leaders[0]?.displayValue}</p>
            </div>
        </div>
    </div>
</section>


<style>
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2px;
    }

    .two-col {
        grid-column: span 2;
        background-color: #333;
        margin: 0.5em;
    }

    .bold {
        font-weight: bold;
    }

    .small {
        font-size: 0.75rem;
    }

    .team-name {
        margin-bottom: 0;
        line-height: 0.8;
    }

    .stat-box {
        border-left: 1px solid #444;
        padding: 0 0 0 0.5em;
    }

    .stat-box > * {
        margin: 0;
    }

    #stats-leaders {
        margin: 1rem 0;
    }

    .stats-leaders {
        background-color: #222;
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px solid #444;
    }

    h2 {
        margin: 0;
        background-color: #333;
    }

</style>