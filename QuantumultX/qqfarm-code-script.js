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


if ($request.url.match(/code=([^&]+)/)) {
    $notify("QQ农场", "已提取code", $request.url.match(/code=([^&]+)/)[1]);
    // 针对微信优化：用 200 状态 + 空内容 替代 404，拦截更彻底
    $done({
        response: {
            status: 200,       // 改用 200 避免微信重试
            headers: {         // 清空响应头，防止微信识别
                "Content-Type": "text/plain",
                "Content-Length": "0"
            },
            body: ""           // 空响应体，彻底阻断有效请求
        }
    });
} else {
    $done({});
}
