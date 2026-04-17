Title: UnicodeEncodeError when uploading files in Django using Supervisor and Gunicorn
Date: 2012-07-21 20:45
Slug: unicodeencodeerror-when-uploading-files-django-usi
Category: Writing

<p>Issues related uploading files with unicode filenames have long history with Django and Linux.</p>
<p>There are many stack overflow <a href="http://stackoverflow.com/questions/3715865/unicodeencodeerror-ascii-codec-cant-encode-character">questions</a> and <a href="http://jj.isgeek.net/2011/06/unicodeencodeerror-on-django-uploaded-files/">blog posts</a> on the subject already, but very few deal with solving the problem when using Supervisord and Gunicorn directly.</p>
<p>If you are using apache2 and mod_python you can configure your as per the docs: </p>
<p><a href="https://code.djangoproject.com/wiki/django_apache_and_mod_wsgi#AdditionalTweaking">https://code.djangoproject.com/wiki/django_apache_and_mod_wsgi#AdditionalTweaking</a></p>
<p>Fundamentally all fixes have the same goal: configure the environment of the server running Django to use the correct locale, so sys.getfilesystemencoding() will return 'UTF-8' instead of 'ANSI_X3.4-1968'. What makes solving this problem especially hard is there are many possible solutions and picking the right one for you situation can be difficult.</p>
<p><strong>Ignore Nginx Related Advice</strong></p>
<p>Since you are using Gunicorn, I am going to guess you are using Nginx and you will come across posts saying you need to add <code>charset utf-8</code> to the http section in the root Nginx config file. Though doing this is probably generally a good idea, it will not solve the problem. Nginx knows nothing about Python, Django or Gunicorn, except that when it makes requests down a unix or TCP socket it gets back bytes. No setting in Nginx will affect the environment Python is running in.</p>
<p><strong>Environment and Supervisord</strong></p>
<p>The most helpful <a href="http://stackoverflow.com/a/10986010/91243">advice</a> is to add a line similar to this:</p>
<pre>
environment=LANG=en_CA.UTF-8,LC_ALL=en_CA.UTF-8,LC_LANG=en_CA.UTF-8
</pre>
<p>To your supervisord.conf file in the [supervisord] section. Your locale maybe different.</p>
<p>This is good advice, but make sure that supervisor has actually read and is using this configuration directive is difficult. Supervisor tries hard not to completely restart since that means all of its processes/services will be forced to restart, but this is one situation where as far as I can tell it is necessary.</p>
<p>Unfortunately you cannot just do <code>/etc/init.d/supervisord restart</code>, since this doesn't really restart anything. You must issue a stop first, then issue a start.</p>
<p>You could potentially add the environment line to a specific supervisord .conf file, but that isn't supported in all versions.</p>
<p>You can use the following test supervisor program to help debug if your locale settings are working or not:</p>
<pre>
[program:locale]
command=python -c "import sys; print sys.getfilesystemencoding();"
directory=/
user=www-data
autostart=true
autorestart=true
redirect_stderr=True
</pre>
<p>You can adjust the settings to suit your purpose.</p>
<p>Also see this very handy blog post on the matter: <a href="http://tech.barszcz.info/2012/05/17/django-unicodeencodeerror-when-uploading-files/">http://tech.barszcz.info/2012/05/17/django-unicodeencodeerror-when-uploading-files/</a>.</p>
<p>If you discover more about how to solve this problem please contact me and I will update this post.</p>
