/**
 * Global lifedom class houses application logic which connects the
 * life class to the DOM
 */
var lifedom = (function lifedom(life) {
    var $table,
        $form,
        $turnCount,
        turnCount = 1,
        $tps,
        priorTurn = 1;

    return {

        /**
         * Updates internal/external state to match the settings in the form
         */
        applySettings: function() {
            // zero out the model
            $table.html();
            this.buildTable($table, true);
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
             form += '<strong id="turnCount">1</strong>';

             form += '<label for="speed">Speed (lower to speed up): </label>';
             form += '<input type="range" id="speed" min="1" max="1000" value="50">';

             form += '&nbsp;&nbsp;<input type="button" id="play" value="Play">';

             form += '<br/><hr><br/>';

             form += '<label for="tps">Performance: </label>';
             form += '<strong id="tps">0</strong> turns per second';

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
                    table += '<td id="' + x + 'x' + y + '" class="off"></td>';
                }
                table += '</tr>';
            }
            table += '</table>';

            $table = $(node).html(table);

            if (!suppressEvents) {
                $table.on('click', 'td', function() {
                    $(this).toggleClass('on off');
                });
            }
        },

        /**
         * Main init wrapper
         * @param {DOM Node} Parent for form
         * @param {DOM Node} Parent for table
         */
        init: function(formParent, tableParent) {
            this.buildForm($(formParent));
            this.buildTable($(tableParent));
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

            if (!subsequentCall) {
                playVal = ($play.val() === 'Play') ? 'Stop' : 'Play';
                $play.val(playVal);

                if (playVal === 'Play') {
                    window.clearTimeout(this.playing);
                    return true;
                }
            }

            this.syncDomToLife();

            this.playing = window.setTimeout(function() {
                life.doTurn();
                _this.syncLifeToDom();
                _this.play(true);

                // Post turn actions
                $turnCount.html(++turnCount);
                if (turnCount==150) {
                    alert($tps.html() + 'tps at turn 150');
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
                enabledCells = [],
                plots;

            $table.find('td.on').each(function(index, el){
                plots = $(el).attr('id').split('x');
                enabledCells.push({ x: parseInt(plots[0]), y: parseInt(plots[1]) });
            });

            life.init({board: {x: parseInt(colCount), y: parseInt(rowCount) },
                          on: enabledCells });
        },

        /**
         * Updates the table to reflect the current data in the life class
         * TODO: Optimize this function by not disabling cells which will be
         * turned back on
         */
        syncLifeToDom: function() {
            var currentOn = life.getCurrentOn();

            // Turn everything off
            $table.find('td.on').toggleClass('on off');

            // Turn enabled cells on
            _.each(currentOn, function(yAxes, key) {
                xAxis = parseInt(key.substr(1));
                _.each(yAxes, function(yAxis) {
                    $table.find('#'+xAxis+'x'+yAxis).toggleClass('on off');
                });
            });
        }
    };
})(life);