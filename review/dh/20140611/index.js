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
    var arr = ['提供数据表及字段的查询、订阅','提供指标定义的查询','提供维度及其维度值的查询'];

    //当点击首页span选项时，给隐藏input标签赋值！
    $('#typechooseDivId > span').click(function (){
        var $input = $('.inp_text');
        var That = $(this);

        if($input.val() == $input[0].defaultValue){
            $input.val(arr[That.index()]);
        }
        $input[0].defaultValue = arr[That.index()];
        That.addClass('chooseOn').siblings().removeClass('chooseOn');
    });

    $('.inp_text')
        .focus(function (){//文本框得到焦点时
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


    $('#seachFormId').submit(function (){
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

    $('#exit').click(function () {
        $('.Logined').hide();
        $('.unLogin').show();
        $('#gouwu').hide();
        return false;
    });

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
    $('#nextStep').click(function() {
        $(this).css(
            {
                left: 506,
                top:284,
                height:16,
                width:52
            }
        )
        if (showImgNumber != imgLength) {
            showImgNumber++;
            $imgs.hide().eq(showImgNumber).show();

            if (showImgNumber == imgLength) {
                $(this).hide();
            }
            else if (showImgNumber == imgLength-1) {
                $(this).html('立即体验');
            }
        }
        else {
            $imgs.hide();
        }
    });

});