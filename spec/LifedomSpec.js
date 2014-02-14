describe('Lifedom class', function() {
    it('should be defined', function() {
        expect(lifedom).toBeDefined();
    });

    describe('buildForm method', function() {
        var $div = $('<div>');

        beforeEach(function() {
            spyOn(lifedom, 'applySettings');
            lifedom.buildForm($div);
        });

        it('should be defined', function() {
            expect(typeof lifedom.buildForm).toBe('function');
        });

        it('should add form controls', function() {
          expect($div.find('#life-form').length).toBe(1);
        });

        it('should bind applySettings to #applySettings', function() {
            $div.find('#applySettings').click();
            expect(lifedom.applySettings).toHaveBeenCalled();
        });
    });

    describe('buildTable method', function() {
        var $div1, $div2;

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
            expect($div2.find('#2x2').hasClass('on')).toBe(true);
        });
    });

    describe('syncDomToLife', function() {
        it('should be defined', function() {
            expect(typeof lifedom.syncDomToLife).toBe('function');
        });

        it('should initialize the life class', function() {
            //expect(life.getBoard()['x']).toBe(4);
            //expect(life.getBoard()['y']).toBe(4);
        });

    });

});