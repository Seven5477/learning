let shopType = (function($){
    // 需要操作的元素
    let $choose = $('#choose'),
        $allType = $('#type');

    // 两组数据
    let _select = [
        {
            type: 0,
            name: "苹果"
        }
    ];
    let _data = [
        {
            type: 0,
            text: '品牌',
            content: ["苹果","小米","锤子","魅族","华为","OPPO","vivo","乐视","360","中兴","索尼"]
        },
        {
            type: 1,
            text: '尺寸',
            content: ["3.0英寸以下","3.0-3.9英寸","4.0-4.5英寸","4.6-4.9英寸","5.0-5.5英寸","6.0英寸以上"]
        },
        {
            type: 2,
            text: '系统',
            content: ["安卓","苹果","微软","无","其他"]
        },
        {
            type: 3,
            text: '网络',
            content: ["联通3G","双卡单4G","双卡双4G","联通4G","电信4G","移动4G"]
        }
    ];

    // 渲染视图
    function render() {
        let HTMLStr = ``;
            
        // 类别区
        _data.forEach((item, index) => {
            let {type, text, content} = item;
            /* 第一种写法
            item.content.forEach((item, index) => {
                aStr += `<a href="javascript:;">${item}</a>`;
            });
            HTMLStr += `<li _type=${type}>${text}：${aStr}</li>`
            aStr = ``;*/
            // 第二种写法
            HTMLStr += `<li _type="${type}">
                        ${text}：
                        ${content.map(A => {
                            return `<a href="javascript:;">${A}</a>`;
                        }).join('')}
                        </li>`;
        });
        $allType.html(HTMLStr);

        // 选择区
        HTMLStr = `你的选择:`;
        // 先根据type排序
        _select.sort((A, B) => A.type - B.type);
        _select.forEach((item) => {
            HTMLStr += `<div class="mark">${item.name}<a href="javascript:;" _type=${item.type}>X</a></div>`;
        });
        $choose.html(HTMLStr);

        // 渲染结束类别区绑定事件
        handle();
        // 已选区绑定点击事件
        handleSel();
    }

    // 类别区绑定点击事件
    function handle() {
        $allType.find('a').click(function() {
            let $this = $(this);
        
            let sel_item = {};
            // 获取其所在的li和_type
            let $par = $this.parent();
            let type = parseInt($par.attr('_type'));
            // 点击的数据存进对象中
            sel_item.type = type;
            sel_item.name = $this.text().trim(); //保存文本并去掉文本的首尾空格
            
            // 把点击的数据放入数组，如果已存在同个type的数据，则删除该数据，加入点击的新数据
            if(_select) {
                _select.forEach((item, index) => {
                    if(item.type === type) {
                        _select.splice(index, 1);
                    }
                });
            }
            _select.push(sel_item);

            // 重新渲染
            render();
        }); 
    }

    function handleSel() {
        $choose.find('a').click(function() {
            let $this = $(this),
                _type = parseInt($this.attr('_type'));
            _select.forEach((item, index) => {
                if(item.type === _type) {
                    _select.splice(index, 1);
                }
            });
            render();
        });
    }

    return {
        init: function() {
            render();
        }
    }
})(jQuery);

shopType.init();