Title: AI Hype and Contextual Complexity
Date: 2026-08-12
Tags: AI, Software Engineering, Complexity
Category: Writing
Slug: ai-hype-and-contextual-complexity

Generative AI with code is a magical vibe, right?

From Simon Willison's vibe coded tools[^willison], to my own handy dandy mortgage calculator, you can make impressive
tools in minutes.

This magical experience and non-stop hype from the frontier labs have created a climate of outrageous expectations.

The question is, as it usually is for hype cycles, what is this thing actually best for? From the Internet to
Microservices, we have been through this before.

I would like to propose one method to reason about what Generative AI can do which I am calling "Contextual
Complexity".

My gut feeling is as Contextual Complexity goes up, the success rate of AI Inference—its ability to successfully guess
the right answer—goes down.

## Contextually Simple: Pure Magic

Hey AI, make me a mortgage calculator, and give sliders so I see the ratio of principal to interest for every month of
the term.

✨ ✨ ✨

[Poof!](https://albertoconnor.github.io/tools/tools/mortgage-calculator.html)

This is a tool built in minutes which I use and love.

Those clunky, ad-stuffed utility sites that dominate Google search results should be terrified. The not-so-clunky
Wolfram Alpha was my previous goto mortgage calculator. Maybe they are happy that I don't use it any more?

How is this possible and can we now vibe code Instagram and fire all our software engineers?!

I would like to suggest this was possible because it is on the Contextually Simple end of the Contextual Complexity
Spectrum.

My working characterization for Contextually Simple includes:

* Common knowledge the Generative AI system was trained on.
* Something which can be fully described in a small number of sentences.

Often common knowledge is the key driver, but you can describe a novel simple algorithm in a few sentences and AI can
generate an interactive web page describing it.

When it comes to my mortgage calculator I didn't have to describe how mortgages work or what a web-based mortgage
calculator is. Throwing those words into the model instantly activated the right neighborhood in its vector space—no
extra explanation needed.  Manually testing and discovering any fundamental issues that might have been generated is
straightforward in this case.

With that in mind, let's travel up the Spectrum.

## Contextually Complicated: Fun Weekend Project

Hey AI, make me a script to compress iPhone videos, and there are like 1 TB of them so let's index them with SQLite.

Hmm are we handling vertical video properly?

Wait, what is the fastest way to compress these videos on this specific computer?

The experience is not quite ✨ ✨ ✨

On the other hand, I wouldn't bother writing the script myself. If I did, I certainly wouldn't use SQLite even if it
made it run better. I mean I could write but it would take the whole weekend. This time it still took the whole weekend,
but I had lots of breaks and when things got harder AI was there to help, mostly.

What is Contextually Simple? No, it wasn't a magical one shot. The AI has common knowledge about SQLite, and FFMPEG. It
should know about iPhone videos and what arguments work best on a Mac, but it turned out extracting that information was
a labour of trial and error itself.

We've moved from single magic tricks to combining Contextually Simple pieces into a Contextually Complicated system. And
the friction scales exponentially—every new component you add multiplies the trial and error required to get it
working.


## Complicated vs Complex

Let's take a moment to talk about complexity. Snowden's Cynefin Framework gives us a way to think about complicated vs
complex systems. We can layer on Dr. Richard Cook's famous manifesto 'How Complex Systems Fail' to explain how they
break. Since we are talking about Contextual Complexity both could be useful.[^snowden][^cook]


Systems can be very complicated but still largely deterministic. A car engine or an involved single process Rust program
are examples. The two examples we have seen are in the category of complicated but not complex.

A complex system is one whose components interact non-deterministically whether through human interaction, physical non-determinism (networks), or now AI interaction—which is also non-deterministic. Once your Rust program is on the network
talking to multiple components or 3rd party services, things become complex. Complex systems are harder to manage, reason
about, and even if robust, massive failures are always possible.

If you are curious about why software inevitably drifts toward being complex, Alex Gaynor's essay on the topic is a
great primer.[^gaynor]

How does this apply in bigger teams as Contextual Complexity goes up?

## Contextually Complex: Team Based Software Engineering

Welcome to the other end of the spectrum. The most "Contextually Complex" not only is a properly complex system being
built, we don't actually know what the system should do.

The Context is both complex and unknown.

Likely we have some idea of what kind of experience we want to create for the users of the system. Buried in that are
hundreds or thousands of decisions. Each complicated component of the system runs in a degraded state. As systems safety
researcher Dr. Richard Cook points out, the more complex a system gets, the more these degraded states compound to lead
to massive issues. Discovering the unknown context and managing the system to function well is the real
project of team-based software development.

I have said for years, well before Generative AI, typing out the code was never the hardest nor most time consuming
part. It does consume time and making it faster is useful. We can see that speeding up this one part can give
incremental gains in throughput. But the hype is focused on the magic of Contextually Simple examples.

We can use "Vibe Engineering"[^vibe] in these cases where the code is largely AI generated, but humans still have to
design the architecture to make sure the system doesn't collapse under the expected load. The AI given a complicated
component of the system and enough context may be able to infer a good result, but the AI will not infer the properly
complex issues of the greater system. Even if the AI could, the complex system would still eventually fail, and those
failures will continue to compound.

## An Exception: Bounded Context

It is possible to use Generative AI systems to generate code for seemingly very "complex" systems and have it be
successful.

This only works if you first build a robust verification system to box in the complications. Take an HTML rendering
engine: you can test it against existing standards, and as the AI inevitably fumbles its inferences, the test suite
guides it. You’re essentially lighting tokens on fire to brute-force your way to a working solution.

If you look closer, you can see such a rendering engine is actually complicated, not complex based on Snowden's
definition. It is more like a car engine than it is a web service. The robust verification system bounds the context and
encodes all the decisions a software engineer team would be considering making it possible to grind out.

In the team case we need a method to uncover the context. One is to build a bunch of verification systems first and then
generate all the code for the complicated components and then fit them together. The second is to build prototypes and
iterate together. I think the latter is still more practical today. Building the verification systems directly may
obscure the implications of the decisions on the actual users of the systems.

## Beyond Code Generation

AI can change the way we build complex systems and uncover unknown context.

It can help us see around corners and reason about how well we are sticking to what we said we wanted to build. More
importantly it could help us collaborate better so we can make decisions faster and have a shared understanding sooner.
More about that in my future blog posts. Next I will talk about how we structure our AI systems to help think about what
kind of "Centaur" we are becoming.

---
> 💬 **Enjoyed this?** [Subscribe via RSS](/feeds/all.atom.xml), [leave a comment on this
> issue](https://github.com/albertoconnor/albertoconnor.ca/issues/3), or [join the Slack](/slack) to continue the
> conversation.
    
## References
    
[^willison]: **Simon Willison's Tools:** Willison, S. [https://tools.simonwillison.net/](https://tools.simonwillison.net/)
[^snowden]: **Cynefin Framework:** Snowden, D. J., & Boone, M. E. (2007). "A Leader's Framework for Decision Making". *Harvard Business Review*.
[^cook]: **How Complex Systems Fail:** Cook, R. I. (1998). "How Complex Systems Fail". *Cognitive Technologies Laboratory, University of Chicago*.
[^gaynor]: **Why Software is Complex:** Gaynor, A. (2019). ["Why software systems become complex"](https://alexgaynor.net/2019/aug/11/why-software-is-complex/).
[^vibe]: **Vibe Engineering:** Willison, S. (2025). ["Vibe coding and vibe engineering"](https://simonwillison.net/2025/Feb/23/vibe-coding-and-vibe-engineering/).
