---
title: "How we built the Quidkey Console in a few days, and why we had to"
description: "The story behind building the Quidkey Console: why we needed a new operational layer on top of Quidkey Core, how we built it fast with AI and TanStack Start, and what it meant for the team."
date: "2026-03-26"
author: "Rabea Bader"
tags:
  - engineering
  - founder-journey
  - product-delivery
---

This week we launched the Quidkey Console.

<iframe width="560" height="315" src="https://www.youtube.com/embed/FWk7ICKpprM?si=zUtjkELFqblvVjwZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<br>

When we started building Quidkey, we always had three things in mind, other than building the Core itself, the system that handles the payment logic, integrations, data layer, and acts as the source of truth:

- A back office, so admins could view and manage customers, transactions, and support.
- A Merchant Portal, so businesses could manage and track their transactions, statuses, and fees.
- A Partner Portal, because from day one we knew Quidkey would grow through partners like PSPs, banks, and fintechs.

Early on, we decided to delay building an interface for the back office and the Partner Portal. And if you are asking, "Why didn't you just use Retool?", my answer is still "LOLLL".

Instead, we built the Core in a way that could support both later on. That decision shaped a lot of how we built the product from the beginning. The partner first approach became part of the backbone of the architecture.

But big decisions come with big pain.

Our back office became Swagger, sometimes Postman, and a Slack webhook that announces every new transaction, which was and still is a lot of fun for the team. It worked, but it came with auth pain, too many manual steps, and way too much friction.

It worked. But it sucked.

The Merchant Portal, on the other hand, was never optional. We needed it, and we needed it fast. So we built it properly, with its own backend and frontend. The backend was built with Express, the frontend with React, and it lived separately from Quidkey Core.

We did that on purpose.

The partner first approach meant we wanted to emulate how external parties would interact with Quidkey Core. What better way to do that than by being a partner to ourselves. The Core would stay focused on payments logic and infrastructure, while the Merchant Portal would sit on top of it more like a third party would, similar to how a PSP, bank, or fintech partner would interact with the system.

That decision served us really well.

It helped us build the Core with a strong partner first mindset. It forced separation. It forced clearer boundaries. And honestly, I do not regret it at all.

But then the company grew, and so did the friction.

Improving the Merchant Portal started taking too much time. It had its own backend and frontend, which meant more moving parts, more coordination, more fixes across services, and always deploying twice just to get one thing done.

And the bigger issue was internal.

Because the systems were decoupled by design, every time we wanted to interact directly with the Core, we ended up doing it through APIs in Swagger. That was okay for a while. But over time it became painful. Really painful. Following actions, debugging flows, handling auth, tracing data, all of it became slower and more annoying than it should have been.

At some point it became very clear that we did not need just another internal tool. We needed a new layer that could sit on top of the Core and become the foundation for how Quidkey would be operated going forward.

The idea was not just to solve the admin pain, although that was the most urgent problem. The bigger goal was to build this in a way that could eventually support all three sides we always knew we needed: the back office, the Merchant Portal, and the Partner Portal.

But we also knew we had to start somewhere. So we decided the MVP would be internal first. The first version of the Console would focus on the back office, help us manage merchants and payments properly, remove a lot of the manual pain, and require as few Core changes as possible.

So that is how the Quidkey Console started. Not as a separate product for the sake of it, but as a practical first step toward a layer we knew the company would eventually need.

Six months earlier, this would have been much harder. But by then, our way of building had changed a lot.

To build it, we put the Core service, the old Merchant Portal service, and the new empty Console folder into one workspace in Cursor. I mostly use Claude today, but back then this was very much built with Cursor. I gave it all the context I could, and dumped my thoughts on usability, architecture, and future use cases in way too much detail, basically like I was explaining it to a 5 year old. Then I started a long back and forth with both Claude and ChatGPT about how it would best be implemented. In my opinion, they can still suck when it comes to architecture, but having the full codebase accessible in context made a huge difference.

Because everything was in one workspace, it became much easier to reason about where logic should live, what should stay in the Core, what had to move, and how the new Console should interact with everything without becoming another heavy product.

That part alone would have been much harder the old way.

After we agreed on the plan, Cursor gave me a timeline of two months to finish the project, and I was like, LOL we are finishing this tonight. It ended up being a few days until it was stable though.

We also made a bet on TanStack Start. Most of its tools were still in alpha or beta, but in my opinion it was still better than what was already out there, and the founder was shipping fast. And that turned out to be a good bet. The Console still has a BFF, but it is intentionally thin and mostly acts as a proxy to the Core. The logic should live in the Core, not in the frontend.

That decision came with pain too.

A lot of things that had lived in the old Merchant Portal, especially around user management and some business logic, had to be moved into the Core where they actually belonged. But once the architecture direction was clear, that work became much easier to do properly.

Having the full codebase in context, good team guidance, clear rules, [Claude.md](http://claude.md/), Cursor rules, and tools like shadcn and TanStack Router made it possible to move incredibly fast.

The first MVP was usable within hours.

It was simple, clean, and required very few Core changes.

And almost immediately after we shared it with the team, it started getting adopted.

Non technical teammates and admins could suddenly view and manage merchants and payments without relying on engineers for every action. The technical team could move faster too, because they were no longer constantly pulled into manual support and business operations tasks.

Very quickly, the Console became part of daily work.

Then it became more than that.

Requests for new features started coming in fast. Usage increased. The Console stopped being just an internal MVP and started becoming our back office for operations, support, merchant management, and internal workflows.

It became clear that this was not just a nice internal tool.

It was an operational layer we genuinely needed.

The whole thing ended up costing around $1,540 in tokens, plus my time.

Honestly, I think it was one of the best investments we made. Not because we got a nice new UI in a few days, but because we removed friction from the core of how the company operates.

And once we built it, it became hard to imagine operating without it.
