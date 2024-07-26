# Copyright 2022- Duncan Hill <openwrt-dev@cricalix.net>
# This is free software, licensed under the Apache License, Version 2.0

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for AdguardHome
LUCI_DEPENDS:=+adguardhome +luci-lib-jsonc +luasocket +lyaml
LUCI_PKGARCH:=all

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Duncan Hill <openwrt-dev@cricalix.net>
PKG_NAME:=luci-app-adguardhome

define Package/luci-app-adguardhome/conffiles
/etc/config/AdGuardHome
/etc/AdGuardHome.yaml
endef
# Version == major.minor.patch
# increase "minor" on new functionality and "patch" on patches/optimization
PKG_VERSION:=1.0.0

# Release == build
# increase on changes of translation files
PKG_RELEASE:=1


include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
