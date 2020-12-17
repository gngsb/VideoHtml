//判断浏览器是否支持html5
if (!window.applicationCache) {
    //layer.alert("建议使用IE11、Chrome浏览器进行访问");
}
var layer;
layui.use('layer', function () {
    layer = layui.layer;
});              
function isContainsError(json, isshow, callback) {
    isshow = isshow !== 0 ? 1 : 0;
    if (typeof json === "string") {
        if (isshow === 1)
            showErrorMsg("返回格式错误", callback);
        return true;
    }
    if (json.hasOwnProperty("code") && json.code !== 1) {
        var msg = json.msg;
        if (isshow === 1) {
            if (json.code === -1)
                callback = relogin;
            showErrorMsg(msg, callback);
        }
        return true;
    }
    return false;
}
//显示错误提醒
function showErrorMsg(msg, title, callback) {
    if (typeof title === "function") {
        callback = title;
        title = "系统提示";
    } else {
        title = (title == null || title === "") ? "系统提示" : title;
    }

    var index = top.layer.open({
        type: 0,
        title: title,
        icon: 2,
        content: msg,
        yes: function () {
            if (typeof callback === "function")
                callback();
            top.layer.close(index);
        }
    });
}
//跳转登录
function relogin() {
    top.location.href = "/Home/Login";
}
//保存数据
function saveLocalData(key, value, option) {
    //重新设置value需要先把原来的设置为失效
    delLocalData(key);
    if (typeof option === "object")
        $.cookie(key, value, option);
    else if (typeof option === "number") {
        var exp = new Date();
        exp.setTime(exp.getTime() + option);
        $.cookie(key, value, { path: "/", expires: exp });
    } else
        $.cookie(key, value, { path: "/" });
}
//读取数据
function readLocalData(key) {
    return $.cookie(key);
}
//删除数据
function delLocalData(key) {
    var value = readLocalData(key);
    if (value == null) return;
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    $.cookie(key, value, { path: "/", expires: exp });
}
var loadIndex = 0;
function showloading() {
    if (top.loadIndex !== 0) return;
    top.loadIndex = top.layer.load(2, { time: 0 });
}
function hideloading() {
    setTimeout(function () {
        top.layer.close(top.loadIndex);
        top.loadIndex = 0;
    }, 100);
}

$.ajaxSetup({
    cache: false,
    xhrFields: { withCredentials: true }
});
$(document).ajaxSend(function (event, xhr, option) {
    if (!!option.showloading) showloading();
}).ajaxError(function (event, xhr) {
    if (typeof console.log === "function")
        console.log(xhr.responseText);
}).ajaxStop(function () {
    hideloading();
});

//填充下拉列表 url:请求url  contrulObj:要处理的控件  valuefield:value绑定字段   textfield:text绑定字段  defaultText:空白显示 defaultValue:默认值
function InintSelectList(url, contrulObj, valuefield, textfield, defaultText, defaultValue) {
    $.post(url, {}, function (data) {
        if (data.code === 1) {
            var element = "";
            $.each(data.data, function (i, item) {
                element += "<option value=\"" + item[valuefield] + "\" >" + item[textfield] + "</option>";
            });
            contrulObj.html('<option value="' + defaultValue + '">' + defaultText + '</option>' + element);
            form.render();
        }
    });
}
//联动获取Action
function InitAction(controllerId, controlId, title) {
    title = title == null ? "--请选择Action别名--" : title;
    var url = "/Public/ListAction?Id=" + controllerId;
    InintSelectList(url, $("#" + controlId), "Id", "AliasName", title, "-1");
};
//联动获取Controller
function InitController(projectId, controlId, title) {
    title = title == null ? "--请选择Controller别名--" : title;
    var url = "/Public/ListController?Id=" + projectId;
    InintSelectList(url, $("#" + controlId), "Id", "AliasName", title, "-1");
};

