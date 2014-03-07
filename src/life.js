/**
 * Global life class houses all application logic
 */
var life = (function life() {

    /**
     * Protected Vars
     */
    var maxX = 10,
        maxY = 10,
        currentOn = priorOn = {};

    return {
        getBoard: function() {
            return {x: maxX, y: maxY};
        },

        getCurrentOn: function() {
            return currentOn;
        },

        getPriorOn: function() {
            return priorOn;
        },

        /**
         * Counts the number of adjacent cells that are enabled,
         * comparing the passed plot points against currentOn.
         * @arg {Object} plotObj Defined as follows: {x:2, y:44}
         * @return Integer
         */
        countAdjacentOn: function(plotObj) {
            var count = 0,
                Xs = [ plotObj.x - 1, plotObj.x, plotObj.x + 1 ],
                Ys = [ plotObj.y - 1, plotObj.y, plotObj.y + 1 ];

            _.each(Xs, function(xAxis) {
                if (currentOn['x'+xAxis]) {
                    if (_.indexOf(currentOn['x'+xAxis], Ys[0])!==-1) count++;
                    if ( xAxis !== Xs[1] &&
                        _.indexOf(currentOn['x'+xAxis], Ys[1])!==-1
                        ) {
                            count++;
                        }
                    if (_.indexOf(currentOn['x'+xAxis], Ys[2])!==-1) count++;
                }
            });

            return count;
        },

        /**
         * Parent function that calls other helper functions to recalculate
         * currentOn for a single "turn"
         */
        doTurn: function() {
            var _this = this,
                plots = this.findPlotsToCount(),
                newCurrentOn = [],
                count,
                processed = {};

            _.each(plots, function(plot) {
                if (processed[plot.x+'x'+plot.y]) return true;

                count = _this.countAdjacentOn(plot);
                if ( (count === 2 && _this.isOn(plot)) || count === 3) {
                    newCurrentOn.push(plot);
                }
                processed[plot.x+'x'+plot.y] = true; // skip duplicates
            });

            priorOn = currentOn;
            currentOn = this.groupByX(newCurrentOn);
        },

        /**
         * Looks at the contents of currentOn to determine a list of plot
         * points which need to be checked within a turn
         * TODO: Future optimization would involve preventing duplicates
         * TODO: Dont push in points that are off the grid
         * @return Array Array of objects containing X and Y plots for which
         * countAdjacentOn() should be called
         */
        findPlotsToCount: function() {
            var plots = [],
                xAxis;

            _.each(currentOn, function(yAxes, key) {
                xAxis = parseInt(key.substr(1));
                _.each(yAxes, function(yAxis) {
                    // Mucho copy-pasteo
                    plots.push({x: xAxis-1, y: yAxis-1});
                    plots.push({x: xAxis, y: yAxis-1});
                    plots.push({x: xAxis+1, y: yAxis-1});
                    plots.push({x: xAxis-1, y: yAxis});
                    plots.push({x: xAxis, y: yAxis});
                    plots.push({x: xAxis+1, y: yAxis});
                    plots.push({x: xAxis-1, y: yAxis+1});
                    plots.push({x: xAxis, y: yAxis+1});
                    plots.push({x: xAxis+1, y: yAxis+1});
                });
            });

            return plots;
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
            if (args.on && typeof args.on !== 'undefined') currentOn = this.groupByX(args.on);
        },

        /**
         * Determines whether or not a point is on by comparing it against
         * currentOn
         * @param {Object} plot point in the format {x: 3, y: 4}
         * @return {Boolean}
         */
        isOn: function(point) {
            return (currentOn['x'+point.x] &&
                    currentOn['x'+point.x].indexOf(point.y)!==-1) ?
                   true: false;
        }
    };

})();
