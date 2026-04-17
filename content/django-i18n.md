Title: Django i18n
Date: 2013-08-19 11:43
Slug: django-i18n
Category: Writing

<p>What does i18n mean?</p>
<p class="text-center">i18n = i followed by 18 letters followed by n = internationalization</p>
<p> 
That is it, just a short hand. It isn't the name of standard governmental or otherwise.
</p>
<p> 
When I watched the first <a href="http://www.youtube.com/watch?v=f3Y-QoEkPtw" target="_blank">videos about Django</a> many years ago, they declared that Django had great internationalization support including a Welsh translation. It sounded great and I wanted to try to use it, but I was never involved in a project that really needed it, until now!
</p>
<p> 
At <a href="http://www.thalmic.com/" target="_blank&gt;Thalmic Labs&lt;/a&gt; we were able to translate the company website into German and Korean in a matter of weeks, the most time was devoted to getting the translations done, very little was figuring out i18n in Django. It was only a few hours of hitting my head against the wall.
&lt;/p&gt;

&lt;p&gt;
Here is a bit of what I learned along the way. Hopefully it helps you.
 &lt;/p&gt;

&lt;h2&gt;Resources&lt;/h2&gt;

&lt;p&gt;
First watch this &lt;a href=">Thalmic Labs</a> we were able to translate the company website into German and Korean in a matter of weeks, the most time was devoted to getting the translations done, very little was figuring out i18n in Django. It was only a few hours of hitting my head against the wall.
</p>
<p>
Here is a bit of what I learned along the way. Hopefully it helps you.
 </p>
<h2>Resources</h2>
<p>
First watch this <a href="http://pyvideo.org/video/1379/a-gringos-guide-to-internationalization" target="_blank">excellent talk by Jacob Burch</a>. He helps to fill in some of the gaps from the <a href="https://docs.djangoproject.com/en/1.5/topics/i18n/translation/" target="_blank">i18n documentation</a> which you should also have a look at.
</p>
<iframe width="640" height="360" src="//www.youtube.com/embed/j2ZHZWfx60Y" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
<p>
Definitely grab Jacob's version of poxx, you won't need it in production or on staging so you can just install it locally:
</p>
<pre>
pip install -e git+https://github.com/jacobb/poxx.git#egg=poxx
</pre>
<p>
By the end of this post you will have poxx generated fake translations appearing on your website. The first step is to mark your strings in your templates, code and javascript for translation. The docs cover that pretty well so I am going to pick up after that.
</p>
<h2>The Locale Directory</h2>
<p>
I was using a Django 1.4 directory layout so when I ran
</p>
<p><pre>
python manage.py makemessages
</pre>
</p><p>
And got the somewhat unhelpful error message:
</p>
<blockquote>
"This script should be run from the Django SVN tree or your project or app tree. If you did indeed run it from the SVN checkout or your project or application, maybe you are just missing the conf/locale (in the django tree) or locale (for project and application) directory? It is not created automatically, you have to create it by hand if you want to enable i18n for your project or application."
</blockquote>
<p>
What it means is Django can't find ./locale, so it will give up trying to do anything. I think the error message has been improved in newer versions of Django.
</p>
<p></p><p>
There are two options of where to place locale directories. One locale directory for the entire project or one locale directory per app. I think one per app is the right answer especially for large projects. However to get things working without spending a bunch of extra time fighting with makemessages and compilemessages, one locale directory for your entire project is easier.
</p>
<p> 
It is easier to run makemessages and compilemessages, but you need to tell Django explicitly where your translations are, because by default it only looks for locale directories under each app in INSTALLED_APPS. You can use the LOCALE_PATHS setting for this:
</p>
<div class="highlight"><pre><span class="n">LOCALE_PATHS</span> <span class="o">=</span> <span class="p">(</span>
    <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">BASE_DIR</span><span class="p">,</span> <span class="s">&quot;locale&quot;</span><span class="p">),</span> <span class="c"># Assuming BASE_DIR is where your manage.py file is</span>
<span class="p">)</span>
</pre></div>

<p></p><p>
Make a locale directory beside your manage.py file, then you can run:
</p>
<pre>
python manage.py makemessages -l de
</pre>
<p>
This will create a django.po file from the german locale under locale/de/LC_MESSAGES. The file will have message id, but the values (the german translations) will be empty. Great first step done! Now for the poxx.
</p>
<h2>Poxx.py</h2>
<p>
Jacob is right about poxx.py, it is very useful for making sure translations are working, and making sure you are translating everything you want to.
</p>
<p></p><p>
You can run it on the german .po file you created above:
</p>
<pre>
poxx.py locale/de/LC_MESSAGES/django.po
</pre>
<p>
Now run compilemessages:
</p>
<pre>
python manage.py compilemessages
</pre>
<p>
Now you are almost ready to see fake poxxified translations.
</p>
<h2>i18n_patterns</h2>
<p>
The fastest way to control what language you are viewing is to follow the <a href="https://docs.djangoproject.com/en/1.5/topics/i18n/translation/#internationalization-in-url-patterns" target="_blank">documentation to hook up the i18n_patterns</a> in your root url.py. One tradeoff is it will prepend your default locale (say 'en') to all your urls under the i18n_patterns, but all the redirection will happen automatically.
</p>
<p>
In the end we used the cookie based approached with a language chooser, but for getting it done in one sitting, stick to i18n_patterns.
 </p>
<p>
Now you should see your poxxified translations by running your server: http://127.0.0.1:8000/de/your/translated/view/
</p>
<p> 
The poxx translations replace normal characters with weird unicode characters which means your text is still readable, but odd looking. Normal looking text that means those strings weren't marked for translation. Fix any you find and then re-run makemessages, poxx.py and compilemessage to make sure your fix worked.
</p>
<p>If you want to test this out but don't have project handy to work on you can try an example project I built: <a href="https://bitbucket.org/amjoconn/django-i18n-example" target="_blank">https://bitbucket.org/amjoconn/django-i18n-example</a>. It already has most strings marked for translation so you can run through the messages and poxx.py steps to see how they work.
</p>
<p>
i18n is a complex topic, but a worthy one to sink your teeth into. The more multi-lingual the web is the better place it will be.
</p>
<p>
By the way, Thalmic Labs is great company which is <a href="https://www.thalmic.com/careers/web-developer/" target="_blank">looking for a full time web developer</a>.
</p>
