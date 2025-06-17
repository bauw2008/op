'use strict';
'require view';
'require fs';
'require uci';
'require form';
'require tools.widgets as widgets';


var CBIMsdLiteStatus = form.DummyValue.extend({
    load: function () {
        return uci.load('msd_lite').then(() => {
            const sec = uci.sections('msd_lite').find(s => s['.type'] === 'instance' && s.address);
            if (!sec) {
                this.default = E('em', {}, [_('msd_lite 服务未配置或未启用')]);
                return;
            }
            const addr = Array.isArray(sec.address) ? sec.address[0] : sec.address;
            const url = 'http://' + addr.replace(/^\[|\]$/g, '') + '/stat';

            return fs.exec_direct('/usr/bin/wget', ['-q', url, '-O', '-']).then(L.bind(function (res) {
                if (!res || res.trim() === '') {
                    this.default = E('em', {}, [_('msd_lite 服务未运行')]);
                } else {
                    this.default = E('span', { style: 'color: green' }, _('msd_lite 正在运行'));
                }
            }, this), L.bind(function () {
                this.default = E('em', {}, [_('msd_lite 服务未运行')]);
            }, this));
        });
    }
});


return view.extend({
    render: function () {
        let m, s, o;

        m = new form.Map('msd_lite', _('Multi Stream daemon Lite'),
            _('The lightweight version of Multi Stream daemon (msd) Program for organizing IPTV streaming on the network via HTTP.'));

        // 状态区
        s = m.section(form.TypedSection);
        s.anonymous = true;
        s.cfgsections = () => ['_status'];

        o = s.option(CBIMsdLiteStatus);

        // 实例配置区
		s = m.section(form.TypedSection, 'instance');
		s.anonymous = true;
		s.addremove = true;
		s.addbtntitle = _('Add instance');

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.default = o.disabled;
		o.rmempty = false;

		o = s.option(form.DynamicList, 'address', _('Bind address'));
		o.datatype = 'ipaddrport(1)';
		o.rmempty = false;

		o = s.option(form.Button, 'view_button', _('组播后台'));
		o.inputtitle = "web Server";
		o.onclick = function () {
		var addressElement = document.querySelector('#cbid\\.msd_lite\\.cfg0121da\\.address .item input[type="hidden"]');
		if (addressElement) {
		var address = addressElement.value;
		window.open('http://' + address + '/stat', '_blank');
		    }
		};
		
		o = s.option(widgets.NetworkSelect, 'network', _('Source interface'),
			_('For multicast receive.'));
		o.nocreate = true;
		o.optional = true;

		o = s.option(form.Value, 'threads', _('Worker threads'),
			_('Leave 0 or <em>empty</em> to auto detect.'));
		o.datatype = 'uinteger';
		o.default = '0';

		o = s.option(form.Flag, 'bind_to_cpu', _('Bind threads to CPUs'));
		o.default = o.disabled;

		o = s.option(form.Flag, 'drop_slow_clients', _('Disconnect slow clients'));
		o.default = o.disabled;

		o = s.option(form.Value, 'precache_size', _('Pre cache size'));
		o.datatype = 'uinteger';
		o.default = '4096';

		o = s.option(form.Value, 'ring_buffer_size', _('Ring buffer size'),
			_('Stream receive ring buffer size.'));
		o.datatype = 'uinteger';
		o.default = '1024';

		o = s.option(form.Value, 'multicast_recv_buffer_size', _('Receive buffer size'),
			_('Multicast receive socket buffer size.'));
		o.datatype = 'uinteger';
		o.default = '512';

		o = s.option(form.Value, 'multicast_recv_timeout', _('Receive timeout'),
			_('Multicast receive timeout.'));
		o.datatype = 'uinteger';
		o.default = '2';

		o = s.option(form.Value, 'rejoin_time', _('IGMP/MLD rejoin time'),
			_('Do IGMP/MLD leave+join every X seconds. Leave <em>0</em> to disable.'));
		o.datatype = 'uinteger';
		o.default = '0';

		return m.render();
	}
});
