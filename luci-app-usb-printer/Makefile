#
# Copyright (C) 2008-2014 The LuCI Team <luci@lists.subsignal.org>
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=USB Printer Share via TCP/IP
LUCI_DEPENDS:=+p910nd +kmod-usb-printer +kmod-lp

PKG_NAME:=luci-app-usb-printer
PKG_VERSION:=1.0
PKG_RELEASE:=2

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
