/**
 * Global life class houses all application logic
 */
var life = (function life() {

    /**
     * Protected Vars
     */
    var maxX = 10,
        maxY = 10,
        currentOn = [];

    return {
        getBoard: function() {
            return {x: maxX, y: maxY};
        },

        getCurrentOn: function() {
            return currentOn;
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
            if (args.on && args.on) currentOn = args.on;
        }
    };

})();
