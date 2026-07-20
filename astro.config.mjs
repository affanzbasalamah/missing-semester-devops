// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
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
						{ label: '3 · Build the Network', slug: 'modules/03-network' },
						{ label: '4 · Storage & Virtualization', slug: 'modules/04-storage' },
						{ label: '5 · Overlay Networks', slug: 'modules/05-overlay' },
						{ label: '6 · Self-Hosting', slug: 'modules/06-selfhosting' },
						{ label: '7 · Automation & CI/CD', slug: 'modules/07-automation' },
						{ label: '8 · Security Operations', slug: 'modules/08-security' },
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
