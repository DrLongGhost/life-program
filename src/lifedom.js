/**
 * Global lifedom class houses application logic which connects the
 * life class to the DOM
 */
var lifedom = (function lifedom(life) {
    var $table,
        $form,

        // Track turns & performance
        $turnCount,
        turnCount = 1,
        $tps,
        priorTurn = 1,

        // Array of IDs of enabled cells
        enabledCells = [],
        ENABLED_COLOR = '#00CC00',

        // Cache dom nodes
        nodes = {},
        cvsNode, cvs,
        cSize = 10, // small
        cWidth, cHeight,

        // Animation Style
        useCanvas = false;
        useDom = true;

    return {

        /**
         * Updates internal/external state to match the settings in the form
         */
        applySettings: function() {
            // zero out the model
            life.init({on:[]});
            nodes = {};
            $table.html();
            enabledCells = [];
            this.buildTable($table, true);
            this.buildCanvas();
        },

        buildCanvas: function() {
            var colCount = parseInt($('#colCount').val(), 10) || 5,
                rowCount = parseInt($('#rowCount').val(), 10) || 5;

            /*
            if ($('#medium').is(':checked')) {
                cSize = 20;
            } else if ($('#large').is(':checked')) {
                cSize = 40;
            }
            */

            cvsNode = document.getElementById('cvs');

            cWidth = (cSize * colCount);
            cHeight = (cSize * rowCount);
            cvsNode.setAttribute('width', cWidth + 'px');
            cvsNode.setAttribute('height', cHeight + 'px');
            cvs = cvsNode.getContext('2d');
            cvs.fillStyle = 'rgb(0,204,0)';
        },

        /**
         * Adds form controls to the passed DOM node. Also binds events
         * to the new form.
         */
        buildForm: function(node) {
            var form,
                _this = this;

             form  = '<div id="life-form">';

             form += '<label for="rowCount">Number of Rows: </label>';
             form += '<input type="number" id="rowCount" value="5">';

             form += '<label for="colCount">Number of Columns: </label>';
             form += '<input type="number" id="colCount" value="5">';

             form += ' <input type="button" id="applySettings" value="Resize Table">';

             form += '<br/><input type="radio" name="size" id="small" value="small">';
             form += '<label for="size1">Small Cells</label>&nbsp;&nbsp;&nbsp;&nbsp;';

             form += '<input type="radio" name="size" id="medium" value="medium" checked>';
             form += '<label for="size2">Medium Cells</label>&nbsp;&nbsp;&nbsp;&nbsp;';

             form += '<input type="radio" name="size" id="large" value="large">';
             form += '<label for="size3">Large Cells</label>';

             form += '<br/><hr><br/>';

             form += '<label for="turnCount">Turn: </label>';
             form += '<strong id="turnCount">1</strong>&nbsp;&nbsp;&nbsp;';

             form += '<label for="speed">Speed (lower to speed up): </label>';
             form += '<input type="range" id="speed" min="1" max="1000" value="50">';

             form += '&nbsp;&nbsp;<input type="button" id="play" value="Play">';

             form += '<br/><hr><br/>';

             form += '<label for="tps">Performance: </label>';
             form += '<strong id="tps">0</strong> turns per second';

             form += '<br/><br/><label for="useCanvas">Use canvas animation </label>';
             form += '<input type="checkbox" value="1" id="useCanvas" />';

             form += '</div>';

             $form = $(node).html(form);

             // Cache form elements
             $turnCount = $('#turnCount');
             $tps = $('#tps');

             // Register events
             $form.on('click', '#applySettings', function() {
                 _this.applySettings();
             });
             $form.on('click', '#play', function() {
                 _this.play();
             });
             $form.on('click', '#small, #medium, #large', function(radio) {
                 $table.find('table').get(0).className = $(this).val();
                 window.setTimeout(_this.buildCanvas, 0);
             });
             $form.on('click', '#turnCount', this.resetTurnCount);

             // Monitor tps
             window.setInterval(function() {
                 var tps = turnCount - priorTurn;
                 if (tps < 0) tps = 0;
                 priorTurn = turnCount;
                 $tps.html(tps);
             }, 1000);
        },

        /**
         * Creates a table/life object based on the parameters contained in
         * the #life-form form fields
         */
        buildTable: function(node, suppressEvents) {
            var table,
                colCount = $form.find('#colCount').val() || 5,
                rowCount = $form.find('#rowCount').val() || 5,
                x, y;

            table = '<table class="medium" id="life-table" cellspacing="0" cellpadding="0">';

            for (y=rowCount; y>0; y--) {
                table += '<tr>';
                for (x=1; x<=colCount; x++) {
                    table += '<td id="' + x + 'x' + y + '"></td>';
                }
                table += '</tr>';
            }
            table += '</table>';

            $table = $(node).html(table);

            if (!suppressEvents) {
                $table.on('click', 'td', function() {
                    if (this.style.backgroundColor) {
                        this.style.backgroundColor = '';
                        enabledCells.splice(enabledCells.indexOf(this.id), 1);
                    } else {
                        this.style.backgroundColor = ENABLED_COLOR;
                        enabledCells.push(this.id);
                    }
                });
            }
        },

        /**
         * General purpose logic for drawing a square
         * @param {Int} xAxis
         * @param {Int} yAxis
         * @param {String} Either "on" or "off"
         */
        drawCanvasSquare: function(xAxis, yAxis, mode) {
            var method = (mode === 'on') ? 'fillRect' : 'clearRect',
                x, y;

            x = (xAxis * cSize) - cSize;
            y = ((yAxis - ($form.find('#rowCount').val() * 1)) * -1) * cSize;
            cvs[method](x, y, cSize, cSize);
        },

        /**
         * Provides a cache around getElementById
         */
        getNode: function(id) {
            if (nodes[id]) return nodes[id];

            nodes[id] = document.getElementById(id);
            return nodes[id];
        },

        /**
         * Main init wrapper
         * @param {DOM Node} Parent for form
         * @param {DOM Node} Parent for table
         */
        init: function(formParent, tableParent) {
            this.buildForm($(formParent));
            this.buildTable($(tableParent));
            this.buildCanvas();
        },

        /**
         * Starts the action
         */
        play: function(subsequentCall) {
            var $turns = $form.find('#turnCount'),
                _this = this,
                $play = $form.find('#play'),
                playVal,
                speed = $form.find('#speed').val();

            if (!subsequentCall) { // initial call of play()
                playVal = ($play.val() === 'Play') ? 'Stop' : 'Play';
                $play.val(playVal);

                if (playVal === 'Play') {
                    // STOP
                    $('#tableParent').show();
                    $(cvsNode).hide();
                    this.updateEnabledCellsFromCurrentOn();
                    window.clearTimeout(this.playing);
                    this.syncLifeToDom(true);
                    return true;
                } else {
                    // PLAY
                    if ($('#useCanvas').is(':checked')) {
                        useCanvas = true;
                        useDom = false;

                        // Draw the currently enabled cells right quick
                        for (var i=enabledCells.length-1; i>-1; i--) {
                            plots = enabledCells[i].split('x');
                            _this.drawCanvasSquare(parseInt(plots[0]), parseInt(plots[1]), 'on');
                        }

                        $(cvsNode).show();
                        $('#tableParent').hide();
                    } else {
                        useDom = true;
                        useCanvas = false;
                    }
                }

                this.syncDomToLife();
            }

            this.playing = window.setTimeout(function() {
                life.doTurn();
                _this.syncLifeToDom();
                _this.play(true);

                // Post turn actions
                $turnCount.html(++turnCount);
                if (turnCount==150) {
                    console.log($tps.html() + 'tps at turn 150');
                }

            }, speed);
        },

        /**
         * Resets the turn counter back to 1
         */
        resetTurnCount: function() {
            turnCount = 1;
            $turnCount.html(1);
        },

        /**
         * Overwrites life's internal state with that stored in the Dom table
         */
        syncDomToLife: function() {
            var colCount = $form.find('#colCount').val() || 5,
                rowCount = $form.find('#rowCount').val() || 5,
                enabledCellsForInit = [],
                plots;

            for (var i=enabledCells.length-1; i>-1; i--) {
                plots = enabledCells[i].split('x');
                enabledCellsForInit.push({ x: parseInt(plots[0]), y: parseInt(plots[1]) });
            }

            life.init({board: {x: parseInt(colCount), y: parseInt(rowCount) },
                          on: enabledCellsForInit });
        },

        /**
         * Updates the table to reflect the current data in the life class
         * TODO: Optimize this function by not disabling cells which will be
         * turned back on
         * @param {Boolean} Pass true to do a full refresh of the Dom
         */
        syncLifeToDom: function(fullRefresh) {
            if (fullRefresh === true) {
                // Turn everything that's on, off
                $table.find('td').css('backgroundColor', '');

                // Draw the currently enabled cells
                for (var i=enabledCells.length-1; i>-1; i--) {
                    var node = this.getNode(enabledCells[i]);
                    if (node) node.style.backgroundColor = ENABLED_COLOR;
                }
                return true;
            }

            var newEnabled = life.getNewEnabled(),
                newDisabled = life.getNewDisabled(),
                _this = this, d;

            // Turn disabled cells off
            _.each(newDisabled, function(yAxes, xAxis) {
                _.each(yAxes, function(yAxis) {
                    if (useDom) {
                        d = _this.getNode(xAxis+'x'+yAxis);
                        if (d) { d.style.backgroundColor = ''; }
                    } else {
                        // canvas
                        _this.drawCanvasSquare(xAxis, yAxis, 'off');
                    }

                });
            });

            // Turn enabled cells on
            _.each(newEnabled, function(yAxes, xAxis) {
                _.each(yAxes, function(yAxis) {
                    if (useDom) {
                        d = _this.getNode(xAxis+'x'+yAxis);
                        if (d) { d.style.backgroundColor = ENABLED_COLOR; }
                    } else {
                        // canvas
                        _this.drawCanvasSquare(xAxis, yAxis, 'on');
                    }
                });
            });
        },

        /**
         * Updates the enabledCells array with the contents of currentOn
         * @return {Array} Returns currentOn for ease of unit testing
         */
        updateEnabledCellsFromCurrentOn: function() {
            var currentOn = life.getCurrentOn();
            enabledCells = [];

            _.each(currentOn, function(yAxes, xAxis) {
                _.each(yAxes, function(placeholder, yAxis) {
                    enabledCells.push(xAxis + 'x' + yAxis);
                });
            });
            return enabledCells;
        }
    };
})(life);