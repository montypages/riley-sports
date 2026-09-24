<script>
    let { stats } = $props();
</script>

<section id="stats-leaders">
    <div class="container">
        <h2>Stats Leaders</h2>
        <div class="stats-grid">
            <!-- Teams -->
             <h3>{stats.away.abbreviation}</h3>
             <h3>{stats.home.abbreviation}</h3>
            <!-- Passing -->
            <h4 class="two-col">Passing</h4>
            <div class="stat-box">
                <h5>{stats.passingLeaders.leaders[0].shortName}</h5>
                <p class="bold">YDS</p>
                <p class="small">stat-line</p>
            </div>
            <div class="stat-box">
                <h5>P. Name</h5>
                <p class="bold">YDS</p>
                <p class="small">stat-line</p>
            </div>
            <!-- Rushing -->
            <h4 class="two-col">Rushing</h4>
            <div class="stat-box">
                <h5>P. Name</h5>
                <p class="bold">YDS</p>
                <p class="small">stat-line</p>
            </div>
            <div class="stat-box">
                <h5>P. Name</h5>
                <p class="bold">YDS</p>
                <p class="small">stat-line</p>
            </div>
            
            <!-- Receiving -->
            <h4 class="two-col">Recieving</h4>
            <div class="stat-box">
                <h5>P. Name</h5>
                <p class="bold">YDS</p>
                <p class="small">stat-line</p>
            </div>
            <div class="stat-box">
                <h5>P. Name</h5>
                <p class="bold">YDS</p>
                <p class="small">stat-line</p>
            </div>
        </div>
    </div>
</section>


<style>
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .two-col {
        grid-column: span 2;
    }

    .bold {
        font-weight: bold;
    }

    .small {
        font-size: 0.75rem;
    }

</style>