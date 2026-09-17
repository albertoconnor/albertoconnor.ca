Title: Lesson 1: Apps Over Layers
Date: 2026-09-17
Tags: Python, Django, Architecture, Software Engineering
Category: Writing
Slug: lesson-1-apps-over-layers
Status: draft

This series focuses on code organization and how it can set you up for success.

A few years ago, I read a blog post focused on startup coding advice from the
Python and Flask community. I agreed with a majority of the advice, but one
section suggested that either a Django-style "many apps" layout, or a Flask-style
approach—organizing by technical layers and grouping everything into one giant 
"app"—were both reasonable options.

I didn't think that it was reasonable then. Today with AI it makes even less sense.


If you intend to scale, technical layering is a mistake. Grouping functionality
into domain-driven apps serves you far better long-term. The upfront mental effort
pays off, and while you will likely get the initial boundaries wrong, that is
fine—folder boundaries are easy to adjust.

## The Django Model vs. The Rails Default

Django pioneered and championed the app structure, which has always been a major
differentiator from Ruby on Rails and other frameworks. 

While you *can* build one massive Django app and dump all your code into it (the
so-called `core` app), Django's entire ecosystem of reusable third-party apps[^django-apps]
pushes you toward a strong structure for modular code. Flask also supports this
via Blueprints[^flask-blueprints], but you have to explicitly choose to use them.

## Safe to Get Wrong

One of the main arguments against building "Apps" early on is that you don't
know your domain boundaries yet. That is true—you know the least at the
beginning. You optimize for change.

But here is the secret: Database tables and models are rigid, but apps are
simply Python folder constructs. If you draw the wrong boundaries initially, you
can easily evolve them over time.

## Consistency vs. Chaos

Without app structures, you end up with arbitrarily named files scattered across
technical layers: a `ledger.py` in your `models/` folder, and a `scheduler.py` in
`services/`.

Without the container of an "App" to bind them together, there is no enforced
consistency between your API, your models, and your logic layers. This makes it
incredibly difficult to cleanly extract logical pieces later. It becomes a
free-for-all.

## AI and Import Clarity

A consistent set of files within a dedicated folder creates a predictable
purpose. This is highly effective context for AI. If you drop an AI into a
`/billing` folder, it can understand the context immediately. It is easier to
describe the purpose of each file to encourage better code generation.

For human developers, it simplifies reasoning and makes parallel work easier
when features do not overlap. Teammates work in distinct app directories instead
of colliding over arbitrarily named files in shared layer folders.

Finally, app structures make it explicitly obvious when you are
importing functionality across boundaries. If you are inside the `users` app and
you have to type `from billing.models import Invoice`, you immediately feel the
friction of crossing a boundary. It forces you to think about how code is
shared, rather than just silently importing something that happens to live in
the exact same `models/` folder.

Boundary crossing is fine; the goal is not total isolation. Your apps will evolve,
and when you do cross-import, you can analyze coupling simply by inspecting
import statements.

## Learn from Rails and Shopify

If you want proof of why technical layering fails at scale, just look at Ruby on
Rails.

Out of the box, Rails uses strict technical layering. If your startup grows to
have 200 models spanning 10 different business domains, all 200 models live
flatly inside a single `app/models/` folder.

Shopify runs one of the largest, oldest Rails monoliths in the world.[^packwerk-blog] Because
everything lived in `app/models/`, their boundaries completely collapsed. The "Big
App" became a "Big Ball of Mud."

To fix this, Shopify had to invest massive engineering effort to build and
open-source a static analysis tool called Packwerk.[^packwerk-github] Packwerk allows Rails
developers to artificially group their files into "packages" (domains) and
throws errors if they cross boundaries incorrectly.

You might not need to enforce boundaries as aggressively as Shopify, but
apps give you the structural affordances you (and your AI) need to reason safely
about the codebase.


## The End Goal for Scaling

When your system gets complicated, your team expands, and your customer base
diversifies, an app-based structure not only allows you to enforce boundaries,
it also allows you to clearly evaluate the connections between different apps and
domains.

As Sam Newman points out in *Building Microservices*[^newman], you should prefer a
monolith until your team size physically forces you to break it up. More on this
in future posts.


So take the lesson and give your system some thought. Do not dump everything into
a flat, layered architecture; arbitrary imports create tangled dependencies that
are incredibly difficult to untangle. 

If you group by domains from day one, then when it finally makes sense to split
into microservices, you can easily graph your cross-imports and immediately see
the natural way to break up your system.

Your future self will thank you.

Next, we will break down what the internals of those apps could look like thanks
to Brandon Rhodes, Gary Bernhardt, and Uncle Bob.

---

## References

[^django-apps]: **Django Applications:** [Official Documentation](https://docs.djangoproject.com/en/stable/ref/applications/)
[^flask-blueprints]: **Flask Blueprints:** [Official Documentation](https://flask.palletsprojects.com/en/stable/blueprints/)
[^newman]: **Building Microservices:** Newman, S. *Building Microservices*.
[^packwerk-blog]: **The State of Shopify’s Monolith:** ["Under Deconstruction"](https://shopify.engineering/deconstructing-monolith-designing-software-that-maximizes-developer-productivity).
[^packwerk-github]: **Packwerk:** [github.com/Shopify/packwerk](https://github.com/Shopify/packwerk).
