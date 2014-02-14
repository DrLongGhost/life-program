describe('Life class', function() {
    var defaultInitArgs = {
        board: {x:5, y:5},
        on: [
              { x: 3, y: 4 },
              { x: 3, y: 3 },
              { x: 3, y: 2 }
            ]
        };

    it('should be defined', function() {
      expect(life).toBeDefined();
    });

    describe('init function', function() {
        it('should be defined', function() {
            expect(typeof life.init).toBe('function');
        });

        it('should set game board size', function() {
            life.init({board: {x:5, y:5}});
            expect(life.getBoard()['x']).toBe(5);
        });

        it('should accept game state', function() {
          life.init({on: [
              { x: 3, y: 4 },
              { x: 3, y: 3 },
              { x: 3, y: 2 }
          ]});
          expect(life.getCurrentOn()['x3'].length).toBe(3);
        });
    });

    describe('groupByX function', function() {
        it('should be defined', function() {
            expect(typeof life.groupByX).toBe('function');
        });

        it('should group by X', function() {
            var results = life.groupByX([{ x: 3, y: 4 }]);
            expect(results.x3).toContain(4);
        });
    });

    describe('countAdjacentOn', function() {
        beforeEach(function() {
            life.init(defaultInitArgs);
        });

        it('should be defined', function() {
            expect(typeof life.countAdjacentOn).toBe('function');
        });

        it('should return valid count for center point', function() {
            var point = { x: 3, y: 3};
            expect(life.countAdjacentOn(point)).toBe(2);
        });

        it('should return valid count for top left', function() {
            var point = { x: 1, y: 5};
            expect(life.countAdjacentOn(point)).toBe(0);
        });

        it('should return valid count for middle top', function() {
            var point = { x: 3, y: 5};
            expect(life.countAdjacentOn(point, true)).toBe(1);
        });

    });

});