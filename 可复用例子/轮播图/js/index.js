function throttle(func, wait) {
	let timer = null,
		result = null,
		previous = 0;
	return function anonymous(...args) {
		let context = this,
			now = new Date,
			spanTime = wait - (now - previous);
		if (spanTime <= 0) {
			result = func.call(context, ...args);
			clearTimeout(timer);
			timer = null;
			previous = now;
		} else if (!timer) {
			timer = setTimeout(() => {
				result = func.call(context, ...args);
				timer = null;
				previous = new Date;
			}, spanTime);
		}
		return result;
	}
}

let bannerModule = (function() {
    let $container = $('.container'),
		$wrapper = $container.find('.wrapper'),
		$pagination = $container.find('.pagination'),
		// $buttonPrev = $container.find('.button-prev'),
        // $buttonNext = $container.find('.button-next'),
        // $paginationList = null,
		$slideList = null;

    let _data = null,
        autoTimer = null,
        interval = 2000,
        speed = 600, //每次切换图片需要的总时间
        imgIndex = 0, //当前显示图片的索引
        imgCount = 0; //图片的数量

    // 获取数据
    let queryData = function(callBack) {
        $.ajax({
            url: 'json/bannerData1.json',
            method: 'GET',
            async: true, //异步
            success: function(result) {
                // typeof callBack === 'function' ? callBack(result) : null;
                //=>
                callBack && callBack(result);
            }
        });
    };

    // 数据绑定
    let bindHTML = function(data) {
        let str1 = ``,
            str2 = ``;
        data.forEach((item, index) => {
            str1 += `<div class="slide">
                        <img src="${item.pic}" alt="">
                    </div>`;
            str2 += `<span class="${index === 0 ? 'active' : ''}"></span>`;
        });
        $wrapper.html(str1);
        $pagination.html(str2);

        // 获取结构内容
        $slideList = $wrapper.children('.slide');
        // $paginationList = $pagination.children('span');
    };

    // 实现图片切换(很多地方都会用到，所以做成函数)
    let changeImg = function() {
        let $active = $slideList.eq(imgIndex),
            $siblings = $active.siblings();

        /* JS实现渐隐渐现动画：
        $active.css('z-index', 1);
        $siblings.css('z-index', 0);
        $active.stop().animate({
            opacity: 1
        }, speed, () => {
            $siblings.css('opacity', 0);
        });*/

        // CSS3实现渐隐渐现动画：
        $active.css('transition', `opacity ${speed}ms`);
        $siblings.css('transition', `opacity 0ms`);
        $active.css('z-index', 1);
        $siblings.css('z-index', 0);
        $active.css('opacity', 1).on('transitionend', function(){
            /* transitionend：当CSS3过渡动画结束后触发的事件，特殊注意的是，
            如果是多个样式执行了过渡效果，则当前事件被触发多次*/
            $siblings.css('opacity', 0);
        });
        dotsFocus();
    };

    // 自动轮播
    let autoPlay = function() {
        imgIndex ++;
        // 累加到边界，则从头开始
        if(imgIndex >= imgCount) {
            imgIndex = 0;
        }

        changeImg();
    };

    // 焦点自动对齐
    let dotsFocus = function() {
        $pagination.children('span').each((index, item) => {
            let $item = $(item);
            if(index === imgIndex) {
                $item.addClass('active');
                return;
            }
            $item.removeClass('active');
        });
    };

    // 点击焦点对齐
    // let clickDots = function() {
    //     $paginationList.click(throttle(function() {
    //         imgIndex = $(this).index();
    //         changeImg();
    //     }, 500));
    // } =>改为事件委托的形式，去掉

    // 点击左右按钮
    // let clickBtn = function() {
    //     $buttonNext.click(throttle(autoPlay, 300));

    //     $buttonPrev.click(throttle(function() {
    //         imgIndex --;
    //         // 累加到边界
    //         if(imgIndex < 0) {
    //             imgIndex = imgCount - 1;
    //         }

    //         changeImg();
    //     }, 500));
    // }; =>改为事件委托的形式，去掉

    return {
        init: function() {
            /*AJAX采用异步编程，我们需要在获取到数据后，才能进行数据绑定，
            轮播图处理等事情，此时我们可以基于回调函数来完成这件事情*/
            queryData(function anonymous(data) {
                // data就是服务器获取的数据
                bindHTML(data);
                imgCount = data.length;
                // 自动轮播
                autoTimer = setInterval(autoPlay, interval);
                // clickDots();
                // clickBtn();
            });

            // 这段代码可以放在init里边，也可以放外边，因为下面的操作要先获取数据
            // 鼠标进入/离开轮播区域时停止/开启自动轮播
            $container.mouseenter(function() {
                clearInterval(autoTimer);
            }).mouseleave(function() {
                autoTimer = setInterval(autoPlay, interval);
            }).click(function(ev) {
                // =>基于事件委托实现clickDots()和clickBtn()
                let target = ev.target,
                    $target = $(target);
                // 焦点
                if(target.tagName === 'SPAN' && $target.parent().hasClass('pagination')) {
                    imgIndex = $target.index();
                    changeImg();
                    return;
                }
                // 左右按钮
                if(target.tagName === 'A') {
                    if($target.hasClass('button-prev')) {
                        imgIndex --;
                        // 累加到边界
                        if(imgIndex < 0) {
                            imgIndex = imgCount - 1;
                        }

                        changeImg();
                        return;
                    }
                    if($target.hasClass('button-next')) {
                        autoPlay();
                        return;
                    }
                }
                // 优点：动态数据绑定利用事件委托不用等页面的数据加载完毕就可以绑定方法
            });
        }
    }
})();

bannerModule.init();