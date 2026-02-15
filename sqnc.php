<?php
// start session
session_start();
?>
<!DOCTYPE html>
<html lang="en">
    <!-- Web Programming, sqnc drum machine -->
    <head>
        <title>sqnc</title>
        <meta charset="utf-8" />
        <link href="style/sqnc.css" type="text/css" rel="stylesheet" />
        <script src="https://unpkg.com/tone@14.7.77/build/Tone.js"></script>
        <!--<script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js" type="text/javascript"></script>-->
        <script src="js/audio-engine.js"></script>
        <script src="js/sequencer.js"></script>
        <script src="js/api.js"></script>
        <script src="js/ui-controls.js"></script>
       <!--<script src="js/modals.js"></script>-->
    </head>
    <body>
        <header>
            <a href="sqnc.php" id="header-logo">sqnc</a>
            <div id="options">
                <?php
                    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
                    ?>
                    <a href="sqnc.php">User Library</a>
                    <a href="api/logout.php">Log Out</a>
                    <?php
                    }else {
                    ?>
                    <a href="login.php">Log In</a>
                    <?php
                    }
                    ?>
            </div>
        </header>
    <?php
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
                ?>
                <h1>hello <?= $_SESSION['username'] ?></h1>
                <?php
            }
    ?>
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
                        <button class="trackBtn" data-index="9">T10</button>
                        <button id="master" class="trackBtn" data-index="99">Master</button>
                    </div>
                    <div id="params">
                        <div id="topParams">
                            <div id="trackParams">
                                <div class="paramRow" id="stateRow">
                                    <div id="selector">
                                        <label for="sequences">Sequence</label>
                                        <select name="sequences" id="sequences">Log in to save sequences</select>
                                    </div>
                                    <button id="save">Save</button>
                                    <button id="reload">Reload</button>
                                    <button id="new">New</button>
                                </div>
                                <div class="paramRow" id="selectorRow">
                                    <div id="selector">
                                        <label for="samples">Sample</label>
                                        <select name="samples" id="samples"></select>
                                    </div>
                                    <form action="upload-sample.php" method="post" enctype="multipart/form-data">
                                        <label for="file" id="upload-button">Upload</label>
                                        <input type="file" name="file" id="file" value="Upload"
                            enctype="multipart/form-data" accept=".wav,.mp3">
                                    </form>
                                    <!--<button id="sampleManager">Manager</button>-->
                                </div>
                                <div class="paramRow">
                                    <div class="house">
                                        <h2>Volume</h2>
                                        <div id="volumeDisplay" class="display">-12dB</div>
                                        <input type="range" min="-60" max="6" step="1" value="-12" class="slider" id="volume">
                                    </div>
                                    <div class="house">
                                        <h2>Pan</h2>
                                        <div id="panDisplay" class="display">0</div>
                                        <input type="range" min="-1" max="1" step="0.02" value="0" class="slider" id="pan">
                                    </div>
                                    <div class="house">
                                        <h2>Pitch</h2>
                                        <div id="pitchDisplay" class="display">0.0</div>
                                        <input type="range" min="-12" max="12" step="0.01" value="0" class="slider" id="pitch">
                                    </div>
                                    <div class="house">
                                        <h2>Start</h2>
                                        <div id="startDisplay" class="display">0</div>
                                        <input type="range" min="0" max="1" step="0.01" value="0" class="slider" id="start">
                                    </div>
                                </div>
                                <div class="paramRow">
                                    <div class="house">
                                        <h2>Attack</h2>
                                        <div id="attackDisplay" class="display">0</div>
                                        <input type="range" min="0" max="2" step="0.01" value="0" class="slider" id="attack">
                                    </div>
                                     <div class="house">
                                        <h2>Decay</h2>
                                        <div id="decayDisplay" class="display">100</div>
                                        <input type="range" min="0.01" max="2" step="0.01" value="2" class="slider" id="decay">
                                    </div>
                                    <div class="house">
                                        <h2>Sustain</h2>
                                        <div id="sustainDisplay" class="display">100</div>
                                        <input type="range" min="0" max="1" step="0.01" value="1" class="slider" id="sustain">
                                    </div>
                                    <div class="house">
                                        <h2>Release</h2>
                                        <div id="releaseDisplay" class="display">0</div>
                                        <input type="range" min="0" max="5" step="0.01" value="0" class="slider" id="release">
                                    </div>
                                </div>
                                <div class="paramRow">
                                    <div class="house">
                                        <h2>LP Width</h2>
                                        <div id="lpWidthDisplay" class="display">5.0kHz</div>
                                        <input type="range" min="0" max="5000" value="20000" class="slider" id="lpWidth">
                                    </div>
                                    <div class="house">
                                        <h2>LP Q</h2>
                                        <div id="lpqDisplay" class="display">0</div>
                                        <input type="range" min="0" max="20" step="0.1" value="0" class="slider" id="lpq">
                                    </div>
                                    <div class="house">
                                        <h2>HP Width</h2>
                                        <div id="hpWidthDisplay" class="display">10Hz</div>
                                        <input type="range" min="10" max="5000" value="10" class="slider" id="hpWidth">
                                    </div>
                                    <div class="house">
                                        <h2>HP Q</h2>
                                        <div id="hpqDisplay" class="display">0</div>
                                        <input type="range" min="0" max="20" step="0.1" value="0" class="slider" id="hpq">
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
                                <div class="display" id="masterVolDisplay">-6dB</div>
                                <input type="range" min="-60" max="0" value="-6" class="slider" id="masterVol">
                            </div>
                            <div class="house">
                                <h2>Tempo</h2>
                                <div class="display" id="tempoDisplay">120</div>
                                <input type="range" min="1" max="300" value="120" class="slider" id="tempo">
                            </div>
                            <div class="house">
                                <h2>Swing</h2>
                                <div class="display" id="swingDisplay">0</div>
                                <input type="range" min="0" max="1" step=".01" value="0" class="slider" id="swing">
                            </div>
                            <button id="transport" class="global">Play</button>
                            <button id="record" class="global">Record</button>
                            <button id="clear" class="global">Clear</button>
                            <div id="pages">
                                <button id="page1" class="global selected" data-index="0">Page</button>
                                <!--<button id="page2" class="page" data-index="1">2:4</button>
                                <button id="page3" class="page" data-index="2">3:4</button>
                                <button id="page4" class="page" data-index="3">4:4</button>-->
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
        <footer></footer>
        <!-- Modal Screens -->

        <!-- Sample Manager Modal -->
        <div id="sequence-overlay" class="modal-overlay modal-hidden">
            <div class="modal-box">
                <h3>New Sequence</h3>
                <input type="text" id="seq-name" placeholder="Name your sequence">
                <div class="modal-footer">
                    <button id="sequence-close-btn">Cancel</button>
                    <button id="sequence-init-btn">Save</button>
                </div>
            </div>
        </div>

        <!-- Login/Sign Up Modal -->
         <!--
        <div id="account-overlay" class="modal-overlay modal-hidden">
            <div class="modal-box">
                <h3>Save Sequence</h3>
                <input type="text" id="seq-name" placeholder="Name your track...">
                <div class="modal-footer">
                    <button id="account-close-btn">Cancel</button>
                    <button class="account-save-btn">Save</button>
                </div>
            </div>
        </div>
        -->
	</body>
</html>
