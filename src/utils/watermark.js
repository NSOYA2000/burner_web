import Vue from 'vue'

Vue.directive('watermark', (el, binding) => {
    function addWaterMarker(str, parentNode, font, textColor) {// 水印文字，父元素，字体，文字颜色
        var can = document.createElement('canvas');
        parentNode.appendChild(can);
        can.width = 160;
        can.height = 200;
        can.style.display = 'none';
        var cans = can.getContext('2d');
        cans.rotate(-20 * Math.PI / 180);
        cans.font = font || "13px Microsoft JhengHei";
        cans.fillStyle = textColor || "rgba(180, 180, 180, 0.7)";
        cans.textAlign = 'left';
        cans.textBaseline = 'Middle';
        cans.fillText(str, can.width / 5, can.height / 2);
        parentNode.style.backgroundImage = "url(" + can.toDataURL("image/png") + ")";
    }
    addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor)
})