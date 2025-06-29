# Copyright 2025
# This is free software, licensed under the Apache License, Version 2.0

include $(TOPDIR)/rules.mk

PKG_LICENSE:=Apache-2.0

LUCI_TITLE:=LuCI support for AdguardHome
LUCI_DEPENDS:=+adguardhome +luci-base +bcrypt-tool +twin-bcrypt-js

PKG_MAINTAINER:=Douglas Orend <doug.orend2@gmail.com>

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
