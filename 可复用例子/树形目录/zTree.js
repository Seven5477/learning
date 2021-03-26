let zTreeModule = (function () {
    let $level0 = $('.level0'),
        count = 0;

    // 获取数据
    let queryData = function (callBack) {
        $.ajax({
            url: 'data.json',
            method: 'GET',
            success: result => {
                callBack(result);
            }
            // ==> success: callBack
        });
    };

    // 数据绑定
    let bindHTML = function (result) {
        let str = ``;
        result.forEach(item => {
            count++;
            let {
                name,
                open,
                children
            } = item;
            str += `<li>
                        <a href="javascript:;" class="title">${name}</a>
                        ${children ?
                    `<em class="icon ${open ? 'open' : ''}"></em>
                        <ul class="level level${count}" 
                            style="display:${open ? 'block' : 'none'}">
                            ${bindHTML(children)}
                        </ul>`: ``}
                    </li>`;
            count--;
        });
        return str;
    };

    return {
        init: function () {
            // 事件委托实现点击展开/关闭
            $level0.click(function (ev) {
                let target = ev.target,
                    $target = $(target),
                    $next = $target.next('ul');

                if (target.tagName === 'EM') {
                    //=>加减号的切换
                    // if($target.hasClass('open')) {
                    //     $target.removeClass('open');
                    // }
                    // else {
                    //     $target.addClass('open')
                    // }
                    // =>等价于：
                    $target.toggleClass('open');
                    //=>控制子集的显示隐藏
                    // 结束当前正在执行的动画，并开始下一个动画，100ms完成一个动画
                    $next.stop().slideToggle(100);
                }
            });

            queryData(function fn(result) {
                // 获取数据后要做的事
                $level0.html(bindHTML(result));
            });
        }
    };
})();

zTreeModule.init();