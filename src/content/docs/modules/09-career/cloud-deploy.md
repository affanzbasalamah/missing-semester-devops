---
title: "Lesson 9.2 · One Real Cloud Deployment"
description: Deploy one thing on a free tier with Terraform — so 'the cloud' is something you've actually done, not just read about.
sidebar:
  label: "9.2 · Cloud Deploy"
---

Understanding the cloud/homelab mapping ([Lesson 9.1](/modules/09-career/cloud-mapping/)) is most
of the battle. But there's real value — for your confidence and your résumé — in having *actually*
deployed something on a public cloud. This lesson has you provision one real resource on a free
tier, using **Terraform** (Infrastructure as Code), then tear it down. The goal isn't to become a
cloud expert in an afternoon; it's to make "the cloud" a thing you've *done*, and to feel the
handful of ways it genuinely differs from your homelab.

## Terraform: IaC for the cloud

You already think in Infrastructure as Code — Ansible from
[Module 7](/modules/07-automation/ansible/) taught you to describe desired state declaratively and
let a tool converge to it. **Terraform** is the same idea, aimed at *cloud resources* instead of
server configuration: you declare "I want a VM, a network, a firewall rule" in code, and Terraform
creates them via the provider's API.

A minimal Terraform config reads much like the declarative style you know:

```hcl
# main.tf — declare a cloud resource; Terraform makes it real
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "demo" {
  ami           = "ami-xxxxxxxx"      # a base image (like your Debian ISO, M2)
  instance_type = "t2.micro"          # free-tier eligible size
  tags = {
    Name = "homelab-cloud-demo"
  }
}
```

The workflow — and notice how it echoes `ansible-playbook --check` from
[Lesson 7.2](/modules/07-automation/ansible/):

```sh
terraform init        # download the provider plugins
terraform plan        # DRY RUN — show exactly what it WOULD create/change/destroy
terraform apply       # actually create the resources
terraform destroy     # tear it all down (important — see below!)
```

`terraform plan` is your `--check`: it shows what will happen before anything happens. Run it every
time. `terraform destroy` cleanly removes everything Terraform created — which matters enormously
for the next point.

## Use a free tier, and destroy what you build

:::caution[The cloud bills you — this is the biggest difference from your homelab]
Your homelab's cost is fixed: you bought the hardware, electricity is pennies. The cloud is
**metered** — you pay per hour, per gigabyte, per request, and a resource left running quietly
accrues charges. The classic beginner mistake is spinning something up, forgetting it, and getting
a surprise bill. Two rules: **(1)** stay within a **free tier** (AWS, GCP, Oracle Cloud, and
Azure all have them; Oracle's is famously generous), and **(2)** **`terraform destroy`** when
you're done so nothing lingers. Set a billing alert too. Feeling this metered-cost reality — and
the discipline it demands — is itself part of the lesson.
:::

Pick one provider's free tier and deploy something small and real:

- A single **VM** (EC2 / Compute Engine / an Oracle free VM) — SSH into it with the keys from
  [Lesson 0.2](/modules/00-toolkit/remote/), and notice it's *just a Linux server*, the same one
  you hardened in [Module 2](/modules/02-server/), running on someone else's hardware.
- A **VPC with a subnet and a firewall rule** — and recognize it as the network segmentation from
  [Module 3](/modules/03-network/), declared in HCL.
- A small **static site on object storage** — the [Cloud Resume Challenge](https://cloudresumechallenge.dev/)
  is a well-known, structured version of exactly this, and a great complementary capstone.

## What you'll feel that's different

Deploying for real surfaces the genuine differences from homelab work — the things worth being
able to speak to:

- **It's metered.** (Above.) Cost-awareness is a real cloud skill; "I right-sized this and set a
  budget alert" is a sentence that impresses.
- **IAM everywhere.** The cloud's identity-and-access model (IAM) is pervasive and granular —
  every action is a permission. This is [Module 8](/modules/08-security/)'s least-privilege
  principle, enforced by the platform on everything. Over-permissive IAM is a top cause of cloud
  breaches, so getting it tight matters.
- **The API is the truth.** Everything is an API call; the console is just a UI over it. This is
  why IaC (Terraform) is the professional way to work — clicking in the console isn't reproducible
  or reviewable ([Lesson 7.3](/modules/07-automation/gitops/) GitOps thinking applies).
- **Someone else's hardware.** The shared responsibility model
  ([Lesson 9.1](/modules/09-career/cloud-mapping/)) is now concrete: you didn't rack the server,
  but you still own its OS, patching, and config.

## You don't need to go deep — you need to have done it

Be clear about the goal. You are *not* trying to become a cloud architect in this lesson, and you
don't need every service. You need to have genuinely deployed real infrastructure as code, torn it
down cleanly, and understood how it maps to what you already know. That experience — plus your
deep homelab foundation — lets you honestly say in an interview: "Yes, I've deployed infrastructure
on [provider] with Terraform," and then back it up with real understanding when they probe. Depth
comes on the job; this lesson gives you the credible starting point.

## Quick self-check

1. How is Terraform conceptually similar to the Ansible you already know? How does its target
   differ?
2. What does `terraform plan` do, and what earlier-module command is it analogous to?
3. What are the two rules for not getting a surprise cloud bill?
4. Why is `terraform destroy` important, and why prefer IaC over clicking in the console?
5. How does cloud IAM relate to the least-privilege principle from Module 8?
6. What's the realistic goal of this lesson — what should you be able to say afterward?

**Next:** [Lesson 9.3 · Threat-Model Your Lab →](/modules/09-career/threat-model/)
