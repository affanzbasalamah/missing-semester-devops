# The Missing Semester of DevOps & Security

A hands-on, hardware-first curriculum that teaches fresh graduates the infrastructure
foundation CS school leaves out — how computers, networks, and production systems actually
work — and turns it into a public portfolio for a career in DevOps and cybersecurity.

Inspired by [MIT's Missing Semester](https://missing.csail.mit.edu/), with a twist:
**everything is built on real, cheap, used hardware you own**, and your self-hosted
documentation site is both the deliverable and the proof.

## The curriculum

| # | Module | Deliverable |
|---|---|---|
| 0 | The Toolkit (terminal, git, writing) | Public git repo + first blog post |
| 1 | How It Actually Works (computers, TCP/IP, DNS, TLS) | Annotated packet-capture walkthrough |
| 2 | Build the Server (used micro PC → hardened Linux) | Build log + hardening checklist |
| 3 | Build the Network (OpenWrt, VLANs, DNS, DHCP) | Network diagram + config repo |
| 4 | Storage, Backups & Virtualization | Verified restore demo |
| 5 | Overlay Networks (WireGuard, Tailscale, CF Tunnel) | Remote-access design doc |
| 6 | Self-Hosting (reverse proxy, TLS, blog + git server) | Live self-hosted portfolio |
| 7 | Automation & CI/CD (Ansible, pipelines) | Ansible repo that rebuilds the lab |
| 8 | Security Operations (scan, harden, monitor, detect) | Purple-team report + post-mortem |
| 9 | The Bridge to a Career (cloud mapping, portfolio) | "Hire me" portfolio page |

## Tech

Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in ./dist
npm run preview  # preview the production build
```

Content lives in `src/content/docs/` (`modules/` and `guides/`). Navigation is configured in
`astro.config.mjs`.

## Contributing

Corrections, better explanations, and new resource links are welcome via pull request —
contributing here is itself good practice for the curriculum's showcase submission.

## License

Content: CC BY 4.0 (suggested). Code: MIT (suggested). Adjust to your preference before publishing.
