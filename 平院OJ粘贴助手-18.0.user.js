// ==UserScript==
// @name         平院OJ粘贴助手
// @namespace    http://tampermonkey.net/
// @version      18.0
// @description  利用 #source 节点进行直接内存注入
// @author       WuMin
// @match        http://39.106.228.241/submitpage.php*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log("物理注入脚本已就绪。快捷键：Alt + V");

    window.addEventListener('keydown', function(e) {
        // 监听 Alt + V
        if (e.altKey && e.key.toLowerCase() === 'v') {
            e.preventDefault();

            // 1. 使用弹窗获取代码 (绕过剪贴板权限限制)
            const code = prompt("请粘贴你的 C++/C 代码：");

            if (code) {
                // 2. 找到你发现的那个关键节点 #source
                const sourcePre = document.getElementById('source');
                const hideSource = document.getElementById('hide_source');

                // 3. 物理注入
                if (sourcePre) {
                    // 如果它是 Ace 编辑器，尝试调用它的 API
                    if (window.editor && typeof window.editor.setValue === 'function') {
                        window.editor.setValue(code);
                        console.log("✅ 已通过编辑器 API 注入");
                    } else {
                        // 如果脚本还没加载（类似你 F12 看到的原始状态），直接写内容
                        sourcePre.innerText = code;
                        console.log("✅ 已通过 HTML 节点物理注入");
                    }
                }

                // 4. 同步给隐藏表单（这是提交给服务器的真正字段）
                if (hideSource) {
                    hideSource.value = code;
                }

                alert("代码注入成功！现在可以输入验证码并点击提交了。");
            }
        }
    }, true);
})();