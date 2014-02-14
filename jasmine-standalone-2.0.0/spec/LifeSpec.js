describe('Life class', function() {
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

});