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
    // 第一步：成功提取并通知 code（保留你原有的逻辑）
    $notify("QQ农场", "已提取code", $request.url.match(/code=([^&]+)/)[1]);
    
    // 第二步：阻断登录 - 返回「合法但无效」的响应，让服务器无法验证 code
    $done({
        response: {
            status: 200,          // 200 避免微信/服务器重试
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            // 返回假的失败响应体，让登录流程卡在这一步
            body: JSON.stringify({
                code: -1,
                msg: "code 验证失败",
                data: null
            })
        }
    });
} else {
    // 非 code 请求正常放行（包括 WebSocket 连接，避免 400 错误）
    $done({});
}
