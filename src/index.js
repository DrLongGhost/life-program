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
                break;
            case 'Beehive':
                $rows.val(10);
                $cols.val(10);
                $('#applySettings').click();
                $('#3x4, #4x4, #2x3, #5x3, #3x2, #4x2').click();
                break;
            case 'Glider':
                $rows.val(50);
                $cols.val(50);
                $('#applySettings').click();
                $('#turnCount').val(100);
                $('#4x49, #4x48, #4x47, #3x47, #2x48').click();
                break;
            case 'R-Pentomino':
                $rows.val(50);
                $cols.val(50);
                $('#applySettings').click();
                $('#turnCount').val(100);
                $('#29x24, #29x23, #29x22, #30x22, #28x23').click();
                break;
            case 'Line Pattern':
                $rows.val(50);
                $cols.val(50);
                $('#applySettings').click();
                $('#turnCount').val(100);
                $('#2x25, #3x25, #4x25, #5x25, #6x25, #7x25, #8x25, #9x25, #11x25, #12x25, #13x25, #14x25, #15x25, #19x25, #20x25, #21x25, #28x25, #29x25, #30x25, #31x25, #32x25, #33x25, #34x25, #36x25, #37x25, #38x25, #39x25, #40x25').click();
                break;
        }
    });
});
