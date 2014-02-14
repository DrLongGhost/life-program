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

            life.init({board: {x: parseInt(colCount), y: parseInt(rowCount) },
                          on: [] });
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

        }
    };
})(life);