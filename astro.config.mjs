// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		// Mermaid must come before Starlight so it can transform ```mermaid
		// code blocks before Expressive Code turns them into styled code blocks.
		mermaid({
			// Follow the site's light/dark theme automatically.
			theme: 'default',
			autoTheme: true,
		}),
		starlight({
			title: 'Missing Semester: DevOps & Security',
			description:
				'The hands-on infrastructure foundation CS school never taught you — build real servers, real networks, secure them, and prove it publicly.',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/affanzbasalamah/missing-semester-devops',
				},
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'How to Use This Site', slug: 'guides/how-to-use' },
						{ label: 'Hardware Shopping Guide', slug: 'guides/hardware' },
						{ label: 'Diagrams as Text', slug: 'guides/diagrams' },
					],
				},
				{
					label: 'Curriculum',
					items: [
						{
						label: '0 · The Toolkit',
						items: [
							{ label: 'Overview', slug: 'modules/00-toolkit' },
							{ label: '0.1 · The Shell', slug: 'modules/00-toolkit/shell' },
							{ label: '0.2 · Remote Work', slug: 'modules/00-toolkit/remote' },
							{ label: '0.3 · Editing Anywhere', slug: 'modules/00-toolkit/editing' },
							{ label: '0.4 · Git', slug: 'modules/00-toolkit/git' },
							{ label: '0.5 · Writing', slug: 'modules/00-toolkit/writing' },
							{ label: 'Labs', slug: 'modules/00-toolkit/labs' },
						],
					},
						{
						label: '1 · How It Works',
						items: [
							{ label: 'Overview', slug: 'modules/01-fundamentals' },
							{ label: '1.1 · The Machine', slug: 'modules/01-fundamentals/machine' },
							{ label: '1.2 · TCP/IP', slug: 'modules/01-fundamentals/tcpip' },
							{ label: '1.3 · DNS', slug: 'modules/01-fundamentals/dns' },
							{ label: '1.4 · HTTP & TLS', slug: 'modules/01-fundamentals/http-tls' },
							{ label: '1.5 · Packet Capture', slug: 'modules/01-fundamentals/capture' },
							{ label: 'Labs', slug: 'modules/01-fundamentals/labs' },
						],
					},
						{
						label: '2 · Build the Server',
						items: [
							{ label: 'Overview', slug: 'modules/02-server' },
							{ label: '2.1 · Bare Metal', slug: 'modules/02-server/bare-metal' },
							{ label: '2.2 · Anatomy', slug: 'modules/02-server/anatomy' },
							{ label: '2.3 · Hardening', slug: 'modules/02-server/hardening' },
							{ label: '2.4 · Operating', slug: 'modules/02-server/operating' },
							{ label: 'Labs', slug: 'modules/02-server/labs' },
						],
					},
						{
						label: '3 · Build the Network',
						items: [
							{ label: 'Overview', slug: 'modules/03-network' },
							{ label: '3.1 · OpenWrt', slug: 'modules/03-network/openwrt' },
							{ label: '3.2 · Core Services', slug: 'modules/03-network/services' },
							{ label: '3.3 · Segmentation', slug: 'modules/03-network/segmentation' },
							{ label: '3.4 · Watching', slug: 'modules/03-network/watching' },
							{ label: 'Labs', slug: 'modules/03-network/labs' },
						],
					},
						{
						label: '4 · Storage & Virtualization',
						items: [
							{ label: 'Overview', slug: 'modules/04-storage' },
							{ label: '4.1 · Disks & Filesystems', slug: 'modules/04-storage/disks' },
							{ label: '4.2 · Redundancy', slug: 'modules/04-storage/redundancy' },
							{ label: '4.3 · Backups', slug: 'modules/04-storage/backups' },
							{ label: '4.4 · Virtualization', slug: 'modules/04-storage/virtualization' },
							{ label: 'Labs', slug: 'modules/04-storage/labs' },
						],
					},
						{
						label: '5 · Overlay Networks',
						items: [
							{ label: 'Overview', slug: 'modules/05-overlay' },
							{ label: '5.1 · WireGuard', slug: 'modules/05-overlay/wireguard' },
							{ label: '5.2 · Tailscale', slug: 'modules/05-overlay/tailscale' },
							{ label: '5.3 · Cloudflare Tunnel', slug: 'modules/05-overlay/cloudflare' },
							{ label: '5.4 · Choosing', slug: 'modules/05-overlay/choosing' },
							{ label: 'Labs', slug: 'modules/05-overlay/labs' },
						],
					},
						{
						label: '6 · Self-Hosting',
						items: [
							{ label: 'Overview', slug: 'modules/06-selfhosting' },
							{ label: '6.1 · Docker & Compose', slug: 'modules/06-selfhosting/docker' },
							{ label: '6.2 · Reverse Proxy', slug: 'modules/06-selfhosting/reverse-proxy' },
							{ label: '6.3 · TLS Certificates', slug: 'modules/06-selfhosting/tls' },
							{ label: '6.4 · The Services', slug: 'modules/06-selfhosting/services' },
							{ label: 'Labs', slug: 'modules/06-selfhosting/labs' },
						],
					},
						{
						label: '7 · Automation & CI/CD',
						items: [
							{ label: 'Overview', slug: 'modules/07-automation' },
							{ label: '7.1 · Scripting', slug: 'modules/07-automation/scripting' },
							{ label: '7.2 · Ansible', slug: 'modules/07-automation/ansible' },
							{ label: '7.3 · GitOps & Secrets', slug: 'modules/07-automation/gitops' },
							{ label: '7.4 · CI/CD', slug: 'modules/07-automation/cicd' },
							{ label: 'Labs', slug: 'modules/07-automation/labs' },
						],
					},
						{
						label: '8 · Security Operations',
						items: [
							{ label: 'Overview', slug: 'modules/08-security' },
							{ label: '8.0 · Rules of Engagement', slug: 'modules/08-security/ethics' },
							{ label: '8.1 · Assess', slug: 'modules/08-security/assess' },
							{ label: '8.2 · Identity & Secrets', slug: 'modules/08-security/identity' },
							{ label: '8.3 · Monitor & Detect', slug: 'modules/08-security/monitoring' },
							{ label: '8.4 · Purple Team & IR', slug: 'modules/08-security/purple-team' },
							{ label: 'Labs', slug: 'modules/08-security/labs' },
						],
					},
						{ label: '9 · The Bridge', slug: 'modules/09-career' },
					],
				},
				{
					label: 'Community',
					items: [{ label: 'Showcase', slug: 'guides/showcase' }],
				},
			],
		}),
	],
});
