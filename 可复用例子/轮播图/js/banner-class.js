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
		new Banner('#container1', {
			initialSlide: 3,
			autoplay: 2000,
			pagination: {
				triggerEvent: 'click'
			},
			navigation: null,
			on: {
				/* init: function () {
					console.log('初始化成功了');
				},
				transitionStart: function () {
					console.log('动画开始~~');
				}, */
				transitionEnd: function (examp) {
					//=>this===examp===实例
					// let active = this.slideList[this.activeIndex];
					// active.innerHTML += `<span>我是第${this.activeIndex+1}个SLIDE</span>`;
				}
			}
		});	
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
		new Banner('#container2', {
			autoplay: null,
			pagination: null
		});
	}
});

(function(){

    /*
        封装时的一些问题：
        1. 封装公共方法的时候，如果需要的参数过多：不要定义为形参让用户依次传递，这样
            会受到顺序、不传等因素影响，管理起来很复杂。可以把需要传递的值统一放到一个
            对象（options）中，这样传递的参数会很方便，也不会受顺序、不传的影响，便于
            二次扩展。
            let _default = {
                initialSlide: 3,
                speed: 300,
        	    autoplay: 2000,
                pagination: null
            };
            for(let key in options) {
                _default[key] = options[key];
            }
        2. 我们把后期需要用到的信息都挂载到当前类的实例上(this.xxx=xxx)，这样后面不管在
            哪个方法中用这些信息，只要能获取到实例，直接通过实例获取即可
            this.autoTimer = null;
			this.activeIndex = this.initialSlide;

        3. 本插件中需要使用的工具类方法（如throttle），我们一般放到类的私有属性上（普通对象）
    */

    // 渐隐渐现轮播图插件：创建类的方式
    class Banner {
        // 私有属性放到constructor中，公有方法放到constructor外面
        constructor(selector, options) {
            //=>获取需要操作的容器
            if (!selector) 
                throw new ReferenceError('The first selector parameter must be passed!');
			if (typeof selector === "string") {
				this.container = document.querySelector(selector);
			} else if (selector.nodeType) {
				this.container = selector;
            }

            //=>参数初始化
            this.initialParams(options);
            
            this.wrapper = this.container.querySelector('.wrapper');
            this.slideList = this.wrapper.querySelectorAll('.slide');
			this.autoTimer = null;
			this.activeIndex = this.initialSlide;
            this.count = this.slideList.length;

            // 初始展示哪张图片
            [].forEach.call(this.slideList, (item, index) => {
                if(index === this.initialSlide) {
                    item.style.zIndex = 1;
                    item.style.opacity = 1;
                    return;
                }
                item.style.zIndex = 0;
                item.style.opacity = 0;
            });
            
            /* this.autoTimer = setInterval(this.autoPlay, this.autoplay); 
            autoPlay在回调过程中，this=>window*/
            // 自动轮播（不传autoplay或传的值为null, 不启动自动轮播）
            if(this.autoplay) {
                this.autoTimer = setInterval(this.autoPlay.bind(this), this.autoplay);
                this.container.addEventListener('mouseenter', () => {
                    clearInterval(this.autoTimer);
                });
                this.container.addEventListener('mouseleave', () => {
                    this.autoTimer = setInterval(this.autoPlay.bind(this), this.autoplay);
                });
            }

            // 分页器的处理
            if(this.pagination && this.pagination.el) {
                this.handlePagination();
            }

            // 前进和后退按钮
            if(this.navigation) {
                this.handleBtn();
            }
        }

        // 初始化插件的参数配置信息
        initialParams(options) {
            //1.首先设置默认的参数信息
            let _default = {
                initialSlide: 0,
                speed: 300,
                autoplay: 3000,
                pagination: {
                    el: '.pagination',
                    triggerEvent: 'click'
                },
                navigation: {
                    nextEl: '.button-next',
                    prevEl: '.button-prev',
                    hide: true
                },
                on: {
                    init: function (examp) {},
                    transitionStart: function (examp) {},
                    transitionEnd: function (examp) {}
                }
            };
            //2.把传递进来的OPTIONS中的信息替换_DEFAULT中的信息
            for (let key in options) {
                // 不是私有属性，跳出循环，常用在对象的循环中
                if (!options.hasOwnProperty(key)) break;

                if (/^(pagination|navigation|on)$/i.test(key)) continue;

                _default[key] = options[key];
            }
            //=>处理pagination属性
            let pagination = options.pagination;
            if (pagination !== null) {
                pagination = pagination || {};
                for (let key in pagination) {
                    if (!pagination.hasOwnProperty(key)) break;
                    _default['pagination'][key] = pagination[key];
                }
            } else {
                _default['pagination'] = null;
            }
    
            //=>navigation
            let navigation = options.navigation;
            if (navigation !== null) {
                navigation = navigation || {};
                for (let key in navigation) {
                    if (!navigation.hasOwnProperty(key)) break;
                    _default['navigation'][key] = navigation[key];
                }
            } else {
                _default['navigation'] = null;
            }
    
            //=>on
            let _on = options.on;
            if (_on !== null) {
                _on = _on || {};
                for (let key in _on) {
                    if (!_on.hasOwnProperty(key)) break;
                    _default['on'][key] = _on[key];
                }
            } else {
                _default['on'] = null;
            }
    
            //3.把处理好的信息挂载到实例上
            for (let key in _default) {
                if (!_default.hasOwnProperty(key)) break;
                this[key] = _default[key];
            }
        }

        // 自动轮播
        autoPlay() {
            this.activeIndex ++;
            if(this.activeIndex >= this.count) {
                this.activeIndex = 0;
            }

            this.changeImg();
        }

        // 图片切换
        changeImg() {
            /*[].forEach.call(this.slideList, function(item, index) {
                // this:window，要用箭头函数才能让this指向实例
            });*/
            [].forEach.call(this.slideList, (item, index) => {
                if(index === this.activeIndex) {
                    item.style.transition = `opacity ${this.speed}ms`;
                    item.style.zIndex = 1;
                    return;
                }
                item.style.transition = `opacity 0ms`;
                item.style.zIndex = 0;
            });
            
            // 开始动画
            let active = this.slideList[this.activeIndex];
            active.style.opacity = 1;
            active.addEventListener('transitionEnd', () => {
                [].forEach.call(this.slideList, (item, index) => {
                    if(index !== this.activeIndex) {
                        item.style.opacity = 0;
                    }
                });
            });

            //=>焦点对齐
			if (this.paginationList) {
				[].forEach.call(this.paginationList, (item, index) => {
					if (index === this.activeIndex) {
						item.className = "active";
						return;
					}
					item.className = "";
				});
			}
        }

        // 分页器的处理
        handlePagination(){
            this.paginationBox = this.container.querySelector(this.pagination.el);
            let str = ``;
            for(let i = 0; i < this.count; i++) {
                str += `<span class="${i === this.activeIndex? 'active' : ''}"></span>`;
            }
            this.paginationBox.innerHTML = str;
            this.paginationList = this.paginationBox.querySelectorAll('span');
            // 是否触发焦点切换
            if(this.pagination.triggerEvent) {
                [].forEach.call(this.paginationList, (item, index) => {
                    item.addEventListener(this.pagination.triggerEvent, () => {
                        this.activeIndex = index;
                        this.changeImg();
                    });
                });
            }
        }

        // 前进和后退按钮
        handleBtn() {
            this.prevEl = this.container.querySelector(this.navigation.prevEl);
            this.prevEl.addEventListener('click', () => {
                this.activeIndex--;
                this.activeIndex < 0 ? this.activeIndex = this.count - 1 : null;
                this.changeImg();
            });

            this.nextEl = this.container.querySelector(this.navigation.nextEl);
            this.nextEl.addEventListener('click', this.autoPlay.bind(this));

            // 显示/隐藏按钮的处理
            if(this.navigation.hide) {
                this.prevEl.style.display = 'none';
                this.nextEl.style.display = 'none';

                this.container.addEventListener('mouseenter', () => {
                    this.prevEl.style.display = 'block';
                    this.nextEl.style.display = 'block';
                });
                this.container.addEventListener('mouseleave', () => {
                    this.prevEl.style.display = 'none';
                    this.nextEl.style.display = 'none';
                });
            }
        }

        /*设置私有的方法*/
		static throttle(func, wait) {
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

    }

    window.Banner = Banner;
})();