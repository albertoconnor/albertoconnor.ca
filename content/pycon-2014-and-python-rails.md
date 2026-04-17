Title: PyCon 2014 and Python on Rails
Date: 2014-06-16 14:17
Slug: pycon-2014-and-python-rails
Category: Writing

<p>The organizers of <a href="https://us.pycon.org/2014/" target="_blank">PyCon 2014</a> did a great job making a large conference feel like a regional one. The diversity among the attendees was great, though there is always room for improvement. I will definitely be going back in 2015.</p>
<p>Here are some lessons learned and a recap of Python on Rails which proved that trains still are the best way to travel.</p>
<p><a href="http://pyvideo.org/video/2566/pickles-are-for-delis-not-software" target="_blank">Stop using pickle</a>. Did you know pickle is a stack based language pretending to be a data interchange format? Even celery, which is basically instantaneously pickling and unpickling (which avoids some of the major pitfalls), is moving away from it.</p>
<p>You can use the environment variable <code>PYTHONDONTWRITEBYTECODE</code> to prevent Python from writing .pyc files.</p>
<pre>
$ export PYTHONDONTWRITEBYTECODE=1
</pre>
<p>In development when you don’t really care about the slight speed optimization of precompiling byte code this can help avoid other pitfalls. This tip comes from <a href="http://rhodesmill.org/brandon/slides/2014-04-pycon/day-of-the-exe/" target="_blank">
"Day of the EXE"</a>. All of <a href="http://pyvideo.org/speaker/337/brandon-rhodes" target="_blank">Brandon Rhodes</a> talks are worth watching. They do a beautiful job of expressing complex concepts in a way which is accessible to people of all skill levels.</p>
<p>If you use pdb&mdash;and especially if you don’t, you should watch <a href="http://pyvideo.org/video/2673/in-depth-pdb" target="_blank">
In Depth PDB by Nathan Yergler</a> which covers it from the basics to more advanced usage. I leaned about the <a href="https://docs.python.org/2/library/pdb.html#pdb.post_mortem" target="_blank">
postmortem debugger</a> <code>import pdb; pdb.pm()</code> and the potential to have Django enter it automatically using something like <a href="https://pypi.python.org/pypi/django-pdb" target="_blank">
django-pdb</a>.</p>
<p>I should really start using postgres in development to spare <a href="http://pyvideo.org/video/2630/designing-djangos-migrations" target="_blank">
Andrew Godwin</a> from shedding too many tears.</p>
<p>Finally next time you want to upload a package to PyPI instead of crying softly to yourself, you should try <a href="https://pypi.python.org/pypi/twine/" target="_blank">
twine</a>, I know I will.</p>
<p>Nearly all the videos are up on <a href="http://pyvideo.org/category/50/pycon-us-2014" target="_blank">pyvideo.org</a>. One notable exception, one of the most talked about talks of the conference <a href="https://www.destroyallsoftware.com/talks/the-birth-and-death-of-javascript" target="_blank">The Birth and Death of Javascript by Gary Bernhardt</a></p>
<p>You should go next year, it will be in Montreal again. It will sell out months before the conference start date so buy your tickets early.</p>
<h2>Python On Rails</h2>
<p><a href="http://watpy.ca/" target="_blank">WatPy</a> worked with Brydon and Anastisa at <a href="http://threefortynine.com/" target="_blank">349 Coworking</a> to organize a chartered train trip from Toronto to Montreal. For 6 hours we had lunch, had few drinks, did a coding challenge and heard from Brandon Rodes about how to get the most out of PyCon.</p>
<p>It was a great stress free way to get to the conference and it meant when you got there you already knew enough people to get some friendly smiles in the hallways between sessions. That and we arrived right in the heart of Montreal and a short walk away from the hotels and conference centre.</p>
<p>We are planning on taking the train again next year. The website hasn’t been updated, but if you <a href="http://pythononrails.ca/" target="_blank">sign up</a> with your email you will be among the first know when details come out this fall.</p>
<p>If you are involved in a startup consider joining them on the <a href="https://trips.threefortynine.com/" target="_blank">Startup Train</a> to the Montreal Startup Festival.</p>
<p><center>
<iframe src="https://www.slideshare.net/slideshow/embed_code/35502942" width="476" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</center></p>
