---
title: "Erisi: A self-hosted static site server"
---

## Summary
`erisi` is planned to be a self-hosted alternative to Netlify/Vercel/Github Pages/etc... written in Go and utilizing [Caddy](https://caddyserver.com) and it's ACME capabilities.

## Implementation Ideas
The main service will consist of a Caddy instance (maybe later replaced with own application loogic for subdomain handling, TLS termination and ACME) that serves as a HTTPS entry point and host for static website data.  
The `erisi` server will serve a registration/configuration page, where you can add new websites (like with netlify) and see what you need to do (in terms of CNAMEs and CAA-Records) to enable custom domains. It will then create directories per user and within per repository/website (think `/base-dir/user-guid/project-guid` as the path) and communicate (custom) domain to caddy.  

There should also be a `erisi` cli application for deploying websites to the server. Maybe it should compress a given folder, hash it and send it to the server, handling authentication in the progress.

Maybe later something like netlify's `netlify.toml` can be implemented to handle custom headers and redirects/rewrites :3

The whole server stack shall be available via Docker Compose at least

## Feedback
Any ideas can be directed to dev@lauka.net =)
