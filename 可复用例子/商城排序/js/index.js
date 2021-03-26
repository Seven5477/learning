~function() {
    // 第一步，从服务器获取需要展示的数据，然后绑定到页面中
    // 1.基于ajax获取服务器端数据，把数据存储到DATA中
    let data = null;
    //创建ajax实例；
    let xhr = new XMLHttpRequest();
    //打开一个请求链接，基于GET请求和同步编程完成；
    xhr.open('GET', 'json/product.json', false);
    //监听服务器返回的状态信息（状态码为200，请求状态为4）
    xhr.onreadystatechange = function () {
        if(xhr.status === 200 && xhr.readyState === 4) {
            data = xhr.responseText; //获取响应主体信息
        }
    };
    //发送ajax请求
    xhr.send();

    data = JSON.parse(data);
    console.log(data);

    // 2.把获取的数据data展示在页面中
    // 根据获取的data：data中有多少项，就创建多少个card
    let HTMLStr =  ``;
    data.forEach(item => {
        //item是每一项的信息,在每个card标签上绑定后面排序需要的数据，便于获取
        HTMLStr +=  `<div class="card" 
                            data-price="${item.price}" 
                            data-hot="${item.hot}" 
                            data-time="${item.time}">
                        <img src="${item.img}" class="card-img-top" alt="">
                        <div class="card-body">
                            <h6 class="card-title">${item.title}</h6>
                            <p class="card-text">价格：￥${item.price}</p>
                            <p class="card-text">好评：${item.hot}</p>
                            <p class="card-text"><small class="text-muted">上架时间：${item.time}</small></p>
                        </div>
                    </div> `;
    });

    // 把拼接好的字符串放到指定容器中card-deck
    let cardDeck = document.querySelector(".card-deck");
    cardDeck.innerHTML = HTMLStr;

    // 第二步，点击价格/热度/上架时间来进行升/降序排序
    let clickBtn = document.querySelectorAll('.navbar-nav li'),
        cardList = cardDeck.querySelectorAll('.card');
    
    for(let i = 0; i < clickBtn.length; i++) {
        let item = clickBtn[i];
        item.setAttribute('data-type', -1); //记录排序的状态：升序还是降序
        item.onclick = function() {
			//=>点击当前的某个按钮，让其按照升降序切换，而其余的都应该回归原始-1
			[].forEach.call(clickBtn, item => (item === this ? this['data-type'] *= -1 : item['data-type'] = -1));
            cardList = [].slice.call(cardList);
            // 排序(默认降序)
            cardList.sort((next, cur) => {
                // 获取当前按钮记录的排序类型
                let type = this.getAttribute('data-sort');
                // 获取属性
                cur = cur.getAttribute(type);
                next = next.getAttribute(type);
                if(type === 'data-time') {
                    // 获取的是日期需要去掉中间的横线才能相减
                    cur = cur.replace(/-/g, '');
                    next = next.replace(/-/g, '');
                }
                return (cur - next) * this['data-type']; //升序降序切换
            });
            // 以上只是让数据排好序，页面中的结构还没改,需要按照当前的顺序重新增加到页面容器中
            cardList.forEach(item => {
                cardDeck.appendChild(item);
            });
        }
    }

    // 按照价格的升降序
    /*clickBtn[1].setAttribute('data-type', -1); //记录排序的状态：升序还是降序
    clickBtn[1].onclick = function() {
        this['data-type'] *= -1; //每次都是1和-1,切换排序状态
        // 把cardList类数组转换为数组，便于使用sort排序
        cardList = [].slice.call(cardList);
        // 价格排序(默认降序)
        cardList.sort((next, cur) => {
            // 获取price属性
            cur = cur.getAttribute('data-price');
            next = next.getAttribute('data-price');
            return (cur - next) * this['data-type']; //升序降序切换
        });
        console.log(cardList);
        // 以上只是让数据排好序，页面中的结构还没改,需要按照当前的顺序重新增加到页面容器中
        cardList.forEach(item => {
            cardDeck.appendChild(item);
        });
    }

    clickBtn[2].setAttribute('data-type', -1); //记录排序的状态：升序还是降序
    clickBtn[2].onclick = function() {
        this['data-type'] *= -1; //每次都是1和-1,切换排序状态
        // 把cardList类数组转换为数组，便于使用sort排序
        cardList = [].slice.call(cardList);
        // 价格排序(默认降序)
        cardList.sort((next, cur) => {
            // 获取price属性
            cur = cur.getAttribute('data-hot');
            next = next.getAttribute('data-hot');
            return (cur - next) * this['data-type']; //升序降序切换
        });
        // 以上只是让数据排好序，页面中的结构还没改,需要按照当前的顺序重新增加到页面容器中
        cardList.forEach(item => {
            cardDeck.appendChild(item);
        });
    }*/
}();