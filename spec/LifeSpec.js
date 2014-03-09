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
          expect(life.getCurrentOn()['3']['2']).toBe(1);
          expect(life.getCurrentOn()['3']['3']).toBe(1);
          expect(life.getCurrentOn()['3']['4']).toBe(1);
        });
    });

    describe('groupByX function', function() {
        it('should be defined', function() {
            expect(typeof life.groupByX).toBe('function');
        });

        it('should group by X', function() {
            var results = life.groupByX([{ x: 3, y: 4 }]);
            expect(results['3']['4']).toBe(1);
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

    describe('findPlotsToCount', function() {
        beforeEach(function() {
            life.init(defaultInitArgs);
        });

        it('should be defined', function() {
            expect(typeof life.findPlotsToCount).toBe('function');
        });

        it('should return correct list of plots', function() {
            var list = life.findPlotsToCount();
            expect(list.length).toBe(27);
        });
    });

    describe('isOn', function() {
        beforeEach(function() {
            life.init(defaultInitArgs);
        });

        it('should be defined', function() {
            expect(typeof life.isOn).toBe('function');
        });

        it('should return true for enabled points', function() {
            expect(life.isOn({x:3,y:4})).toBe(true);
        });

        it('should return false for disabled points', function() {
            expect(life.isOn({x:1,y:1})).toBe(false);
        });

    });

    describe('doTurn', function() {
        beforeEach(function() {
            life.init(defaultInitArgs);
        });

        it('should be defined', function() {
            expect(typeof life.doTurn).toBe('function');
        });

        it('should update currentOn', function() {
            life.doTurn();
            expect(life.getCurrentOn()['2']['3']).toBe(1);
            expect(life.getCurrentOn()['3']['3']).toBe(1);
            expect(life.getCurrentOn()['4']['3']).toBe(1);
        });

        it('should update priorOn', function() {
            life.doTurn();
            expect(life.getPriorOn()['3']['2']).toBe(1);
            expect(life.getPriorOn()['3']['3']).toBe(1);
            expect(life.getPriorOn()['3']['4']).toBe(1);
        });
    });

    describe('getNewEnabled', function() {
        beforeEach(function() {
            life.init(defaultInitArgs);
        });

        it('should be defined', function() {
            expect(typeof life.getNewEnabled).toBe('function');
        });

        it('should return only the new enabled plots', function() {
            life.doTurn();
            life.doTurn();
            expect(life.getNewEnabled()['3'].length).toBe(2);
            expect(life.getNewEnabled()['3'][0]).toBe('2');
            expect(life.getNewEnabled()['3'][1]).toBe('4');
        });

    });

    describe('getNewDisabled', function() {
        beforeEach(function() {
            life.init(defaultInitArgs);
        });

        it('should be defined', function() {
            expect(typeof life.getNewDisabled).toBe('function');
        });

        it('should return only the new enabled plots', function() {
            life.doTurn();
            life.doTurn();
            expect(life.getNewDisabled()['2'].length).toBe(1);
            expect(life.getNewDisabled()['4'].length).toBe(1);
            expect(life.getNewDisabled()['2'][0]).toBe('3');
            expect(life.getNewDisabled()['4'][0]).toBe('3');
        });

    });

});