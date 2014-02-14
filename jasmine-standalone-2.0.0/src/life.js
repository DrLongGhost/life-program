/**
 * Global life class houses all application logic
 */
var life = (function life() {

    /**
     * Protected Vars
     */
    var maxX = 10,
        maxY = 10,
        currentOn = {};

    return {
        getBoard: function() {
            return {x: maxX, y: maxY};
        },

        getCurrentOn: function() {
            return currentOn;
        },

        /**
         * Converts an array of individual plots into an object indexed
         * by X-Axis. This is done for optimization purposes
         * TODO: Future optimization would keep inner arrays sorted to
         * speed up lookups.
         */
        groupByX: function(plots) {
            var i, key, obj = {};

            for (i=0; i<plots.length; i++) {
                key = 'x'+plots[i].x;
                if (obj[key]) {
                    obj[key].push(plots[i].y);
                } else {
                    obj[key] = [ plots[i].y ];
                }
            }
            return obj;
        },

        /**
         * Define an initial life board
         * @param {Object} args. Supports the following:
         *   {
         *     board: { x: 5, y: 5}, // creates a 5x5 board
         *     on: [
         *         { x: 3, y: 4 },   // specifies all points
         *         { x: 3, y: 3 },   // on the board that are "on"
         *         { x: 3, y: 2 },
         *     ]
         *   }
         */
        init: function(args) {
            if (args.board && args.board.x) maxX = args.board.x;
            if (args.board && args.board.y) maxY = args.board.y;
            if (args.on && args.on) currentOn = this.groupByX(args.on);
        }
    };

})();
