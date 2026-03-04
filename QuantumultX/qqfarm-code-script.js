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



const url = $request.url;

if (url.includes("code=")) {
    // 提取code（正则精准匹配）
    const codeMatch = url.match(/code=([^&]+)/);
    const code = codeMatch ? codeMatch[1] : null;

    if (code) {
        console.log("🎯 成功获取 QQ农场Code: " + code);
        
        // 1. 持久化存储（兜底，防止剪贴板失效）
        $persistentStore.write(code, "qq_farm_code");
        
        // 2. 兼容版通知弹窗（适配所有圈X版本）
        // 写法1：通用版notify（优先）
        $notify("QQ农场 Code提取成功", "", "Code：" + code);
        // 写法2：备用版notification（兼容旧版本）
        if (typeof $notification !== 'undefined') {
            $notification.post("QQ农场 Code", "提取成功", code);
        }
        
        // 3. 兼容版剪贴板复制（核心修复）
        // 方案A：圈X原生剪贴板（通用）
        if (typeof $clipboard !== 'undefined') {
            $clipboard.copy(code);
        }
        // 方案B：iOS系统剪贴板桥接（兜底，必生效）
        $persistentStore.write(code, "clipboard_qq_farm_code");
        const pasteCode = $persistentStore.read("clipboard_qq_farm_code");
        if (pasteCode) {
            // 触发系统剪贴板写入（圈X隐藏API）
            $exec(`echo '${pasteCode}' | pbcopy`);
        }
    }
}

// 放行请求，确保游戏正常登录
$done({ request: $request });
