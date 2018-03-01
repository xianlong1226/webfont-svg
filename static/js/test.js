$(function() {
    AjaxGet('/index/getnumber', function(result) {
        $('#font-test-area').html(result.data)
    })
})