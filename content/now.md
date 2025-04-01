---
title: "Now"
description: "See whats going on right now in Adoras tech life"
---
What's going on here?

This is a __now__ page. I'll mention here what I am up to right now at work, in our homelab, etc. Updates to this page will be infrequent, as I know myself to be a bit forgetful about such things. This was inspired by the movement at [nownownow.com](https://nownownow.com/about) ^-^

Last updated: `{{< last-updated >}}`

### Work

I'm currently working on the internal private Cloud platform of my employer. I manage the Arista switch fabric and the firewall, and I keep looking for ways to automate all the things.

Last thing I did was automate block- and whitelisting on our Firewalls with Docker, Ansible and Gitlab.

### Homelab

Writing scripts and stuff in Go to automate stuff :)

A while ago I set up our internal DNS servers with streaming database replication (with dnsdist, unbound, powerdns, and postgres 16)

Ongoing:

- Rework backups from CIFS (Hetzner Storage Box) to restic (to S3 offsite storage)
- Automate stuff like MOTD, Monitoring agents etc. via Ansible

Planned:

- Switch Border router with openWRT
- Switch Ubiquiti AP with Mikrotik cAP
