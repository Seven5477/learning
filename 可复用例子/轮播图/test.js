function debounce(func, wait, immediate) {
    let timer = null,
        result = null;
    return function anonymous(...args) {
        let context = this,
            now = immediate && !timer;
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            !immediate ? (result = func.call(context, ...args)) : null;
        }, wait);
        now ? (result = func.call(context, ...args)) : null;
        return result;
    };
}

let bannerModule = (function () {
    let $container = $("#container"),
        $wrapper = $container.children(".wrapper"),
        $btnLeft = $container.find(".btnLeft"),
        $btnRight = $container.find(".btnRight"),
        $dots = $container.find(".dots"),
        $dotList = $dots.find("li");

    let autoTimer = null,
        interval = 2000,
        imgIndex = 0; //当前轮播的图片索引，默认第一张
    // 自动轮播
    function autoPlay() {
        // 让wrapper向左移动
        imgIndex++;
        /* if(imgIndex === 4) imgIndex = 0; 这样写会导致图片会一下变到第一张，不是无缝滚动
                无缝滚动：
                1. 把第一张克隆一份放到末尾，wrapper中会比真实的图片层多一张
                2. 依然一张张往后滚动，滚动到第5张的时候，继续向后走（imgIndex=6），看到了克隆的第一张，再要向后走的时候，
                   让其“立即”跳转到真实的第一张（肉眼看不出跳转），然后运动到第二张......
                */
        if (imgIndex > 5) {
            // 上次显示的是克隆的那张，忽略真实的第一张，让其立即跳转到第二张
            $wrapper.css("left", 0);
            imgIndex = 1;
        }

        // 匀速向左移动
        // 无动画版：$wrapper.css('transform', 'translate(' + (-imgIndex * 500) + 'px)');
        // 动画版：
        $wrapper.stop().animate({
            left: -imgIndex * 500 //JQ自动补'px'
        }, 300);

        showDots();
    }

    // 圆点对焦
    function showDots() {
        // 由于不能修改imgIndex的值，所以定义一个临时变量
        let temp = imgIndex;
        temp === 5 ? (temp = 0) : null;
        $dotList.each((index, item) => {
            let $item = $(item);
            if (index === temp) {
                $item.addClass("active");
                return;
            }
            $item.removeClass("active");
        });
    }

    //点击圆点
    function clickDots() {
        $dotList.click(debounce(function () {
            let index = $(this).index();
            imgIndex = index;

            $wrapper.stop().animate({
                left: -imgIndex * 500 //JQ自动补'px'
            }, 300);

            showDots();
        },300,true));
    }

    // 左右按键
    function btnClick() {
        $btnLeft.click(function () {
            imgIndex--;
            if (imgIndex < 0) {
                // 上次显示的是真实的第一张，忽略克隆的倒数第一张，让其立即跳转倒数第二张
                $wrapper.css('left', -2500);
                imgIndex = 4;
            }

            $wrapper.stop().animate({
                left: -imgIndex * 500 //JQ自动补'px'
            }, 300);

            showDots();
        });

        // 右键点击：相当于自动轮播
        $btnRight.click(debounce(autoPlay, 300, true));
    }

    return {
        init: function () {
            autoTimer = setInterval(autoPlay, interval);

            // 鼠标进入/离开轮播区域时停止/开启自动轮播
            $container.on("mouseenter", () => {
                clearInterval(autoTimer);
            });
            $container.on("mouseleave", () => {
                autoTimer = setInterval(autoPlay, interval);
            });

            clickDots();
            btnClick();
        },
    };
})();

bannerModule.init();
