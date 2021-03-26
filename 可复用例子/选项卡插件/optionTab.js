/*let tabModule = (function(){
    // let tabBox = document.getElementById('tabBox'),
    //     navBox = tabBox.querySelector('.navBox'),
    //     liList = navBox.querySelectorAll('li'),
    //     contentList = tabBox.querySelectorAll('div');

    // let clickLi = function() {
    //     let len = liList.length;
    //     for(let i = 0; i < len; i++) {
    //         liList[i].index = i;
    //         liList[i].onclick = function() {
    //             for(let j = 0; j < len; j++) {
    //                 if(j === this.index) {
    //                     liList[j].className = 'active';
    //                     contentList[j].className = 'active';
    //                 }
    //                 else{
    //                     liList[j].className = '';
    //                     contentList[j].className = '';
    //                 }
    //             }
    //         };
    //     }
    // };

    let $tabBox = $('#tabBox'),
        $navBox = $tabBox.find('.navBox'),
        $liList = $navBox.find('li'),
        $contentList = $tabBox.find('div');

    let clickLi = function() {
        $liList.click(function(){
            let $this = $(this);
            let index = $this.index();
            $this.addClass('active').siblings().removeClass('active');
            $contentList.eq(index).addClass('active').siblings().removeClass('active');
        });
    };
    
    return {
        init: function() {
            clickLi();
        }
    }
})();

tabModule.init();*/

/*(function($){
    function clickLi() {
        let $this = this,
            $navBox = $this.find('.navBox'),
            $liList = $navBox.find('li'),
            $contentList = $this.find('div');

        $liList.click(function(){
            let $this = $(this),
                index = $this.index();
            $this.addClass('active').siblings().removeClass('active');
            $contentList.eq(index).addClass('active').siblings().removeClass('active');
        });
    }

    $.fn.extend({
        tabClick: clickLi
    });
})(jQuery);*/

(function(){
    class Tab {
        constructor(selector, options) {
            // 处理第一个参数
            if(!selector)
                throw new ReferenceError('The first selector parameter must be passed~~');
            if(typeof selector === 'string')
                this.container = document.querySelector(selector);
            else if(selector.nodeType)
                this.container = selector;

            this.initialParams(options);

            this.navBox = this.container.querySelector('.navBox'),
            this.liList = this.navBox.querySelectorAll('li'),
            this.contentList = this.container.querySelectorAll('div'),
            this.count = this.liList.length;
            
            this.change();
            this.handleLi();
        }

        // 初始化参数
        initialParams(options) {
            let _default = {
                showIndex: 0,
                triggerEvent: 'click'
            };

            for(let key in options) {
                if (!options.hasOwnProperty(key)) break;
                _default[key] = options[key];
            }

            // 把信息挂载到实例上
            for (let key in _default) {
				if (!_default.hasOwnProperty(key)) break;
				this[key] = _default[key];
			}
        }

        // 切换标题
        change() {
            [].forEach.call(this.liList, (item, index) => {
                if(index === this.showIndex) {
                    this.liList[index].className = 'active';
                    this.contentList[index].className = 'active';
                    return;
                }
                this.liList[index].className = '';
                this.contentList[index].className = '';
            });
        }

        // 绑定标题对应的事件
        handleLi() {
            [].forEach.call(this.liList, (item, index) => {
                item.addEventListener(this.triggerEvent, () => {
                    this.showIndex = index;
                    this.change();
                });
            });
        }
    }
    window.Tab = Tab;
})();