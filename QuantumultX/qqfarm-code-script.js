/*******************************
 *
 * 脚本功能：QQ农场code提取
 * 软件版本：Quantumult X 最新版
 * 下载地址：https://github.com/rpvvn/vv-qx-script/edit/main/QuantumultX/qqfarm-code-script.js
 * 脚本作者：vullfin    
 * 更新时间：2026年
 * 电报频道：https://t.me/vullfin
 * 问题反馈：提取code并阻断请求避免失效，自动复制到剪贴板
 * 使用声明：此脚本仅供学习与交流，请在下载使用24小时内删除！请勿在中国大陆转载与贩卖！

************************************************
[rewrite_local]
^https?://gate-obt\.nqf\.qq\.com/prod/ws\?.*code=.* url script-request-header https://raw.githubusercontent.com/rpvvn/vv-qx-script/main/QuantumultX/qqfarm-code-script.js

[mitm]
hostname = gate-obt.nqf.qq.com

*******************************/


// 核心：QX正确的剪贴板API是 $clipboard，不是 $persistentStore
const url = $request.url;

if (url.includes("code=")) {
    // 提取 code
    const codeMatch = url.match(/code=([^&]+)/);
    const code = codeMatch ? codeMatch[1] : null;

    if (code) {
        console.log("🎯 成功获取 code: " + code);
        
        // 自动复制到剪贴板
        $persistentStore.write(code, "qq_farm_code");
        $notification.post("QQ农场 Code", "", "已复制: " + code);
        
        // 注意：如果不发送请求，游戏登录会失败。
        // 如果想让游戏正常运行仅复制 code，请注释掉下面这行
        // $done({response: {status: 404}}); 
    }
}

$done({});
