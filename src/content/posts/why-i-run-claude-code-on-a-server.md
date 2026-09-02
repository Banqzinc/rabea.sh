---
title: "Why I run Claude Code on a server (box)"
description: "How I moved Claude Code off my laptop onto a Hetzner box behind Tailscale, with mosh, tmux, scoped credentials instead of permission prompts, and what broke."
date: "2026-09-02"
author: "Rabea Bader"
tags:
  - engineering
  - developer-tools
  - ai
---

You have probably seen people walking around outside with a barely open laptop. They are waiting for Claude, or Codex, or whatever AI system they use to finish the session they started (thinking it will take 5 minutes). Well, I was one of those. I did it at dinner with family and investors, I tried on an airplane (but the internet was shit and I didn't get anything done), I even did it on a beach in Australia - the sand was not fun. I had to keep the laptop open enough for the computer to continue working but closed enough for me to be able to carry it and "enjoy" my "free" time. It was funny at first, but then it started to be a burden. For those who ask why I didn't use Claude on remote control: you needed the laptop to stay open and connected, you can't start new sessions, and it still tied the actual work to my laptop, which was exactly what I was trying to get away from (and it sucks).

So I needed a better solution, because working locally is what we were doing at Quidkey, and it stopped being enough a while ago. We'd already created custom skills and plugins, and adopted workflows that helped a lot in making the team more efficient in code review, debugging, planning and testing. What was now blocking us was being able to run Claude 24/7 without interruptions, and thus the search began. One that doesn't require my laptop to be plugged into the charger, and connected to a hotspot that drains my battery.

I wanted to go with a common solution I'd seen work well for other people, so I created a Hetzner server running Linux. I connected it to Tailscale so my laptop, my phone and the box are all on one private network. I connect with mosh rather than ssh so a flaky signal doesn't kill my connection. And I set up tmux so my sessions keep running after I disconnect. That way I can open (or reopen) a session from my laptop or my phone, from anywhere, only my devices can reach it, and there are no external open ports.

My skills to set up servers and configure access were basically non-existent, but still the initial setup took maybe 30 minutes end to end with the help of Claude. In this short time I was able to clone our repository, install all the requirements, run Claude and connect remotely to the server either from my laptop terminal or using my phone. It made me really happy, and just for fun, I asked Claude to implement something quick for me, and closed the laptop lid, counted to 10 then opened it again, logged in and had an idiotic smile on my face while seeing Claude was still running.

To my surprise, my MCPs were still connected (duh), but the happiness went out of the window once I realised my local setup wasn't there: my qk CLI (if you read our previous posts: [Building Internal Dev Tooling](https://redsteg.io/blog/building-a-platform-cli-with-claude-code/) and [From weeks to days](https://rabea.sh/posts/from-weeks-to-days-how-we-reduced-feature-delivery-time-at-quidkey), you'll know I can't live without it), my dotfiles, Playwright for testing (we use it quite often) and also my Claude Code memory were nowhere to be found. So I did what most developers would do these days, and asked Claude to help me out.

After some back and forth, we concocted a plan to create a personal repo for my dotfiles and memory so I can sync between my devices, and once I made sure none of them had any secrets lurking it was good to go.

Once everything was set up and I left my Claude to work on the server for the first time over lunch, I realised what I knew from before, that auto-mode for permissions sucks. My Claude was stuck and waiting for my approval. So I said to myself: "What about using it just with bypass permissions? It should be easy." But then I remembered the horror stories I read on Twitter (or X) and Reddit, of startups losing data, Claude dropping their production database, or just AI going crazy. As CTO, it would be particularly bad (and embarrassing) if Claude leaked my credentials or used them to do something damaging. The idea of Claude running free caused me nightmares while still being awake.

So instead of restricting Claude, I restricted what Claude can touch. Tightly scoped API keys, fine-grained tokens and service accounts were the interim answer: read from the db, read code and create PRs with no ability to bypass and merge to main, tunnel via cloudflared with the right scope (and manual approval for auth), and more. It meant I felt comfortable having Claude run with bypass permissions on the server, for longer runs (even overnight ones), no approvals every few minutes, more speed and quality with the synchronised memory and our goals and workflows, and without the headache of managing different users and permissions locally. Basically, unleash Claude to do only the things it's allowed to do. And it worked great! I was shipping better and faster than ever!

To test changes, I run the code on the box, run Playwright, unit and integration tests, but some kept failing because test webhooks never arrived at my new box. My brain was already running towards my local ngrok setup and how I need to move it and configure it again on this box, but then I remembered: I'm on the cloud. I can just run my code on this box and give 3rd parties a public link to send their webhooks to. But I didn't want to compromise security and open the box to the internet, and this is where the great Tailscale came into play again, this time with Funnel. One command, and I get a public HTTPS link that goes only to the port I choose, while everything else on the box stays closed.

So by then, I had a full cycle of development, running my code and testing it, while updating our internal documentation on Notion and progress on Linear.

The setup in short:

[**Tailscale**](https://tailscale.com/) is the private network. My laptop, my phone and the box all join the same tailnet. It's the only way in, there is no public SSH.

[**mosh**](https://mosh.org/) is the connection. Regular SSH hates it when your network changes or your phone falls asleep, mosh doesn't care, it picks up right where it left off. And its traffic rides *inside* the Tailscale tunnel, so its ports are never exposed to the public internet.

**tmux** is what makes sessions immortal. Claude runs inside it, so it keeps going after I disconnect, and I reattach from any device to find it exactly where I left it.

Put together, the mental model is simple:

> phone or laptop → Tailscale → the box, where tmux is holding Claude open.

mosh is how I get there. tmux is what's waiting for me when I arrive.

This was perfect! Until it wasn't.

My box died. Apparently having multiple sessions open, code running, and parallel testing can kill your memory (who knew). But this was simple, I just needed to upgrade from 2 cores and 4GB costing ~€4 to 4 cores and 16GB costing ~€19. And the problem was solved.

While poking around the box after the upgrade, I also found five Claude sessions I had started earlier, still running, quietly holding about 1.6GB of memory. I had started them in a plain shell back when I was still figuring things out, instead of inside tmux, so they didn't die when I disconnected, they just stayed there. Forever. Lesson learned: always run Claude inside tmux, never in a bare shell. Kill a tmux session and it's gone. Forget a bare one and it will sit in your RAM for weeks.

The box was no longer the bottleneck. Claude usage was. As you can imagine, I was hitting my usage limits quite fast, running long sessions on Fable eats more tokens than anything I have seen (and I'm not talking about how fast they go with Playwright). So back then, I just increased the budget, and I'll explain in the next post how we optimised it.

But the real problem wasn't RAM or tokens. It was people. How do I get my whole team to work on this, and how can I get everyone to adopt it without them needing to do all the setup I had to do, which has been 2 days by this point?

Next week I'll write about qkvps, the small CLI we built (with Claude, obviously) that turns all of this into one command, and how it got the whole team onto boxes without the 2 days of setup I had to do. And then [Steven](https://www.linkedin.com/in/steven-holmes-7281a627/) will follow up with how he took sandboxing and isolation to the next level.

So, was it worth it? About €19 a month, plus two days of setup, most of which was me describing what I wanted and reviewing what Claude did. Honestly, some of the best money I spend. Not because I now have a server in Germany, but because Claude stopped being tied to one machine. I start something from my laptop, check it from my phone, and I never lose a session to a closed lid or a dropped signal again.

And the funny part: every tool in this setup is boring and years old. Tailscale, mosh, tmux, a plain Linux box. The only new thing is that the thing running on the box is also the thing that set it up.

[rabea@quidkey.com](mailto:rabea@quidkey.com)
