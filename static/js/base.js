function AjaxBase(url,type,data,callback){
    if (typeof data === 'function') {
        callback = data;
        data = {};
    }

    $.ajax({
        url: url,
        type: type,
        data: data,
        cache: false,
        success: function(result) {
            callback && callback(result);
        },
        error: function(result) {
            if (result.status === 404) {
                alert('请求的路由不存在');
            } else if (result.status === 500) {
                alert('网络异常,请重试');
            }
            console.error(result.responseText);

            callback && callback(result);
        }
    });
}
function AjaxGet(url, data, callback) {
    AjaxBase(url,'get',data,callback);
}
function AjaxPost(url, data, callback) {
    AjaxBase(url,'post',data,callback);
}