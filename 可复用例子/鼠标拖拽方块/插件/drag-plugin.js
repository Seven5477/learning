/* 简易的拖拽插件
        new Drag([selector], [options])
   selector
        按住谁来实现拖拽
   options = {}
        element: 拖拽中要移动的元素（默认值：当前按住的元素）
        boundary: 是否进行边界检验（默认值：true，不能超过要移动元素所在容器的范围，需要开发者保证当前移动的元素是相对于它所在的容器定位的）

        生命周期函数（回调函数）
        dragstart: 拖拽开始
        dragmove: 拖拽中
        dragend: 拖拽结束
*/

(function () {
    // 拖拽插件封装
    class Drag {
        constructor(selector, options) {
            this.innitParams(selector, options);
            console.log(this);
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
    }
    window.Drag = Drag;
})();

new Drag('.head', {});