'use strict';
'require view';
'require form';
'require uci';
'require rpc';
'require poll';

function generateHexId() {
  let hex = '';
  for (let i = 0; i < 16; i++) {
    const byte = Math.floor(Math.random() * 256);
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

var callServiceList = rpc.declare({
  object: 'service',
  method: 'list',
  params: ['name'],
  expect: { '': {} }
});

function getServiceStatusMap() {
  return L.resolveDefault(callServiceList('socat2'), {}).then(function (res) {
    const statusMap = {};
    try {
      const instances = res?.socat2?.instances || {};
      for (const uuid in instances) {
        statusMap[uuid] = !!instances[uuid].running;
      }
    } catch (e) {
      console.warn('getServiceStatusMap() error:', e);
    }
    return statusMap;
  });
}

return view.extend({
  load: async function () {
    await uci.load('network');
    const lanIPRaw = uci.get('network', 'lan', 'ipaddr') || '';
    let lanIP = Array.isArray(lanIPRaw) ? lanIPRaw[0] : lanIPRaw;
	if (typeof lanIP === 'string' && lanIP.includes('/')) {
	  lanIP = lanIP.split('/')[0];
	}


    await uci.load('socat');
    const sections = uci.sections('socat', 'config');

    let changed = false;

    for (const s of sections) {
      const sid = s['.name'];
      if (!/^[a-f0-9]{32}$/.test(sid)) {
        const new_id = generateHexId();
        const options = Object.assign({}, s);

        uci.remove('socat', sid);
        uci.set('socat', new_id, 'config');

        for (const [k, v] of Object.entries(options)) {
          if (!k.startsWith('.') && k !== '_uuid') {
            uci.set('socat', new_id, k, v);
          }
        }

        changed = true;
      }
    }

    if (changed) {
      await uci.save();
      await uci.load('socat');
    }

    const statusMap = await getServiceStatusMap();

    return {
      ipList: lanIP ? [lanIP] : [],
      statusMap: statusMap || {}
    };
  },

  render: function (data) {
    const ipList = data.ipList || [];
    const statusMap = data.statusMap || {};

    const m = new form.Map('socat', _('SOCAT'),
      _("SOCAT <a href='https://github.com/bauw2008/op/tree/main/luci-app-socat-js' target='_blank'>(GitHub)</a> is a powerful and flexible networking tool that allows you to forward, bridge, and transform data across various protocols. It serves as a versatile solution for network diagnostics, port forwarding, and creating complex network connections, with support for encryption and more."));

    m.statusMap = statusMap;

    const s = m.section(form.GridSection, 'config', _('Port Forwards'));
    s.anonymous = false;
    s.addremove = true;
    s.addbtntitle = _('');
    s.modaltitle = _('');
    s.addNamedSection = true;

    s.handleCreate = async function () {
      const uuid = generateHexId();
      await uci.save();
      await uci.load('socat');
      return uuid;
    };

    m.render().then(function (view) {
      const createBox = view.querySelector('.cbi-section-create');
      if (!createBox) return view;

      const input = createBox.querySelector('input');
      const button = createBox.querySelector('button');

      if (input && button) {
        const uuid = generateHexId();
        input.value = uuid;
        ['input', 'change'].forEach(e => input.dispatchEvent(new Event(e, { bubbles: true })));
        button.disabled = false;
      }

      return view;
    });

    const status = s.option(form.DummyValue, '_status', _('Status'));

    status.cfgvalue = function (sid) {
      const running = this.map.statusMap?.[sid];
      if (running === true)
        return '✔️';
      else if (running === false)
        return '❌';
      else
        return '⛔️';
    };

    status.render = function (section_id, row_id) {
      if (row_id != null)
        return E('div', { style: 'display: none' });
      return form.DummyValue.prototype.render.apply(this, arguments);
    };

    let o;

    o = s.option(form.Flag, 'enable', _('Enable'));
    o.default = '0';
    o.editable = true;
    o.rmempty = false;

    o = s.option(form.Value, 'remarks', _('Remarks'));
    o.placeholder = _('Remarks');

    o = s.option(form.DummyValue, '_listen_proto', _('Listen Protocol'));
    o.optional = true;
    o.default = '-';

    o.render = function (section_id, row_id) {
      if (row_id != null)
        return E('div', { style: 'display: none' });
      return form.DummyValue.prototype.render.apply(this, arguments);
    };

    o.cfgvalue = function (sid) {
      let family = uci.get('socat', sid, 'family') || '';
      let proto = (uci.get('socat', sid, 'proto') || '').toUpperCase();
      if (!proto) return '-';
      return family ? `IPv${family}-${proto}` : proto;
    };

    o = s.option(form.ListValue, 'protocol', _('Protocol'));
    o.value('port_forwards', _('Port Forwards'));
    o.default = 'port_forwards';
    o.modalonly = true;

    o = s.option(form.ListValue, 'family', _('Restrict to address family'));
    o.value('', _('IPv4 and IPv6'));
    o.value('4', _('IPv4 only'));
    o.value('6', _('IPv6 only'));
    o.depends({ 'protocol': 'port_forwards' });
    o.modalonly = true;

    o = s.option(form.ListValue, 'proto', _('Protocol'));
    o.value('tcp', 'TCP');
    o.value('udp', 'UDP');
    o.depends({ 'protocol': 'port_forwards' });
    o.modalonly = true;

    o = s.option(form.Value, 'listen_port', _('Listen port'));
    o.datatype = 'portrange';

    o = s.option(form.Flag, 'reuseaddr', _('REUSEADDR'));
    o.default = '1';
    o.rmempty = false;
    o.description = _('Bind to a port local');
    o.modalonly = true;

    o = s.option(form.ListValue, 'dest_proto', _('Destination Protocol'));
    o.value('tcp4', 'IPv4-TCP');
    o.value('udp4', 'IPv4-UDP');
    o.value('tcp6', 'IPv6-TCP');
    o.value('udp6', 'IPv6-UDP');
    o.default = 'tcp4';

    o = s.option(form.Value, 'dest_ip', _('Destination address'));
    o.placeholder = _('Destination address');
    o.datatype = 'host';
    o.editable = true;
    ipList.forEach(ip => o.value(ip));

    o = s.option(form.Value, 'dest_port', _('Destination port'));
    o.datatype = 'portrange';

    o = s.option(form.Flag, 'firewall_accept', _('Open firewall port'));
    o.default = '1';
    o.editable = true;

    o = s.option(form.ListValue, 'proxy', _('Proxy'));
    o.value('', _('None'));
    o.value('socks4/4a', 'Socks4/4a');
    o.value('http', 'HTTP');
    o.depends({ 'proto': 'tcp' });
    o.depends({ 'dest_proto': 'tcp4' });
    o.modalonly = true;

    o = s.option(form.Value, 'proxy_server', _('Proxy Server'));
    o.placeholder = '127.0.0.1';
    o.default = o.placeholder;
    o.depends({ 'proxy': 'socks4/4a' });
    o.depends({ 'proxy': 'http' });
    o.modalonly = true;

    o = s.option(form.Value, 'proxy_port', _('Proxy Port'));
    o.datatype = 'port';
    o.placeholder = '1080';
    o.default = o.placeholder;
    o.depends({ 'proxy': 'socks4/4a' });
    o.depends({ 'proxy': 'http' });
    o.modalonly = true;

    o.validate = function(section_id, value) {
      for (let ip of value || []) {
        if (!/^(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?$/.test(ip) &&
            !/^[a-fA-F0-9:]+(?:\/\d{1,3})?$/.test(ip)) {
          return _('Invalid IP address or subnet: %s').format(ip);
        }
      }
      return true;
    };

    return m.render();
  }
});

