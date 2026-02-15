---
title: "From weeks to days: how we reduced feature delivery time at Quidkey"
description: "How we cut feature delivery time from weeks to days by changing our workflow: proposals-first, clear ownership, strong testing/tooling, and AI-assisted planning, execution, and reviews."
date: "2026-02-15"
author: "Rabea Bader"
tags:
  - engineering
  - product-delivery
  - founder-journey
---

Six months ago, shipping a significant feature at Quidkey took several weeks from planning to production. Today, most features and integrations take just a few days. And in many cases, less.

It’s not because we hired more engineers, our team size stayed the same. It’s because we fundamentally changed how we build.

This blog explains what changed and how we build at Quidkey today.

I’m Rabea Bader, co-founder and CTO at Quidkey. We are building a programmable infrastructure that helps businesses and fintechs handle money end to end, from a Pay by Bank checkout to automating workflows like tax, payouts, and cross-border through a single integration. I’m a software, payments, and taxes nerd, and I’ll be sharing our journey here.

I’d love to hear feedback from other teams and learn how they’re building. This is my flow, and while each developer works a bit differently, we follow the same principles.

It always starts with business and product. We define priorities based on customer demand, vision, and direct conversations with partners. We try to build the minimum required to achieve maximum impact.

Every week, the team discusses the goals and priorities on the company call. We set this week's goals, review last week's. What did we hit? what did we miss? And why? We try to keep goals simple and doable, usually around four goals a week.

Then we dig deeper on tech calls, where we talk about how we’ll actually build it. That combination gives developers almost all the context they need to understand what we’re building and why, and gives them the opportunity to challenge decisions and share own views.

Our team structure also matters a lot. We are all experienced. Everyone can contribute to all services and products, but each person still has ownership of a specific service. Ownership does not mean a silo. It means you can move faster. There is always someone who understands a service deeply, can make decisions quickly, and is responsible for its long term health. This removes ambiguity and avoids situations where everyone waits for someone else to decide

At the same time, ownership does not create bottlenecks. Anyone can contribute to any service, and anyone can review anyone’s code. The owner is not a gatekeeper. They are the person responsible for clarity, direction, and quality. While building a feature, the developer completes it across all services, but knows exactly who to involve when deeper expertise is needed.

Now comes the biggest rule in our system for big features. **No code before a proposal.**

Before someone starts working on anything significant, they write a proposal. And it’s not just developers working on features who do this -  we have proposals for DevOps, Security, Observability and more. Basically anything that changes how we build, ship, or operate the product gets a proposal.

**What is a proposal?**

The proposal concept was introduced to me by Steven (who borrowed it from Monzo). As a team we improved it, adapted it, and turned it into something that works for us. It’s a document with examples to guide thinking for building something new, but it is not a form that must be filled. The goal is not documentation, a perfect spec or a process for the sake of a process. The goal is shared understanding.

It’s meant to make sure we all understand the same problem, the same goal, and the same plan before any code is written. We include a clear overview of what we are building, why we are building it, how we define and measure success, what is in scope and out of scope, and a functional overview that explains the feature from a user or business perspective. See our Notion template and feel free to add your suggestions

Developers decide how much to write based on the complexity of the change. Sometimes it is a few sentences. Sometimes it is much more.  Everyone must understand what we are building, why we are building it, and how we will build it.

For significant changes, a proposal is required before writing a single line of code. For smaller changes, developers use their judgment. If someone does not fully understand what and why they are building, they do not start. This prevents us from building the wrong thing quickly and ensures full ownership of both the problem and the solution.

We continuously improve the template as we learn what improves clarity and execution.

AI is deeply integrated into this part. Each of us uses different tools and preferences. I work with Cursor, Steven works with Claude Code, Zak works with IntelliJ. The important part is not the tool. It’s how we use it.

**My flow usually looks like this:**

I write the first draft of the proposal myself, based on customer conversations, internal discussions and whatever context I have. Then I use Cursor to improve it. I connected Cursor via MCP to Notion, Linear, Figma and other tools (I used to make fun of MCPs, but now I don’t seem to get enough of them), and it has access to our codebase. So I point Cursor to my proposal draft, previous proposals, internal and third party documentation, related Linear projects or issues, and relevant code, and I iterate in a loop. Review, give feedback, improve. Over and over until I'm happy with it.

Then I move the proposal status to “Reviewable” and share it on our #tech channel on Slack. Our tech channel is company wide. Everyone can see it. For important proposals we also share it on #general and specifically call it out.

Once it’s shared, everyone can review it, comment, challenge it, and get aligned. We debate in the comments, gather enough data and suggestions, and the owner updates the proposal based on the discussions. Then, when it’s in a good state, the owner may choose to initiate a call to finalise it. Anyone can join. Most of our meetings are voluntary, so people join when they feel they can contribute.

In that call we discuss the proposal and how to build it. Kate, our UX and UI expert, joins to expand on the frontend parts and get full context so she can start building designs. In many cases, she starts designs as soon as the proposal becomes reviewable, and then we discuss the designs and the proposal together in the call. By the end, we are aligned on how the feature or product will actually be built.

After alignment, we go from text to execution.

This is the part where AI gets really fun (at least for me)

Once we have the information we need, we break down the proposal into real implementation tasks in our project tracking system, Linear. Personally, I use Cursor for this too. I mention the proposal, relevant services, designs, and context, and I ask Cursor to create a new project in Linear and break the proposal down into comprehensive issues, ordered by implementation phases.

I usually use GPT 5.2 for the initial breakdown because it handles large context and structured planning extremely well. Once the issues are created, I switch the provider (in the same Cursor chat) to Claude Opus 4.6 and ask it to “check if GPT missed anything” and to make the breakdown “coding ready”.

