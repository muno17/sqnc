<?php include("top.php"); ?>

<div id="sqnc">
    <div id="tracks">
        <div id="trackButtons">
            <button id="track1">Track 1</button>
            <button id="track2">Track 2</button>
            <button id="track3">Track 3</button>
            <button id="track4">Track 4</button>
            <button id="track5">Track 5</button>
        </div>
        <div id="parameters">

        </div>
    </div>
    <div id="globalParams">
        <div class="house">
            <h2>Volume</h2>
            <div class="display" id="volDisplay">-6db</div>
            <input type="range" min="-60" max="0" value="-6" class="slider" id="vol">
        </div>
        <div class="house">
            <h2>Tempo</h2>
            <div class="display" id="tempoDisplay">120</div>
            <input type="range" min="1" max="300" value="120" class="slider" id="tempo">
        </div>
        <button id="play" class="global">Play</button>
        <button id="stop" class="global">Stop</button>
        <button id="record" class="global">Record</button>
    </div>
    <div id="sequencer">
        <button class="step" data-step="0">0</button>
        <button class="step" data-step="1">1</button>
        <button class="step" data-step="2">2</button>
        <button class="step" data-step="3">3</button>
        <button class="step" data-step="4">4</button>
        <button class="step" data-step="5">5</button>
        <button class="step" data-step="6">6</button>
        <button class="step" data-step="7">7</button>
        <button class="step" data-step="8">8</button>
        <button class="step" data-step="9">9</button>
        <button class="step" data-step="10">10</button>
        <button class="step" data-step="11">11</button>
        <button class="step" data-step="12">12</button>
        <button class="step" data-step="13">13</button>
        <button class="step" data-step="14">14</button>
        <button class="step" data-step="15">15</button>
    </div>
</div>

<?php include("bottom.html"); ?>