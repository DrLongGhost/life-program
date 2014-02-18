$(function() {
    lifedom.init( $('#formParent'), $('#tableParent') );

    $('a.preset').on('click', function() {
        $rows = $('#rowCount');
        $cols = $('#colCount');

        switch ($(this).html()) {
            case 'Blinker':
                $rows.val(5);
                $cols.val(5);
                $('#applySettings').click();
                $('#3x2, #3x3, #3x4').click();
                $('#large').click();
                break;
            case 'Beehive':
                $rows.val(10);
                $cols.val(10);
                $('#applySettings').click();
                $('#3x4, #4x4, #2x3, #5x3, #3x2, #4x2').click();
                $('#large').click();
                break;
            case 'Glider':
                $rows.val(50);
                $cols.val(50);
                $('#applySettings').click();
                $('#turnCount').val(300);
                $('#4x49, #4x48, #4x47, #3x47, #2x48').click();
                $('#small').click();
                break;
            case 'R-Pentomino':
                $rows.val(100);
                $cols.val(100);
                $('#applySettings').click();
                $('#turnCount').val(600);
                $('#49x24, #49x23, #49x22, #50x22, #48x23').click();
                $('#small').click();
                break;
            case 'Line Pattern':
                $rows.val(100);
                $cols.val(100);
                $('#applySettings').click();
                $('#turnCount').val(600);
                $('#32x25, #33x25, #34x25, #35x25, #36x25, #37x25, #38x25, #39x25, #41x25, #42x25, #43x25, #44x25, #45x25, #49x25, #50x25, #51x25, #58x25, #59x25, #60x25, #61x25, #62x25, #63x25, #64x25, #66x25, #67x25, #68x25, #69x25, #70x25').click();
                $('#small').click();
                break;
        }
    });
});
