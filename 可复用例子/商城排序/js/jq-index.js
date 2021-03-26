// 基于单例设计模式
let shopModule = (function($){
    // 先获取元素和创建变量
    let $navList = $('.navbar-nav li'),
        $cardBox = $('.card-deck'),
        $cardList = null,
        data = null; //获取服务器的数据

    // 从服务器获取数据
    function queryData() {
        $.ajax({
            url: 'json/product.json',
            method: 'GET',
            async: false, //同步
            success: function(result) {
                // 从服务器获取数据成功会执行success函数,result是获取的数据
                // 默认是json格式的对象
                data = result;
            }
        });
    }

    // 把数据绑定在页面中
    function bindHTML() {
        if(!data) return;
        let HTMLStr = ``;
        $.each(data, (index, item) => {
            // 解构赋值
            let {title, img, price, hot, time} = item;
            HTMLStr +=  `<div class="card" 
                                data-price="${price}" 
                                data-hot="${hot}" 
                                data-time="${time}">
                            <img src="${img}" class="card-img-top" alt="">
                            <div class="card-body">
                                <h6 class="card-title">${title}</h6>
                                <p class="card-text">价格：￥${price}</p>
                                <p class="card-text">好评：${hot}</p>
                                <p class="card-text"><small class="text-muted">上架时间：${time}</small></p>
                            </div>
                        </div> `;
        });
        $cardBox.html(HTMLStr);
        $cardList = $cardBox.children('.card');
    }

    // 实现商城排序
    function sortHandle() {
        $navList.attr('data-type', -1);
        $navList.on('click', function() {
            // this：当前点击的li(原生js对象)
            // 转换为JQ对象，便于使用jq方法
            let $this = $(this),
                sort_type = $this.attr('data-sort'); //data-time、data-price、data-hot
            $this.attr('data-type', $this.attr('data-type') * -1).siblings().attr('data-type', -1);
            $cardList.sort(function(next, cur) {
                // 转换为JQ对象
                let $cur = $(cur),
                    $next = $(next);
                // 获取属性
                $cur = $cur.attr(sort_type);
                $next = $next.attr(sort_type);
                if(sort_type === 'data-time') {
                    // 获取的是日期需要去掉中间的横线才能相减
                    $cur = $cur.replace(/-/g, '');
                    $next = $next.replace(/-/g, '');
                }
                return ($cur - $next) * $this.attr('data-type'); //升序降序切换
            });
            $cardList.each((index,item) => {
                $cardBox.append(item);
            });
        });
    }

    return {
        // 当前模块的入口：想让商城排序开始执行，只需要执行innit,在innit中会按照顺序，
        // 依次完成具体的业务逻辑
        init() { //=>innit:function(){}
            queryData();
            bindHTML();
            sortHandle();
        }
    }
})(jQuery); //防止$被占用，所以把jQuery传参，保证内部的$是jQuery

shopModule.init();