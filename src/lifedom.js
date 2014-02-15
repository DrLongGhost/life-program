/**
 * Global lifedom class houses application logic which connects the
 * life class to the DOM
 */
var lifedom = (function lifedom(life) {
    var $table,
        $form;

    return {

        /**
         * Updates internal/external state to match the settings in the form
         */
        applySettings: function() {

        },

        /**
         * Adds form controls to the passed DOM node. Also binds events
         * to the new form.
         */
        buildForm: function(node) {
            var form;

             form  = '<div id="life-form">';

             form += '<label for="rowCount">Number of Rows:</label>';
             form += '<input type="text" id="rowCount" value="5">';

             form += '<label for="colCount">Number of Columns:</label>';
             form += '<input type="text" id="colCount" value="5">';
             form += '</label>';

             form += '<label for="applySettings">';
             form += '<input type="button" id="applySettings" value="Apply Settings">';
             form += '</label>';

             form += '</div>';

             $form = $(node).html(form);

             // Register events
             $form.on('click', '#applySettings', this.applySettings);
        },

        /**
         * Creates a table/life object based on the parameters contained in
         * the #life-form form fields
         */
        buildTable: function(node) {
            var table,
                colCount = $form.find('#colCount').val() || 5,
                rowCount = $form.find('#rowCount').val() || 5,
                x, y;

            table = '<table id="life-table">';

            for (y=rowCount; y>0; y--) {
                table += '<tr>';
                for (x=1; x<=colCount; x++) {
                    table += '<td id="' + x + 'x' + y + '" class="off"></td>';
                }
                table += '</tr>';
            }
            table += '</table>';

            $table = $(node).html(table);
            $table.on('click', 'td', function() {
                $(this).toggleClass('on off');
            });
        },

        /**
         * Main init wrapper
         */
        init: function() {

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