#
# Copyright (C) 2020-2022 lala-openwrt <https://github.com/bauw2008/op>
#
# This is free software, licensed under the Apache License, Version 2.0 .
# 
# Welcome to my Github <https://github.com/bauw2008/>
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-turboacc

LUCI_TITLE:=LuCI2 support for Flow Offload / Shortcut-FE
LUCI_DEPENDS:=+luci-compat \
	+PACKAGE_$(PKG_NAME)_INCLUDE_BBR_CCA:kmod-tcp-bbr \
	+PACKAGE_$(PKG_NAME)_INCLUDE_OFFLOADING:kmod-nft-offload \
	+PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE:kmod-fast-classifier \
	+PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE_CM:kmod-shortcut-fe-cm \
	+PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE_DRV:kmod-shortcut-fe-drv \
	+PACKAGE_$(PKG_NAME)_INCLUDE_NFT_FULLCONE:kmod-nft-fullcone

PKG_CONFIG_DEPENDS:= \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_BBR_CCA \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_OFFLOADING \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE_CM \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE_DRV \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_NFT_FULLCONE

define Package/$(PKG_NAME)/config
	config PACKAGE_$(PKG_NAME)_INCLUDE_OFFLOADING
		bool "Include Flow Offload"
		default y if !(TARGET_x86||TARGET_ipq60xx||TARGET_ipq806x||TARGET_ipq807x||TARGET_qualcommax)

	config PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE
		bool "Include Shortcut-FE"
		depends on PACKAGE_$(PKG_NAME)_INCLUDE_OFFLOADING=n
		default n

	config PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE_CM
		bool "Include Shortcut-FE CM"
		depends on PACKAGE_$(PKG_NAME)_INCLUDE_OFFLOADING=n
		depends on PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE=n
		default y if !(TARGET_ipq60xx||TARGET_ipq806x||TARGET_ipq807x||TARGET_qualcommax)

	config PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE_DRV
		bool "Include Shortcut-FE ECM"
		depends on PACKAGE_$(PKG_NAME)_INCLUDE_OFFLOADING=n
		depends on PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE=n
		depends on PACKAGE_$(PKG_NAME)_INCLUDE_SHORTCUT_FE_CM=n
		depends on (TARGET_ipq60xx||TARGET_ipq806x||TARGET_ipq807x)
		default y

	config PACKAGE_$(PKG_NAME)_INCLUDE_BBR_CCA
		bool "Include BBR CCA"
		default y
	
	config PACKAGE_$(PKG_NAME)_INCLUDE_NFT_FULLCONE
	        bool "Include NFT FULLCONE"
	        default y
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
