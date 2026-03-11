/*****
 * ==================== 脚本说明 ====================
 
 * 脚本功能：QQ农场code自动更新
 * 软件版本：https://github.com/wanghongenpin/proxypin
 * 下载地址：
 * 脚本作者：vullfin    
 * 更新时间：2026年
 * 电报频道：https://t.me/vullfin
 * 问题反馈：提取code并阻断请求自动上传服务器
 * 使用声明：此脚本仅供学习与交流，请在下载使用24小时内删除！请勿在中国大陆转载与贩卖！
 * 
 * 
 * ==================== 使用说明 ====================
 * 1，在浏览器按F12，点NetWork，点击账号管理界面，点击排在前面的name为：accounts的数据，接着在右边点Response就可以看见所有账号的ID
 * PS:只有一个账号ID默认为1
 * 2、Proxypin直接导入即可，有几个账号导入几份，仅需修改ID，需要更新哪个打开对应账号开关，去qq进一下小程序即可。
 * PS:多账号，一个账号对应一个脚本，不可以全部打开！！！！！！！！
 * ================================================
 */

//=================== 脚本配置 ==============
globalThis.FARM_CONFIG = {
    password: "绿玩密码",    //输入绿玩服务器管理密码
    targetId: "11",         //输入绿玩QQ账号对应ID
    apiUrl: "https://xxx.xxx:xxx"     //绿玩平台地址，有端口的话也需输入
};

function onRequest(context, request) {
    console.log(`[${new Date().toLocaleString()}] 脚本触发：${request.url}`);

    function getQueryParam(url, key) {
        const match = RegExp(`[?&]${key}=([^&]*)`).exec(url);
        return match ? decodeURIComponent(match[1]) : null;
    }

    const platform = getQueryParam(request.url, 'platform');
    const code = getQueryParam(request.url, 'code');

    if (platform !== 'qq' || !code) {
        console.log("非目标请求，放行");
        return request;
    }
    console.log(`✅ 抓到有效code：${code}`);

    const urlTargetId = getQueryParam(request.url, 'targetId');

    (async function() {
        try {
            const PWD = globalThis.FARM_CONFIG.password;
            const LOGIN_URL = `${globalThis.FARM_CONFIG.apiUrl}/api/login`;
            const ACCOUNTS_LIST_URL = `${globalThis.FARM_CONFIG.apiUrl}/api/accounts`;
            const TARGET_ID = urlTargetId || globalThis.FARM_CONFIG.targetId;

            console.log("🔑 开始登录获取Token...");
            const loginRes = await fetch(LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: PWD }),
                rejectUnauthorized: false
            });
            const loginText = await loginRes.text();
            console.log(`登录响应：${loginText}`);

            if (!loginRes.ok) throw new Error(`登录失败：${loginRes.status} - ${loginText}`);
            const loginData = JSON.parse(loginText);
            if (!loginData.ok || !loginData.data?.token) throw new Error("登录响应无Token：" + loginText);
            const token = loginData.data.token;
            console.log(`✅ Token获取成功：${token.substring(0,10)}...`);

            console.log("🔍 获取账号列表...");
            const listRes = await fetch(ACCOUNTS_LIST_URL, {
                headers: {
                    "x-admin-token": token,
                    "Content-Type": "application/json"
                },
                rejectUnauthorized: false
            });
            const listText = await listRes.text();
            console.log(`账号列表响应：${listText}`);

            const listData = JSON.parse(listText);
            if (!listData.ok || !listData.data?.accounts) throw new Error("账号列表格式错误");
            
            const targetAccount = listData.data.accounts.find(acc => acc.id === TARGET_ID);
            if (!targetAccount) throw new Error(`未找到ID=${TARGET_ID}的账号`);
            console.log(`✅ 找到目标账号：${JSON.stringify(targetAccount)}`);

            console.log(`� 先停止账号${TARGET_ID}...`);
            const stopRes = await fetch(`${ACCOUNTS_LIST_URL}/${TARGET_ID}/stop`, {
                method: "POST",
                headers: { "x-admin-token": token },
                rejectUnauthorized: false
            });
            if (!stopRes.ok) {
                const stopText = await stopRes.text();
                throw new Error(`停止账号失败：${stopRes.status} - ${stopText}`);
            }
            console.log(`✅ 账号${TARGET_ID}已停止`);

            console.log(`📝 更新账号${TARGET_ID}的Code...`);
            const updateRes = await fetch(ACCOUNTS_LIST_URL, {
                method: "POST",
                headers: {
                    "x-admin-token": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...targetAccount,
                    code: code,
                    platform: "qq"
                }),
                rejectUnauthorized: false
            });
            if (!updateRes.ok) {
                const updateText = await updateRes.text();
                throw new Error(`更新Code失败：${updateRes.status} - ${updateText}`);
            }
            console.log(`✅ 账号${TARGET_ID} Code更新成功（新Code：${code}）`);

            console.log(`� 开始启动账号${TARGET_ID}...`);
            const startRes = await fetch(`${ACCOUNTS_LIST_URL}/${TARGET_ID}/start`, {
                method: "POST",
                headers: { "x-admin-token": token },
                rejectUnauthorized: false
            });
            if (!startRes.ok) {
                const startText = await startRes.text();
                throw new Error(`启动账号失败：${startRes.status} - ${startText}`);
            }
            console.log(`✅ 账号${TARGET_ID}启动成功！流程全部完成`);

        } catch (err) {
            console.error(`❌ 流程处理失败：${err.message}`);
        }
    })();

    return null;
}
