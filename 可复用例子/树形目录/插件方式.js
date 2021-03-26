~function ($) {
    if(typeof $ === 'undefined') {
        throw new Error('该插件必须依托jQuery');
    }

    function zTreePlugin(data) {
        let count = 0,
            $this = $(this);

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

        $this.html(bindHTML(data));

        $this.click(function (ev) {
            let target = ev.target,
                $target = $(target),
                $next = $target.next('ul');

            if (target.tagName === 'EM') {
                //=>加减号的切换
                $target.toggleClass('open');
                //=>控制子集的显示隐藏
                // 结束当前正在执行的动画，并开始下一个动画，100ms完成一个动画
                $next.stop().slideToggle(100);
            }
        });
    }

    $.fn.extend({
        zTreePlugin: zTreePlugin
    });
}(jQuery);