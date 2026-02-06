<?php include("top.php"); ?>

<div id="sqnc">
    <img class="wood" src="style/wood-pattern.png">
    <div id="sqncBody">
        <div id="top">
            <div id="tracks">
                <button class="trackBtn selected" data-index="0">T1</button>
                <button class="trackBtn" data-index="1">T2</button>
                <button class="trackBtn" data-index="2">T3</button>
                <button class="trackBtn" data-index="3">T4</button>
                <button class="trackBtn" data-index="4">T5</button>
                <button class="trackBtn" data-index="5">T6</button>
                <button class="trackBtn" data-index="6">T7</button>
                <button class="trackBtn" data-index="7">T8</button>
                <button class="trackBtn" data-index="8">T9</button>
                <button class="trackBtn" data-index="10">T10</button>
            </div>
            <div id="params">
                <div id="topParams">
                    <div id="trackParams">
                        <div class="paramRow" id="selectorRow">
                            <div id="sampleSelector">
                                <label for="samples">Sample</label>
                                <select name="samples" id="samples">
                                    <option value="t1">test1</option>
                                    <option value="t2">test2</option>
                                    <option value="t3">test3</option>
                                </select>
                            </div>
                            <button>Save</button>
                            <button>Reload</button>
                            <button>New</button>
                        </div>
                        <div class="paramRow">
                            <div class="house">
                                <h2>Volume</h2>
                                <div id="volumeDisplay" class="display">-6dB</div>
                                <input type="range" min="-60" max="0" value="-6" class="slider" id="volume">
                            </div>
                            <div class="house">
                                <h2>Balance</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="balance">
                            </div>
                            <div class="house">
                                <h2>Rate</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="rate">
                            </div>
                            <div class="house">
                                <h2>Pitch</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="pitch">
                            </div>
                        </div>
                        <div class="paramRow">
                            <div class="house">
                                <h2>Start</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="start">
                            </div>
                            <div class="house">
                                <h2>Attack</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="attack">
                            </div>
                            <div class="house">
                                <h2>Hold</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="hold">
                            </div>
                            <div class="house">
                                <h2>Release</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="release">
                            </div>
                        </div>
                        <div class="paramRow">
                            <div class="house">
                                <h2>Base</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="base">
                            </div>
                            <div class="house">
                                <h2>Width</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="width">
                            </div>
                            <div class="house">
                                <h2>Resonance</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="res">
                            </div>
                            <div class="house">
                                <h2>Distortion</h2>
                                <div class="display">0</div>
                                <input type="range" min="0" max="100" value="0" class="slider" id="dist">
                            </div>
                        </div>
                    </div>
                    <div id="masterParams">
                        <div id="logo">sqnc</div>
                    </div>
                </div>
                <div id="globalParams">
                    <div class="house">
                        <h2>Master Vol</h2>
                        <div class="display" id="masterDisplay">-6dB</div>
                        <input type="range" min="-60" max="0" value="-6" class="slider" id="master">
                    </div>
                    <div class="house">
                        <h2>Tempo</h2>
                        <div class="display" id="tempoDisplay">120</div>
                        <input type="range" min="1" max="300" value="120" class="slider" id="tempo">
                    </div>
                    <button id="transport" class="global">Play</button>
                    <button id="record" class="global">Record</button>
                    <div id="pages">
                        <button id="page1" class="page selected" data-index="0">1:4</button>
                        <button id="page2" class="page" data-index="1">2:4</button>
                        <button id="page3" class="page" data-index="2">3:4</button>
                        <button id="page4" class="page" data-index="3">4:4</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="sequencer">
            <button class="step" data-step="0">1</button>
            <button class="step" data-step="1">2</button>
            <button class="step" data-step="2">3</button>
            <button class="step" data-step="3">4</button>
            <div class="divider"></div>
            <button class="step" data-step="4">5</button>
            <button class="step" data-step="5">6</button>
            <button class="step" data-step="6">7</button>
            <button class="step" data-step="7">8</button>
            <div class="divider"></div>
            <button class="step" data-step="8">9</button>
            <button class="step" data-step="9">10</button>
            <button class="step" data-step="10">11</button>
            <button class="step" data-step="11">12</button>
            <div class="divider"></div>
            <button class="step" data-step="12">13</button>
            <button class="step" data-step="13">14</button>
            <button class="step" data-step="14">15</button>
            <button class="step" data-step="15">16</button>
        </div>
    </div>
    <img class="wood" src="style/wood-pattern.png">
</div>

<?php include("bottom.html"); ?>