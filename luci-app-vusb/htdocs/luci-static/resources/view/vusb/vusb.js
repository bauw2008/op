'use strict';
'require form';
'require uci';
'require view';

return view.extend({
    render: function() {
        var m, s, o;
        m = new form.Map('vusb', _('VirtualHere USB Server'), _('配置虚拟USB服务。将网络设备与本地主机上的USB设备进行映射。<a id="client-software-link" href="http://www.virtualhere.com/usb_client_software">客户端下载</a>，并根据本地主机架构进行安装。<br>注册码（x86、arm64无效）：xxxxxxxxxxxx，999，MCACDkn0jww6R5WOIjFqU/apAg4Um+mDkU2TBcC7fA1FrA=='));
        s = m.section(form.TypedSection, 'instance');
        s.anonymous = true;
        // s.addremove = true;
        // s.addbtntitle = _('Add instance');

        // 添加显示运行状态的选项
        var statusOption = s.option(form.DummyValue, '__status__', _('状态'));
        statusOption.rawhtml = true;
        statusOption.depends('enabled', '1'); // 只在启用时显示状态

        // 添加启用开关选项
        o = s.option(form.Flag, 'enabled', _('启用'));
        o.default = o.disabled;
        o.rmempty = false;
		
		// 添加端口号设置选项
        o = s.option(form.Value, 'port', _('端口号'));
        o.default = '7575'; // 默认端口号为7575
        o.placeholder = '请输入端口号'; // 输入框的占位符

        // 返回渲染结果
        return m.render();
    },
    // 在 render() 函数之外调用初始化和更新函数
    init: function() {
        initializeVusbStatus();
        updateVusbStatus();
    }
});
