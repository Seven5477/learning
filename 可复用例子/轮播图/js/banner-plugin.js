let $container1 = $('#container1'),
    $container2 = $('#container2');
    
//=>第一个轮播图数据绑定
$.ajax({
	url: 'json/bannerData1.json',
	method: 'get',
	success: result => {
		let str1 = ``;
		result.forEach((item, index) => {
			str1 += `<div class="slide">
				<img src="${item.pic}" alt="">
			</div>`;
		});
		$container1.find('.wrapper').html(str1);

		//=>实现轮播效果
		$container1.bannerPlugin();	
	}
});

//=>第二个轮播图数据绑定
$.ajax({
	url: 'json/bannerData2.json',
	method: 'get',
	success: result => {
		let str1 = ``;
		result.forEach((item, index) => {
			str1 += `<div class="slide">
				<img src="${item.pic}" alt="">
			</div>`;
		});
		$container2.find('.wrapper').html(str1);

		//=>实现轮播效果
		$container2.bannerPlugin();
	}
});

(function($){
    if(typeof $ === 'undefined') {
        throw new Error('该插件必须依托jQuery');
    }

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

    // 渐隐渐现轮播图插件：自动轮播+焦点触发+左右按钮
    function bannerPlugin() {
        // this:要实现轮播图的容器
        let $this = this,
            $wrapper = $this.find('.wrapper'),
            $pagination = $this.find('.pagination'),
            $buttonPrev = $this.find('.button-prev'),
            $buttonNext = $this.find('.button-next'),
            $slideList = $wrapper.find('.slide'),
            $paginationList = $pagination.find('span');

            console.log($this)

        let autoTimer = null,
            interval = 2000,
            speed = 600, //每次切换图片需要的总时间
            imgIndex = 0, //当前显示图片的索引
            imgCount = $slideList.length; //图片的数量

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
            
            // 焦点对齐
            $paginationList.each((index, item) => {
                let $item = $(item);
                if(index === imgIndex) {
                    $item.addClass('active');
                    return;
                }
                $item.removeClass('active');
            });
        };

        let autoPlay = function() {
            imgIndex ++;
            if(imgIndex >= imgCount) {
                imgIndex = 0;
            }

            changeImg();
        };

        let dotsFocus = function() {
            $paginationList.each((index, item) => {
                let $item = $(item);
                if(index === imgIndex) {
                    $item.addClass('active');
                    return;
                }
                $item.removeClass('active');
            });
        };

        let clickDots = function() {
            $paginationList.click(throttle(function() {
                imgIndex = $(this).index();
                changeImg();
            }, 500));
        };

        let clickBtn = function() {
            $buttonNext.click(throttle(autoPlay, 300));

            $buttonPrev.click(throttle(function() {
                imgIndex --;
                // 累加到边界
                if(imgIndex < 0) {
                    imgIndex = imgCount - 1;
                }

                changeImg();
            }, 500));
        };

        autoTimer = setInterval(autoPlay, interval);
        clickDots();
        clickBtn();
        $this.mouseenter(function() {
            clearInterval(autoTimer);
        }).mouseleave(function() {
            autoTimer = setInterval(autoPlay, interval);
        });
    }

    $.fn.extend({
        bannerPlugin
    });
})(jQuery);