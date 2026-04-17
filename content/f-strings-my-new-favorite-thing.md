Title: f-strings For the Win
Slug: f-strings-for-the-win
Date: 2017-07-7 19:00
Category: Writing

It has been a long time coming, but I am now actively migrating
existing projects to Python 3. [Python
3.6](https://docs.python.org/3/whatsnew/3.6.html) specifically,
because when I am done I will be able to take advantage of my new
favorite feature everywhere!

That feature is `f-strings`, you can [Read
PEP-0498](https://www.python.org/dev/peps/pep-0498/) for all the details
but here is a basic example:

    :::python
    Python 3.6.1 (...) 
    Type "help", "copyright", "credits" or "license" for more...
    >>> name = 'Albert'
    >>> f'Hello, {name}!'
    'Hello, Albert!'

Yes, `f-strings` or "format strings" are yet another way to format
strings. I know how you might feel on first glance, I didn't like
 `f-strings` at first myself. Surely the explicitness of `string.format()` would be better than the syntactic magic
of `f-strings`, but once you use them it is hard not to love them.

Another complaint is that there are too many ways to format strings in
Python. That is true, but having one obvious way to do things shouldn't
cause a lack of real progress in the language. None of the previous string formatting approaches have felt as natural or as
teachable as `f-strings`.

### How do they work?

Initially, you might think about `f-strings` as having an implicit call to
`.format()` with all of the local and global scope passed in. This isn't the correct mental model and that kind of implementation was specifically
rejected in the design process. Instead, you can think about `f-strings`
like this:

    :::python
    >>> f'Hello, {name}!'
    # is the same as
    >>> 'Hello, ' + format(name) + '!'

The built-in `format` function calls the underlying `__format__`
interface which allows types to control how they are formatted. An
additional spec can be passed into `format` as well.

    :::python
    >>> import datetime
    >>> today = datetime.date.today()
    >>> f'The year {today:%Y}'
    'The year 2017'
    # is the same as
    >>> 'The year ' + format(today, '%Y')

Since what is in the `{}` is an expression which is evaluated in the same context as
the `f-string` literal appears, what you might feel should work, just does.

    :::python
    >>> data = dict(foo='bar')
    >>> f'The answer is {data["foo"]}'
    'The answer is bar'
    >>> class Circle(object):
    ...   color = 'red'
    ...
    >>> circle = Circle()
    >>> f'The circle is {circle.color}'
    'The circle is red'

The expressions can become quite complicated including literals,
operations, and function calls:

    :::python
    >>> i = 10
    >>> word = 'grease'
    >>> f'Math: {i + 1}'
    'Math: 11'
    >>> f'Upper case: {word.upper()}'
    'Upper case: GREASE'

This offers a huge amount of flexibility with code which just works the
way one might expect.

### Even more in Python 3.6

First, there is everything in Python 3 including unicode everywhere, all
the new async support, and an interactive shell which remembers the commands in your last
session!

Second, 3.6 features dictionaries which are even faster and perserve key insertion order. Some claim this is an [implementation
detail](https://www.youtube.com/watch?v=npw4s1QTmPg) which can change, but as Brandon Rhodes and others have observed [there probably isn't
any going back](https://www.youtube.com/watch?v=66P5FMkWoVU)!

Python 3.6 isn't available on Ubuntu 16.04 by default. Installing isn't
[too hard](https://askubuntu.com/a/865569), and you can add it to your
provisioning automation in a few simple steps.


Start migrating your projects to Python 3.6, and [deprecate support](https://www.youtube.com/watch?v=2DkfPzWWC2Q) for
2.7 so we can all use `f-strings` everywhere sooner.
