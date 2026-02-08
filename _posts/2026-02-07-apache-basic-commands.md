---
layout: default
title: "Apache Basic Commands"
tags: [Apache]
---

# Apache Basic Commands

These commands are tested on Ubuntu (systemd). The `service` command is a
compatibility wrapper that also works on older SysV/OpenRC systems.

You will typically need `sudo` for service management commands.

## Start Apache

Use one of the following commands:

```bash
sudo service apache2 start
# or
systemctl start apache2
```

## Stop Apache

Use one of the following commands:

```bash
sudo service apache2 stop
# or
systemctl stop apache2
```

## Restart Apache

Use one of the following commands:

```bash
sudo service apache2 restart
# or
systemctl restart apache2
```

## Reload Apache

Use one of the following commands:

```bash
sudo service apache2 reload
# or
systemctl reload apache2
```

Reloading is generally preferable to restarting if you are making configuration changes.

## Test Apache configuration

To check the configuration for syntax errors, use the following command:

```bash
apache2ctl configtest
```

This command checks the configuration files for syntax errors without starting
the server.