let imgBox = document.querySelector(".imgBox"),
    _img = document.querySelector("img");

/*
1. 浏览器底部到body的高度A：一屏幕的高度 + 卷曲的高度
2. 盒子底部到body的高度B：盒子的高度 + 盒子的上偏移量
当A >= B 的时候，图片整体露出来，所以显示真实的图片信息
*/

// 显示图片
function lazyImg(curImg) {
    curImg.src = _img.getAttribute("trueImg");
    curImg.onload = function() {
        curImg.style.display = "block";
    }
    curImg.isLoad = true;
}

// 滚动条事件
window.onscroll = function() {
    if(_img.isLoad) return; //如果不加这个判断，lazyImg函数会被重复执行
    let HTML = document.documentElement,
        A = HTML.clientHeight + HTML.scrollTop,
        B = imgBox.offsetHeight + imgBox.offsetTop;
    if(A >= B) { 
       lazyImg(_img);
    }

};