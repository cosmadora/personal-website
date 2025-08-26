---
title: "Portfolio"
description: "Adoras Software Development portfolio"
params:
  JS: 
    LatestVersion: true
---

Here you can find a list of projects I worked on or am currently working on:

## certwarden-deploy

Language: `Go`  
Source: [code.lila.network/lila-network/certwarden-deploy](https://code.lila.network/lila-network/certwarden-deploy)  
Documentation: [certwarden-deploy.adora.codes](https://certwarden-deploy.adora.codes)  
Latest Version: {{< latest-forgejo-version "lila-network/certwarden-deploy" >}}  

Deployment tool for (Let's Encrypt) certificates managed by a CertWarden Instance (similar to certbot or acme.sh, just without the ACME stuff)

## Mailcow Alias Automation

Language: `Go`  
Source: [code.lila.network/lila-network/mailcow-admin-aliases](https://code.lila.network/lila-network/mailcow-admin-aliases)  
Latest Version: {{< latest-forgejo-version "lila-network/mailcow-admin-aliases" >}}  

Automates the creation of important admin mail aliases (think security@..., postmaster@...).

## ntppool-exporter

Language: `Go`  
Source: [code.lila.network/adoras-projects/ntppool-exporter](https://code.lila.network/adoras-projects/ntppool-exporter)  
Latest Version: {{< latest-forgejo-version "adoras-projects/ntppool-exporter" >}}  

A Prometheus exporter application that pulls data from the ntppool.org API for a given NTP server and serves it in a Prometheus compatible format.

## forgejo-release-proxy

Language: `Go`  
Source: [code.lila.network/adoras-projects/forgejo-release-proxy](https://code.lila.network/adoras-projects/forgejo-release-proxy)  
Latest Version: {{< latest-forgejo-version "adoras-projects/forgejo-release-proxy" >}}  

A tiny proxy that this portfolio page here queries to display the latest releases for my projects. It communicates with the API of my forgejo Git Instance.

## IPAM

Language: `Go`  
Source: [code.lila.network/adoras-projects/ipam](https://code.lila.network/adoras-projects/ipam)

A cli based IP Address Management tool written in Go with PowerDNS integration.

## go-urlsh

Language: `Go`  
Source: [code.lila.network/adoras-projects/go-urlsh](https://code.lila.network/adoras-projects/go-urlsh)

Go based URL shortener. Hosted via Docker and utilizing PostgreSQL.

## Humble-Bot

Language: `Go`
Source: [code.lila.network/adoras-projects/humble-bot](https://code.lila.network/adoras-projects/humble-bot)

A Go Fediverse Bot that posts new [Humble Bundles](https://humblebundle.com)

## Small side projects

### ovh-apikey-manager

Language: `Go`
Source: [code.lila.network/adoras-projects/ovh-apikey-manager](https://code.lila.network/adoras-projects/ovh-apikey-manager)

Tiny CLI tool to manage OVH API Keys

### dyndns-script

Language: `Python`
Source: [code.lila.network/adoras-projects/dyndns-script](https://code.lila.network/adoras-projects/dyndns-script)

Python based DynDNS client that can edit records managed by OVH and Azure

### Misceallenous

- Automated my home WIFI with radius assigned VLANs via Freeradius and custom frontend (Will be open sourced soon) (Language: `PHP`)
- Manage my own DNS via OctoDNS as Code
- Host my own mail since 2020
- Host my own Git and CI/CD tools
