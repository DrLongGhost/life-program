describe('Lifedom class', function() {
    var $div1, $div2;

    it('should be defined', function() {
        expect(lifedom).toBeDefined();
    });

    describe('buildForm method', function() {
        $div1 = $('<div>');

        beforeEach(function() {
            spyOn(lifedom, 'applySettings');
            lifedom.buildForm($div1);
        });

        it('should be defined', function() {
            expect(typeof lifedom.buildForm).toBe('function');
        });

        it('should add form controls', function() {
          expect($div1.find('#life-form').length).toBe(1);
        });

        it('should bind applySettings to #applySettings', function() {
            $div1.find('#applySettings').click();
            expect(lifedom.applySettings).toHaveBeenCalled();
        });
    });

    describe('buildTable method', function() {
        beforeEach(function() {
            $div1 = $('<div>');
            $div2 = $('<div>');
            lifedom.buildForm($div1);
            $div1.find('#rowCount').val(4);
            $div1.find('#colCount').val(4);
            lifedom.buildTable($div2);
        });

        it('should be defined', function() {
            expect(typeof lifedom.buildTable).toBe('function');
        });

        it('should build the correct size table', function() {
            expect($div2.find('td').length).toBe(16);
        });

        it('should bind toggleCellClass to the table cells', function() {
            $div2.find('#2x2').click();
            expect($div2.find('#2x2').css('backgroundColor')).toBe('rgb(0, 204, 0)');
        });
    });

    describe('syncDomToLife', function() {
        beforeEach(function() {
            $div1 = $('<div>');
            $div2 = $('<div>');
            lifedom.buildForm($div1);
            $div1.find('#rowCount').val(6);
            $div1.find('#colCount').val(6);
            lifedom.buildTable($div2);

            // turn on some cells
            $div2.find('#1x1, #2x2, #3x3').click();

            lifedom.syncDomToLife();
        });

        it('should be defined', function() {
            expect(typeof lifedom.syncDomToLife).toBe('function');
        });

        it('should set the board size', function() {
            expect(life.getBoard()['x']).toBe(6);
            expect(life.getBoard()['y']).toBe(6);
        });

        it('should set currentOn', function() {
            expect(life.getCurrentOn()['1'][1]).toBe(1);
            expect(life.getCurrentOn()['2'][2]).toBe(1);
            expect(life.getCurrentOn()['3'][3]).toBe(1);
        });
    });

    describe('syncLifeToDom', function() {
        beforeEach(function() {
            $div1 = $('<div>');
            $div2 = $('<div>');
            lifedom.buildForm($div1);
            $div1.find('#rowCount').val(5);
            $div1.find('#colCount').val(5);
            lifedom.buildTable($div2);

            // turn on some cells
            $div2.find('#3x4, #3x3, #3x2').click();

            life.init({board: {x: 5, y: 5 },
                          on: [
                              {x: 3, y: 4},
                              {x: 3, y: 3},
                              {x: 3, y: 2}
                          ] });
            lifedom.syncLifeToDom();
        });

        it('should be defined', function() {
            expect(typeof lifedom.syncLifeToDom).toBe('function');
        });

        it('should set the correct classes', function() {
            expect($div2.find('#3x4').css('backgroundColor')).toBe('rgb(0, 204, 0)');
            expect($div2.find('#2x3').css('backgroundColor')).toBe('');
            expect($div2.find('#3x3').css('backgroundColor')).toBe('rgb(0, 204, 0)');
            expect($div2.find('#4x3').css('backgroundColor')).toBe('');
            expect($div2.find('#3x2').css('backgroundColor')).toBe('rgb(0, 204, 0)');
        });
    });

});