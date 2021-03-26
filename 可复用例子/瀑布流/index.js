let flowerModule = (function($){
    let $columns = $('li'),
        _DATA = null;
    let queryData = function() {
        $.ajax({
            url: "data.json",
            method: "GET",
            async: false,
            success: result => {
                _DATA = result;
            }
        });
    };
    
    // 页面数据绑定
    let bindHTML = function() {
        // 原理：每次从_DATA中取出三条数据，按照三列由矮到高的顺序依次插入
        for(let i = 0; i < _DATA.length; i += 3) {
            $columns.sort((A, B) => {
                let $A = $(A),
                    $B = $(B);
                return $A.outerHeight() - $B.outerHeight();
            }).each((index, column) => {
                let dataItem = _DATA[i+index];
                if(!dataItem) return false;
                let {
                    id,
                    pic,
                    title,
                    link
                } = dataItem;
                $(column).append(`<a href="${link}">
                                    <div><img src="${pic}" alt=""></div>
                                    <span>${id}.${title}</span>
                                </a>`);
            });
        }

        // 数据绑定后延迟1s加载真实图片
        setTimeout(lazyImg, 1000);
    };

    // 图片延迟加载
    let lazyImg = function() {
        // let $imgBox = $('.imgBox'),
        
    };

    return {
        init: function() {
            queryData();
            bindHTML();
        } 
    }

})(jQuery);

flowerModule.init();