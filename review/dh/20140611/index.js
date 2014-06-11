$(function (){
    //点击导航可以切换。
    (function () {
        var search = decodeURIComponent(
            XPTools.getConditionFromUrl(window.location.href, 'search')
        );
        var regex = /^(.+?)#$/;
        var rs = regex.exec(search);
        if (rs) {
            search = rs[1];
        }

        $('#dataDictionaryAnchorId').attr('href', 'tableList?search=' + search);
        $('#indexAnchorId').attr('href', 'jumpToIndex?search=' + search);
        $('#dimAnchorId').attr('href', 'jumpToDim?search=' + search);
    })();

    var userName = $.cookie('user_name');
    //  数组元素之间最好空格隔开（另外，此数组名 arr 没有意义）
    var arr = ['提供数据表及字段的查询、订阅','提供指标定义的查询','提供维度及其维度值的查询'];
    //  而对于长的数组，最好换行定义
    var arr = [
        '提供数据表及字段的查询、订阅',
        '提供指标定义的查询',
        '提供维度及其维度值的查询'
    ];

    //当点击首页span选项时，给隐藏input标签赋值！
    $('#typechooseDivId > span').click(function () {
        var $input = $('.inp_text');
        var That = $(this);

        if ($input.val() == $input[0].defaultValue) {
            $input.val(arr[That.index()]);
        }
        $input[0].defaultValue = arr[That.index()];
        That.addClass('chooseOn').siblings().removeClass('chooseOn');
    });

    //  这一段是在设置提示文本？如果是，可以直接使用input的placeholder属性，高级浏览器支持
    $('.inp_text')
        .focus(function () {//文本框得到焦点时
            //  上面一段的`var That = $(this);`有缓存，这一段的 this 使用次数更多的为什么没缓存？
            $(this).css('color', '#000');
            if ($(this).val() == this.defaultValue) {
                $(this).val('');
            };
        })
        .blur(function(){ //文本框失去焦点时。
            var txt = $(this).val();
            var txt2 = $.trim(txt);
            if (txt2 == '') {
                $(this).val(this.defaultValue);
                $(this).css('color', '#999');
            }
        });


    $('#seachFormId').submit(function () {
        //  至此，`$('.inp_text')`已出现了很多次，应该考虑缓存。或者，至少限定范围，如`$('.inp_text', context)`
        var str = $.trim($('.inp_text').val());
        if (str == '' || str == $('.inp_text')[0].defaultValue) {
            return false;
        }
        else {
            $('.inp_text').val(str);
        }
    });

    //根据是否有用户cookie，判断是否显示部分区块。
    if (userName) {
        $('.Logined').show();
        $('.Logined>span').html('欢迎您，' + userName);
        $('#gouwu').show();
        $('.unLogin').hide();
    }
    else {
        $('.Logined').hide();
        $('.unLogin').show();
        $('#gouwu').hide();
    }

    //  这个退出，应该跳转页面 或者 至少发送异步请求，而不是现在这样的“前端退出”（实际后台并没有退出，可以刷新页面验证）
    $('#exit').click(function () {
        $('.Logined').hide();
        $('.unLogin').show();
        $('#gouwu').hide();
        return false;
    });


    //  下面这段RD写的代码倒是不错，挺规整，你要多学习学习
    /**
     *
     *  给页面跳转标识位赋予默认值
     */
    $('#pageFlag').val('data');
    /**
     * 给标签选择添加动作
     * xuepeng01
     * 2014/04/23 15:06:32
     */
    var typeChooseSpans = $('#typechooseDivId span');
    typeChooseSpans.click(function () {
        var obj = this;
        var nowId = obj.id;
        var formObj = $('#seachFormId');
        var url = '';
        if (nowId == 'data') {
            url = 'tableList';
        } 
        else if (nowId == 'index') {
            url = 'jumpToIndex';
        }
        else if (nowId == 'dim') {
            url = 'jumpToDim';
        }
        else {
            alert('没有该标签类型，请检查！');
            return;
        }

        formObj.attr('action', url);
    });

    //可以通过设置下一步的位置，实现点击下一步完全实现的效果。图片都可以不用修正。
    var $imgs = $('#animate img');
    var imgLength = $imgs.length;
    var showImgNumber = 0;
    $('#nextStep').click(function () {
        $(this).css(
            {
                left: 506,
                top: 284,
                height: 16,
                width: 52
            }
        );
        if (showImgNumber != imgLength) {
            showImgNumber++;
            $imgs.hide().eq(showImgNumber).show();

            if (showImgNumber == imgLength) {
                $(this).hide();
            }
            else if (showImgNumber == (imgLength - 1)) {
                //  不建议仅修改文本，因为【下一步】是三个字，而【立即体验】是四个字。至少，还要再加上一个 class 名
                $(this).html('立即体验');
            }
        }
        /*
         * 这个分支，其实应该不会到达的。
         * 因为当`showImgNumber`等于`imgLength`时，
         * `$imgs.hide().eq(showImgNumber).show();` 和 `if (showImgNumber == imgLength)`分支，
         * 决定了`$imgs`全部被隐藏，而【下一步】按钮也全部被隐藏了。
         * 这样，不会再触发这个事件，所以，走不到这个分支
         */
        else {
            $imgs.hide();
        }
    });

});