---
title: "Banking as a service for AI agents"
description: "AI agents are shifting from copilots to autonomous operators. The moment an agent can complete work end to end, it needs a way to pay for what it uses. This paper proposes a model for how that works."
date: "2026-04-14"
author: "Rabea Bader"
tags:
  - fintech
  - ai-agents
  - founder-journey
---

At [Quidkey](https://quidkey.com), we keep running into the same conversation. A company wants to deploy agents that can actually do work end to end, but the moment money is involved, everything stops. Either someone hands the agent a corporate card and hopes for the best, or every payment goes back to a human for approval. Neither works.

We've been thinking about this problem for a while, and I decided to write down how we think it should work. This is that paper.

## Executive Summary
AI agents are shifting from copilots to autonomous operators. The moment an agent can complete work end to end, it needs a way to pay for what it uses. APIs, cloud compute, data, tools, vendors. Today, companies face an impossible choice: hand agents access to corporate accounts or cards, which is an unacceptable risk, or require human approval for every payment, which defeats autonomy.
The missing piece is not another payment API. It is bounded, revocable, auditable financial authority for software. This paper proposes a model for how that works. Each agent gets its own isolated wallet. Think of it as a virtual bank account with its own account details and the ability to send and receive money. It gets its own policy boundary and a controlled way to transact. When cards are needed, agents can request on-demand single-use virtual cards that are created for a specific payment and still pass through policy. The goal is not to give agents open-ended access to company funds. It is to give them just enough financial authority to be useful, with enough control to be safe.
## Why now
This is no longer theoretical.
Until recently, most AI systems were still assistants. They could suggest, summarize, draft, help humans move faster, but they were not actually operating on their own. That is changing fast.
Many of us are using agents that persist across sessions, use tools, take actions, coordinate with systems, and complete real parts of workflows without constant human involvement. Projects like [OpenClaw](https://openclaw.ai/) are a good example of how quickly agents are moving from assistants to systems that can take actions across real tools and workflows, from inbox and calendar management to travel and code deployment. Communities like [Moltbook](https://www.moltbook.com/), a social network built for AI agents, are growing where agents interact autonomously with each other and with services.
Once software can actually do the work, money becomes part of the workflow almost immediately. A developer agent needs to pay for compute or API access. A research agent needs to buy data. An operations agent needs to settle a vendor payment. A personal assistant needs to book travel or manage subscriptions.
Juniper Research recently [projected that agentic commerce spend could reach $1.5T globally by 2030](https://www.juniperresearch.com/press/agentic-commerce-set-to-generate-15-trillion-globally-by-2030-as-payments-infrastructure-leaders-revealed/), growing from early pilot deployments in 2025 and 2026. Agents are already being handed credit cards by their owners. Many users are opening crypto wallets for their agents. Coinbase has already moved in this direction with Agentic Wallets with interesting agent tooling like AgentKit, which is one clear signal that this gap is becoming commercially important. But the problem remains that not many businesses support crypto payments and not as many average users own crypto.
The autonomy is here. The financial infrastructure is not.
## The Problem
Agents can plan and execute work. They cannot safely spend and receive money. That makes payment execution the last hurdle to true agentic commerce.
Companies want agents to ship software, run research, buy tools, pay vendors. But every existing approach to giving agents spending power is broken.
That sounds like a narrow missing piece. It is not. It is one of the last major blockers between useful automation and true autonomous execution.
If a company wants an agent to buy software, pay for a tool, top up infrastructure, or settle a small vendor payment, it quickly runs into an uncomfortable choice. Give the agent access to existing company payment methods, which creates obvious risk, or slow everything down by routing every payment back to a human. One option is unsafe. The other defeats the point.
The result is that many agents today can do almost everything except finish the loop.
### Why current approaches fail
Most of the current ways people try to solve this were designed for humans first and only then stretched toward software.
Giving an agent access to a company card or shared banking credentials is the fastest shortcut and the worst long-term answer. There is no per-agent isolation, no clean way to limit damage if the agent is compromised, and no good operational model for revocation or attribution. If something goes wrong, the blast radius is too large.
Expense management tools do not solve the core problem either. They are useful for human workflows where the goal is to review and reconcile spend after the fact. Agents need the opposite. They need controls before execution, not finance cleanup once money has already moved.
Keeping a human in the loop for every payment is safer, but it turns agents into suggestion engines. The whole point of autonomous systems is that they should be able to complete bounded work on their own. If every payment still requires a person, the autonomy breaks exactly where it matters most.
General payment APIs help with execution, but they do not solve the control problem. They provide payment plumbing, not a system of record for agent identity, wallet isolation, policy enforcement, governance, or fleet-scale management. Every customer is left to build the hard parts themselves.
Crypto wallets solve part of the problem for some users and some use cases. But most merchants still expect bank transfers, cards, invoices, and established payment rails. Most companies want clear controls, audit trails, and workflows that fit into existing finance and compliance operations. The problem is not simply whether an agent can hold money. It is whether an agent can safely spend money in the real economy, using the rails businesses actually use.
The common thread: these systems were built for humans. They assume a person is in the loop, making judgment calls. Autonomous software needs a different primitive.
## What a real solution needs
A workable solution for autonomous agent spend must satisfy six requirements simultaneously. No subset is enough. All of them have to work together.
Isolation. Each agent should have its own wallet, balance, ledger, credentials, and policy boundary. If one agent is compromised or behaves unexpectedly, the damage stops there. Funds are segregated from operating accounts and from other agents. One compromised agent cannot affect another.
Programmable policy. The rules cannot live in prompts or loose internal guidance. They need to be enforced by infrastructure, in real time, before money moves. That includes budgets, transaction limits, velocity limits, merchant restrictions, approval thresholds, and other controls that define what an agent is actually allowed to do.
Auditability. Every payment should be attributable to a specific agent acting on behalf of a specific principal, in a clear business context. Finance, security, and compliance teams should be able to understand exactly what happened and why.
Revocability. A company should be able to freeze a wallet, revoke access, rotate credentials, or disable a payment method immediately. No waiting for a cycle to close.
Visibility. Teams should not have to guess what their agents are doing financially. They need live balances, attempted spend, approved spend, denied requests, alerts, exports, and integrations.
Fleet scale. This cannot be a system that only works for one carefully supervised demo agent. It has to work for dozens, hundreds, or thousands of agents operating under different policies and different business contexts.
## System Design
The core model is simple. Software that spends money needs a boundary around that authority. The way we implement that boundary is through isolation.
A company funds and governs agent activity. Each agent gets its own isolated wallet. That wallet has its own balance, ledger, credentials, and policy. When the agent wants to make a payment, the request goes through a policy engine before anything is executed.
The wallet is not just a funding container. It is the primitive that makes bounded financial authority real. It is how you isolate risk, define authority, track behavior, and reason about what a specific agent is allowed to do.
In this model, there are a few core entities. The principal is the company or legal entity that owns the funds and defines the rules. The agent is software acting on behalf of that principal, identified by scoped credentials tied to a single wallet. The agent wallet is an isolated financial account provisioned for a single agent or runtime, with its own balance, ledger, policy, and audit log. It supports USD, EUR, GBP, AUD, SGD and more currencies. The policy defines the operating envelope: budgets, limits, allowed merchants, approval thresholds. And the execution method is the rail used to complete the transaction, whether that is a bank transfer, an internal ledger movement, or a card-based payment when required.
A typical flow looks like this. A principal creates an agent wallet through an API or dashboard. A policy is attached to that wallet and scoped credentials are issued. The agent receives a task that requires payment. It submits a request. The policy engine evaluates that request in real time by checking the relevant limits, restrictions, and approval rules. If the request is allowed, the payment executes. If it is denied, it is rejected or routed for approval. Every step is logged.
Agents can also query their remaining budget and policy limits before attempting a payment. This lets them plan more intelligently and reduces wasted requests.
### How it looks in practice
Agent makes a payment:
```javascript
POST /v1/payments
{ "to": "api_merchant_123", "amount": 15.00, "currency": "USD", "memo": "API access for market research" }

200: { "payment_id": "pay_xxx", "status": "completed", "balance_after": 132.50 }
```
Payment denied by policy:
```javascript
POST /v1/payments
{ "to": "api_merchant_456", "amount": 75.00, "currency": "USD" }

403: { "error": "exceeds_limit", "limit_type": "per_transaction", "max": 50, "requested": 75 }
```
Clear, structured errors let agents understand exactly why a payment failed and adjust their behavior or inform the user.
### On-demand cards
Many merchants and services still require cards. That does not mean agents should get reusable corporate cards sitting in their environment with broad spending power. That would recreate the same problem in a more dangerous form.
A better model is to let agents request a card only when needed, for a specific transaction, under policy.
In practice, the agent asks the system for a card to complete a specific purchase. That request still goes through the same policy engine. If approved, the system generates an on-demand single-use virtual card tied to the wallet and restricted to a specific amount, a defined merchant or merchant category where possible, a short time window, and a single use. Once the transaction completes or expires, the card is no longer valid.
This gives agents access to existing card rails without giving them open-ended card access. The goal is not to turn agents into cardholders. The goal is to give them a safe way to complete transactions in environments that still depend on cards.
## Policy Engine
The policy engine is the core control surface. Every payment request passes through it before any money moves. Without policy, an agent wallet is just another funding mechanism. With policy, it becomes bounded financial authority.
The policies themselves can be straightforward or highly specific depending on the use case. A company may want to define a maximum per-transaction amount, a daily or monthly budget, a list of allowed merchants, a set of blocked categories, approval thresholds for larger transactions, time-based restrictions, or rules for first-time payees.
The exact policy language matters less than the enforcement model. What matters is that these controls are evaluated outside the agent, on trusted infrastructure, in real time.

> **Server-side only.** Policy evaluation happens entirely on [Quidkey](https://quidkey.com)'s infrastructure. The agent cannot override, bypass, or modify its own policy. This is critical for prompt injection resistance. Even if an agent is manipulated into attempting a bad transaction, the financial controls hold. The controls live outside the model. That is the point.

## Use Cases
The most useful thing about this model is that it maps naturally to the kinds of work agents are already starting to do.
A developer agent may need to buy cloud credits, pay for API access, subscribe to a debugging tool, or provision infrastructure to complete a task. The policy might allow specific providers, cap monthly spend, and restrict any one transaction above a certain threshold.
A research agent may need to pay for premium datasets, subscriptions, API calls, or specialist information services. The company may want to limit that spend to approved sources and a clear monthly budget.
A sales or marketing agent may need to enrich leads, pay for outreach tools, or run tightly bounded campaigns. Velocity controls and per-lead cost controls become more relevant here.
An operations agent may need to pay software subscriptions, logistics services, or low-value vendor invoices. That kind of spend may be auto-approved under a certain amount and escalated above it.
A personal assistant agent may need to book travel, manage subscriptions, or make routine purchases. The policy may include stronger content or merchant restrictions and tighter limits.
The point is not that every agent becomes a buyer. The point is that once an agent can complete meaningful work, the ability to transact becomes part of the workflow much more often than people expect.
## Verification Layer
There is another important part to this system beyond moving money: trust.
When an agent initiates a transaction, the counterparty often has no idea what it is dealing with. Is the agent real. Is it acting on behalf of a legitimate business. Is it funded. Is it allowed to make this type of payment. That lack of trust becomes a major blocker as agent-based commerce grows.
A counterparty should be able to query whether an agent is active, whether it is backed by a verified principal, whether the wallet is funded, and whether the attempted transaction falls within the scope of its authorization. [Quidkey](https://quidkey.com) provides a verification endpoint for exactly this:
```javascript
GET /v1/agents/{id}/verify

200: {
  "agent_id": "agt_xxx",
  "status": "active",
  "principal": { "name": "Marko Corp", "verified": true },
  "funded": true,
  "authorized_categories": ["cloud", "data", "saas"]
}
```
This does not mean exposing unnecessary internal details. It means giving the receiving side enough confidence to accept the transaction without building its own fragmented trust layer from scratch.
This becomes even more important as we move beyond simple agent-to-merchant payments. Over time, agents will increasingly interact with services and with other agents acting on behalf of businesses or users. In that world, trust and authorization become part of the payment infrastructure itself.
That is why the verification layer matters strategically. It is not just a safety feature. It creates a path for Quidkey to become part of the trust and settlement layer for agent commerce, analogous to what card networks provide for human commerce, but designed for programmatic actors.
## Security and Risk Model
A system like this only works if the risk model is taken seriously from the start.
The first principle is blast radius reduction. If credentials are stolen or an agent behaves unexpectedly, the damage should be limited to one wallet under one policy. That is why per-agent isolation matters so much.
The second principle is hard boundaries. Budget caps, velocity limits, merchant restrictions, circuit breakers, approval rules, and wallet-level controls should define the real operating envelope. Not guidelines. Not prompts. Enforced limits.
The third principle is external enforcement. The policy engine sits outside the agent. The model cannot modify its own authority or widen its own permissions.
The fourth principle is attribution. Every transaction records which agent initiated it, on behalf of which principal, in what context, under what policy, and with what result. That matters for finance review, compliance review, security investigation, and general operational trust.
The fifth principle is immediate revocation. If something looks wrong, the company can stop activity instantly. Freeze a wallet, revoke credentials, disable a payment method. No waiting.
This is what makes the system feel enterprise-grade. Not just the ability to pay, but the ability to pay safely, explainably, and reversibly.
## Competitive Landscape
It is easy to imagine existing players saying they can add agent features. Some will. But most of them start from assumptions that were built around human actors.
Corporate spend platforms are designed around employees, departments, reimbursement flows, and post-purchase controls. They are useful in that context, but they do not naturally provide per-agent identity, wallet isolation, or programmable server-side policy designed for autonomous software.
Payment APIs solve execution, but not control. They make it possible to move money, but they do not give customers a complete framework for agent governance, fleet-scale wallet management, verification, or a trust layer for software actors.
Crypto-first solutions may solve self-custody and programmable money for a subset of users, but they still do not cover the broader reality of mainstream business payments where bank transfers, cards, and traditional financial workflows still dominate.
The gap is not just payments. It is the combination of isolation, policy, verification, auditability, and execution in one coherent system, built for agents rather than adapted from human workflows. That combination is what no incumbent provides today, and it is hard to bolt on after the fact because the architecture has to start from a different set of assumptions.
## Regulatory Considerations
Agents are not independent legal persons. They are software acting on behalf of a principal. The legal and compliance obligations still sit with the business or user behind the agent and with the regulated entities involved in moving funds.
In practice, that means the principal needs to be verified at onboarding, the movement of funds needs to happen within the applicable regulatory framework for the relevant jurisdictions and rails, and the same expectations around monitoring, record keeping, suspicious activity detection, and auditability still apply. Where cards are issued, card data handling and issuance flows follow the relevant standards and partner requirements. Where funds are held or moved, the relevant licensing model and compliance structure need to be clear.
The important point is that this model does not avoid regulation. It works within it by making identity, attribution, isolation, and auditability first-class properties of the system.
That is part of why the architecture matters.
## Go to Market
The initial buyers for this kind of system are likely to be teams already deploying agents in practical workflows where money is one of the remaining blockers. Engineering teams are an obvious example, especially where agents need to buy compute, tools, or APIs. Research teams are another. Operations and go-to-market teams may follow where agents start paying for services, tools, or bounded external actions.
The best way to enter this market is not to start with a broad autonomy story. It is to land with one agent, one clear use case, and one tightly controlled policy. Prove that the system is safe, understandable, and operationally manageable. Then expand to more agents, more workflows, and eventually fleets.
That expansion works because the wallet is the scaling unit. Each new agent gets its own boundary, its own policy, and its own controls. That makes growth much more predictable than trying to manage all agent spend through shared payment methods.
Commercially, the model supports a platform fee, wallet-level pricing for active agent wallets, and transaction-based pricing. But the more important point is that the value is not just in payment execution. It is in enabling autonomous workflows that would otherwise remain blocked.
## Long-term position
The deeper opportunity here is not only moving money for agents. It is becoming part of the trust and settlement layer that agent-based commerce will need.
As more companies provision wallets for agents, and as more merchants and services accept transactions from verified software actors, verification and authorization become network-level capabilities. The more counterparties can trust that an agent is real, funded, and acting within bounded authority, the easier agent commerce becomes.
In the long run, the market will need infrastructure that lets businesses safely provision financial authority to software, control it in real time, and make it understandable to counterparties. That is a foundational layer for what the agent economy is becoming.
## Conclusion
Agents are starting to do real work. Once they do, they need a way to transact.
Today, companies face an impossible choice. They either expose existing payment methods to autonomous software, which creates obvious risk, or they slow everything down by requiring a human to approve each payment, which defeats autonomy.
The real question is not how to give agents a credit card. It is how to give software bounded, revocable, auditable financial authority. That means isolated wallets, real-time policy enforcement, clear attribution, and controlled execution methods that fit the real payment world. When cards are required, that means tightly scoped, on-demand, single-use virtual cards rather than reusable corporate credentials.
The agent economy will not run on prompts alone. It will need trusted financial infrastructure.
[Quidkey](https://quidkey.com) is building it.

[rabea@quidkey.com](mailto:rabea@quidkey.com)
