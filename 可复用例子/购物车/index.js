/*
//操作DOM
let cartModule = (function($){
    let $btns = $('.list i'), //索引奇数是加号，偶数是减号
        $counts = $('.list em'),
        $strongs = $('.list strong'),
        $ems = $('.info em');


    // 实现加号减号的点击事件(可以直接写在上面的按钮方法里)
    function handelClick() {
        $btns.click(function() {
            let $this = $(this),
                //JQ中的index方法获取的是元素在兄弟结构中的索引
                n = $this.index(); //0是减号，2是加号

            // 根据点击按钮获取当前行中的存储数字、单价、总价的元素
            let $par = $this.parent(),
                $count = $par.children('em'),
                $strongs = $par.find('strong'),
                $price = $strongs.eq(0),
                $total = $strongs.eq(1);
            // 获取数量、单价和总价
            let count = parseInt($count.html()),
                price =  parseFloat($price.html()),
                total =  parseFloat($total.html());
            
            if(n === 0) {
                if(count === 0) return;
                count --;
            }
            else{
                if(count === 10) return;
                count ++;
            }
            $count.html(count);
            total = price * count;
            $total.html(total+ '元');
            computed();
        });
    }

    // 计算总价
    function computed() {
        let allCount = 0,
            allMoney = 0,
            allPrice = [];
        $counts.each((index, item) => {
            allCount += parseInt($(item).html());
        });
        $ems.eq(0).html(allCount);

        // 计算总价和最高单价
        $strongs.each((index, item) => {
            let item_val = parseFloat($(item).html());
            if(index % 2 === 1) {
                allMoney += item_val;
            }  
            else {
                // 只有购买了的商品才比较单价
                if(parseFloat($(item).next('strong').html()) !== 0) {
                    allPrice.push(item_val);
                }
            }

        });
        $ems.eq(1).html(allMoney);
        // 数组不为空才比较
        if(allPrice)
            $ems.eq(2).html(Math.max(...allPrice));
    }

    return {
        init: function() {
            handelClick();
        }
    }
})(jQuery);

cartModule.init();
*/

// 操作数据
let cartModule = (function ($) {
	let $list = $('.list'),
		$info = $('.info'),
		$btns = null;

	//=>准备数据模型（页面就是按照数据模型渲染出来的）
	let _DATA = [{
		id: 1,
		count: 0,
		price: 12.5,
		total: 0
	}, {
		id: 2,
		count: 0,
		price: 10.5,
		total: 0
	}, {
		id: 3,
		count: 0,
		price: 8.5,
		total: 0
	}, {
		id: 4,
		count: 0,
		price: 8,
		total: 0
	}, {
		id: 5,
		count: 0,
		price: 14.5,
		total: 0
	}];

	//=>render:按照数据模型渲染视图
	function render() {
		//渲染操作区域视图
		let str = ``;
		$.each(_DATA, (index, item) => {
			let {
				count,
				price,
				total,
				id
			} = item;
			str += `<li>
				<i group="${id}"></i>
				<em>${count}</em>
				<i group="${id}"></i>
				<span>
					单价：<strong>${price}元</strong>
					小计：<strong>${total}元</strong>
				</span>
			</li>`;
		});
		$list.html(str);

		//渲染总计信息区视图
		let counts = 0,
			totals = 0,
			maxprice = 0;
		_DATA.forEach(item => {
			counts += item.count;
			totals += item.total;
			//=>购买才进入最高价格的计算
			if (item.count > 0) {
				maxprice < item.price ? maxprice = item.price : null;
			}
		});
		$info.html(`<span>商品公合计：<em>${counts}</em>件</span>
		<span>共花费了：<em>${totals}</em>元</span>
		<span>其中最贵的商品单价是：<em>${maxprice}</em>元</span>`);

		//执行事件绑定，每一次渲染都会重新获取新的按钮
		handle();
	}

	//=>handle:点击按钮操作（不操作DOM，只改变_DATA的数据）
	function handle() {
		$btns = $list.find('i');
		$btns.click(function () {
			let $this = $(this),
				n = $this.index(),
				group = parseFloat($this.attr('group'));
			//修改数据
			_DATA = _DATA.map(item => {
				if (item.id === group) {
					if (n === 0) {
						item.count--;
						item.count < 0 ? item.count = 0 : null;
					} else {
						item.count++;
						item.count > 10 ? item.count = 10 : null;
					}
					item.total = item.price * item.count;
				}
				return item;
			});
			//重新渲染
			render();
		});
	}

	return {
		init() {
			render();
		}
	}
})(jQuery);

cartModule.init();