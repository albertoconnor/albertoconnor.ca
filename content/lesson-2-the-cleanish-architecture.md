Title: Lesson 2: The Cleanish Architecture
Date: 2026-10-15
Tags: Python, Django, Architecture, Software Engineering
Category: Writing
Slug: lesson-2-the-cleanish-architecture
Status: draft

This series focuses on code organization and how it can set you and your AI up
for success.

The first post, [Lesson 1: Apps Over
Layers](https://albertoconnor.ca/lesson-1-apps-over-layers.html), covered why
organizing a monolith into feature-driven apps rather than flat technical
layers keeps domains isolated, reduces blast radiuses, and sets up predictable
boundaries for both humans and AI.

This post describes one option of how to structure what goes inside each app,
but ultimately it is up to you.

## Fat Models and How Services Did Not Solve the Problem

In the early days of Django, the pattern we fell into was fat models and custom
model managers. We were all focused on Model-View-Controller, but Django lacked
an explicit controller, so logic ended up stuffed into model methods or maybe
the views. That feels reasonable early on, but cross-model logic and operations
you want to abstract from a single model quickly become cumbersome.

Attempting to fix this by introducing "service" or controller classes didn't
solve the real problem. Taking logic out of models and views and putting it
into services felt organized, but we still didn't have a clear framework for
what kinds of work belonged where. What should the view stop doing? Where do
database reads belong versus database writes? We moved the code, but we didn't
change the underlying confusion.

## Flipping the Script on I/O

The typical approach when organizing code is to push the messy details down. An
API endpoint or view calls a function, which calls a helper function, which
calls another helper that finally executes a database query or calls a
third-party API. This feels like abstraction: we go from high level to low
level. In reality, it means every function we write is doing I/O, which makes
every single function hard to test because they all need to mock.

In his talk, "The Clean Architecture in Python", Brandon Rhodes pointed out
Uncle Bob's counter-intuitive insight: we need to flip the script and push I/O
to the highest reasonable level.[^rhodes-clean]

Instead of functions calling functions that perform I/O, in an orchestrator
function gather your data upfront (I/O), pass that data into your logic, and
persist the results at the end (I/O). This means your logic functions are
passing around plain old data, making it easier to test. The orchestrator function
test will require mocking but it should only need a few tests.


Gary Bernhardt called this top or outer layer the boundary in his talk
*Boundaries*. He introduced the concept of a "Functional Core, Imperative
Shell."[^bernhardt-boundaries] His talk formalized the idea and the rationale
for why it is worth it. It is easy to test functions which do no I/O and
just take and return plain old values. They are easier to write, run super
fast, and do not get slower the way integration tests tend to.

## The Power of Plain Data

This sounds simple and straightforward, but Brandon's later talk, his keynote
at North Bay Python 2017[^rhodes-slides], walks through building his
terminal-based slide tool. Toward the conclusion of the talk, he realized he,
the person who gave the talk on the Clean Architecture in Python, failed to
realize that he should follow the pattern. He was stuck in our old ways.

His talk also reveals something even more powerful: preferring data over logic
for flow control. Not only does his functional core pass back plain old data,
but the data is complex and represents terminal state. The state is cheap to
edit, easy to assert in tests, and provides a robust debugging interface
compared to a series of branching functions and a maze of unit tests.

Using data as control flow also ensures the orchestrator function is as simple
as possible and does not have branching code which requires more mocking tests.


## Cleanish Architecture: Pragmatism Over Dogma

Uncle Bob’s full Clean Architecture attempts to abstract everything, even the
framework itself.[^uncle-bob-clean] In ecosystems like Django or Rails,
adopting that purist approach delivers diminishing returns. You end up writing
domain entities, repositories, and data transfer objects for every single
model, spending more time maintaining boilerplate than building features.

The approach I advocate—what I call the Cleanish Architecture—takes the core
insights from Brandon and Gary without throwing away the conveniences of our
frameworks. You do not need to create pure data doubles for every database
model. If you squint, a Django model instance looks close enough to plain old
data.

There are really only two caveats to making this work:

- **Prefetch upfront:** Ensure related data is loaded before it reaches your logic, so simple attribute access doesn't trigger a surprise database query.
- **Treat models as read-only:** Never call `.save()`, `.update()`, or mutating model methods inside your business logic. Saving state belongs strictly in your I/O functions.

Follow those two rules, and you get fast, mock-free tests without the enterprise ceremony.

## The One Rule: Easy To Change


In his talk One Rule to Rule Them All, Pragmatic Programmer co-author Dave
Thomas argued that every foundational design guideline—DRY, SOLID, decoupling,
high cohesion—is just a special case of one single principle: ETC (Easy To
Change).[^thomas-etc] If an architectural pattern makes adapting to new
requirements harder, it is a bad pattern.

This rule matters because, as I always say:

> You know the least at the beginning.

In fact, you always know less today than you will tomorrow. You are constantly
discovering what the problem actually is, which means every architecture starts
as an educated guess based on incomplete information. What ruins codebases
isn't making imperfect guesses early on; it's the fear of changing them later
when tests are slow, mocks are brittle, and I/O side effects are tangled
everywhere.

Cleanish Architecture is simply about removing that fear. When you push I/O out
of your business logic and into a shell, unit tests run fast without mocks, and
refactoring stops being scary. You optimize for change because change is the
only way your code adapts to what you learn.

In the next post, we will walk through a concrete Django example showing the
exact file layout (reads, writes, services, handlers)—and how this pattern
directly helps AI agents write reliable, maintainable code.

## References

[^rhodes-clean]: **The Clean Architecture in Python:** Rhodes, B. (2014). PyOhio 2014. [https://pyvideo.org/pyohio-2014/the-clean-architecture-in-python.html](https://pyvideo.org/pyohio-2014/the-clean-architecture-in-python.html)
[^bernhardt-boundaries]: **Boundaries:** Bernhardt, G. (2012). Software Craftsmanship North America (SCNA). [https://www.destroyallsoftware.com/talks/boundaries](https://www.destroyallsoftware.com/talks/boundaries)
[^rhodes-slides]: **Keynote:** Rhodes, B. (2017). North Bay Python 2017. [https://www.youtube.com/watch?v=rrMnmLyYjU8](https://www.youtube.com/watch?v=rrMnmLyYjU8)
[^uncle-bob-clean]: **The Clean Architecture:** Martin, R. C. (2012). *Clean Coder Blog*. [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
[^thomas-etc]: **One Rule to Rule Them All:** Thomas, D. (2022). YOW! 2022 / GOTO Conferences. [https://www.youtube.com/watch?v=yWbM4oE-G14](https://www.youtube.com/watch?v=yWbM4oE-G14)
