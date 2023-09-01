---
title: "Issues with Docker Swarm on ESXi"
description: "How to make Docker Swarm work with Nodes on ESXi"
publishdate: "2021-04-20"
---

I once tried to set up a Docker Swarm Cluster. I had three nodes, two on Proxmox hosts, and one on a ESXi 7 host. The nodes had a GlusterFS sdtorage attached to them which synced data to all three nodes so containers could be started on any node.

Everything worked wonderfully. Until I found out that some Containers couldn't talk to others.

Off to troubleshooting then. It seemed very sporadic, with communication working most of the time somehow. I tried some things, until I found out that it only happens if a container on the ESXi node tried to talk to others on the Proxmox nodes.

After _A LOT_ of googling and searching many a reddit thread I finally found out why:  
It seems like ESXi, even when in standalone mode, silently drops packets on `udp/4789`, which apparently is VMWares `VTEP VXLAN Port for NSX-T`.

The fix for the Swarm cluster is to (re-)create the Swarm Cluster with `--data-path-port=xxxx`:
```
docker swarm init --data-path-port=(port that's not 4789)
```

Afterwards all communication works again 🎉