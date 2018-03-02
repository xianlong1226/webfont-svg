$(function() {
    AjaxGet('/index/getnumber', function(result) {
        $('#font-test-area').html(result.data)
    })

    $('#btn-refresh').click(function(){
        AjaxGet('/change', function(result) {
            setTimeout(function(){
                AjaxGet('/index/getnumber', function(result) {
                    $('#font-test-area').html(result.data)
                })
            }, 1)
        })
    })
})