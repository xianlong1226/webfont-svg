$(function() {
    function getnumber(){
        AjaxGet('/index/getnumber', function(result) {
            $(document.head).append('<style>'+result.data.style+'</style>')
            $('#font-test-area').html(result.data.phone)
            $('#font-test-area').removeClass().addClass(result.data.className)
        })
    }

    $('#btn-refresh').click(function(){
        AjaxGet('/change', function(result) {
            setTimeout(function(){
                getnumber()
            }, 1)
        })
    })

    $('#btn-refresh').click();
})