Almost always Claude makes a joke about GPT, then it digs deeper and fills missing pieces in my phases and issues. I review the issues, make sure they match the proposal, and share the project in the #tech channel.

At that point, because we already aligned on the proposal, the Linear project is mostly implementation details. And then I just start building.

I usually tackle one issue at a time unless a few are tightly connected. I just tried doing a full project with 10 issues with Opus 4.6. That was amazing, disturbing, and crazy, and it mostly worked. I’ll write about that in a future post.

After each task is completed, I review the code, update it if needed, and make sure it follows our patterns. I have Cursor Rules, which define how the AI should write code and follow our coding standards, and Claude.md, which defines how the AI should understand our system architecture and make decisions. Claude.md is embedded into the Cursor Rules, but sometimes Cursor still ignores them, so I find myself constantly repeating, “Please make sure to follow the Cursor Rules.”

I then ask Cursor to update the Linear tasks with what we actually implemented, and to flag anything that was done differently and explain why. This helps keeping the development state on par with the Linear and Notion docs.

I keep going until the proposal is fully implemented, including unit tests and integration tests. I also love using a different AI provider to test code written by another provider. GPT tests Claude, Claude tests GPT. I think AIs love the challenge. Just like humans, they have ego and want to prove they can do it better.

**Testing and tooling make speed safe**

Speed without safety creates a fragile system. So we invested heavily in testing and internal tooling that allow us to move fast without breaking production. We test at every level. Unit, integration, end-to-end across full payment lifecycles, and UI tests for critical flows.

We built a CLI that lets developers simulate real payment flows locally and across environments. Docker and Mise-en-place keep things consistent across development environments, so code behaves the same locally, in CI, and in production. Secrets are managed centrally, so developers don’t handle them manually.

There are many more internal skills and CI/CD tools that deserve a deeper dive. We will write a separate post about our tooling.

Once the implementation is done, I run a final review. If I built with one provider, I review with another. If I built with Codex, I use Claude to review, and vice-versa. The Cursor review agent is also genuinely helpful at catching issues across a whole change.

Speed is good only when it is safe. Tooling makes that possible.

Then I ask Cursor to update the proposal in Notion if needed, because many times you discover nuance while building. The plan changes slightly. That’s normal. The proposal is a living doc, not set in stone.

Now we get to code review. While implementing, I do my best to break work into short, reviewable pull requests so my team doesn’t hate me. For that, we use Graphite. It’s a great tool (Although Graphite’s MCP integration has been broken in Cursor for a while, maybe it’s just for me?) for stacked diffs - Read about Stacked diffs in the [Pragmatic engineer](https://newsletter.pragmaticengineer.com/p/stacked-diffs), it’s life changing. Graphite’s `gt sync` and `gt restack` has changed my life. It makes rebasing and merging feel way less painful.

But, since we move fast we sometimes (many times) end up with bigger PRs. And then Steven came in with a custom command he built for Claude that we now use across other tools too, which can break a big change into small reviewable PRs and stack them properly with Graphite, while keeping the exact same final code. To be honest, this has made me a bit lazier, if that’s even possible. I move fast, and I rely on this to clean it up into a nice review flow. If people are interested, I’ll ask Steven to share more about it.

Once PRs are ready, we submit the stacked branches `gt submit --stack`, add reviewers, and post the PR in the #tech channel. Initial review happens with AI using our custom review skill file, which adds comments directly to the PR. Then I ask Cursor to read the feedback and comments, explain them and prioritise, and then I tackle them and respond to the comments without leaving Cursor. All this before the human review.

Once we are done with AI review, we sometimes have a call to go over the PR stack, where the author of the PR “rubber ducks” - which basically means explains it out loud - to another developer. Usually in this process some small nuances come up, which are added as PR comments and fixed. We approve the stack, and the author then merges it.

Code reviews are currently our bottleneck. We are working hard to improve this. One thing we recently started doing is feeding review learnings back into our Cursor rules and Claude.md file, so the next time we generate code, it is automatically closer to what reviewers want. The goal is not just “fix this PR.” The goal is “make the next PR better by default.”

Because testing and tooling are deeply integrated, we can deploy safely multiple times per day (If you compare it to 6 months ago, we were deploying maybe once or twice a week). Most pull requests are small and reviewable, and production issues are rare and quickly detected

**Then comes the retro.**

Every two weeks we run a retrospective where we discuss how to improve as a team. Each retro is run by a different team member. Honestly, retros are where we grew the most. This is where we introduced moving from tasks to proposals, pushed for more ownership, improved communication. These were working so well we’ve since started wider whole-company retros. Retros are where the system evolves.

Finally, autonomy matters.

Each member of the team has autonomy and ownership. They can decide what to work on, fix things they don’t like, and build improvements to our workflow. Building a CLI, improving tests, building an MCP, improving observability, improving security, whatever makes us faster and better.

Next, we want to start doing internal live coding sessions so we can learn each other’s habits, workflows, and tricks. Because in this era, speed is not just about code. It’s about how you think, how you communicate, and how you build systems that let you move without breaking everything.

AI did not change what we build. It changed how we build.

The real shift was not adopting AI tools. It was redesigning our workflow, ownership model, and development system around them.

AI doesn't replace engineers. It makes the curious ones faster. But without proposals, ownership, testing, and review, all you get is speed without quality.

This is how we build at Quidkey today. It's still changing. Our workflows evolve every week. We're not done figuring it out. I don't think we ever will be.

rabea@quidkey.com
