/* 简易的拖拽插件
        new Drag([selector], [options])
   selector
        按住谁来实现拖拽
   options = {}
        element: 拖拽中要移动的元素（默认值：当前按住的元素）
        boundary: 是否进行边界检验（默认值：true，不能超过要移动元素所在容器的范围，需要开发者保证当前移动的元素是相对于它所在的容器定位的）

        生命周期函数（回调/钩子函数）
        dragstart: 拖拽开始
        dragmove: 拖拽中
        dragend: 拖拽结束
*/

(function () {
    // 拖拽插件封装
    class Drag {
        constructor(selector, options) {
            this.innitParams(selector, options);
            this._selector.addEventListener('mousedown', this.down.bind(this));
        }

        // 参数初始化
        innitParams(selector, options = {}) {
            this._selector = document.querySelector(selector);
            // 配置项的默认值信息
            let defaultParams = {
                element: this._selector,
                boundary: true,
                dragstart: null,
                dragmove: null,
                dragend: null
            };
            // for(let key in options) {
            //     if(!options.hasOwnProperty(key)) 
            //         break;
            //     defaultParams[key] = options[key];
            // }
            defaultParams = Object.assign(defaultParams, options);
            // 挂载到实例上
            Drag.each(defaultParams, (value, key) => {
                // 箭头函数，this还是指向上面的实例
                this['_' + key] = value;
            });
        }

        // 实现拖拽效果
        down(ev) {
			let {
				_element
			} = this;
			this.startX = ev.pageX;
			this.startY = ev.pageY;
			this.startL = Drag.queryCss(_element, 'left');
			this.startT = Drag.queryCss(_element, 'top');
			this._move = this.move.bind(this);
			this._up = this.up.bind(this);
			document.addEventListener('mousemove', this._move);
			document.addEventListener('mouseup', this._up);
			//=>钩子函数处理
			this._dragstart && this._dragstart(this, ev);
		}
		move(ev) {
			let {
				_element,
				_boundary,
				startX,
				startY,
				startL,
				startT
			} = this;
			let curL = ev.pageX - startX + startL,
				curT = ev.pageY - startY + startT;
			if (_boundary) {
				//=>处理边界
				let parent = _element.parentNode,
					minL = 0,
					minT = 0,
					maxL = parent.offsetWidth - _element.offsetWidth,
					maxT = parent.offsetHeight - _element.offsetHeight;
				curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
				curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
			}
			_element.style.left = curL + 'px';
			_element.style.top = curT + 'px';

			//=>钩子函数处理
			this._dragmove && this._dragmove(this, curL, curT, ev);
		}
		up(ev) {
			document.removeEventListener('mousemove', this._move);
			document.removeEventListener('mouseup', this._up);
			
			//=>钩子函数处理
			this._dragend && this._dragend(this, ev);
		}

        // 设置工具类方法：当做类的私有属性
        // 简单的each方法
        static each(arr, callBack) {
            if ('length' in arr) {
                // 数组||类数组
                for(let i = 0; i < arr.length; i++) {
                    callBack && callBack(arr[i], i);
                }
                return;
            }
            // 普通对象
            for (let key in arr) {
                if (!arr.hasOwnProperty(key))
                    break;
                callBack && callBack(arr[key], key);
            }
        }

        static queryCss(curEle, attr) {
			return parseFloat(window.getComputedStyle(curEle)[attr]);
		}
    }
    window.Drag = Drag;
})();