Title: Disabling Migrations While Testing
Date: 2016-01-06 14:46
Slug: disabling-migrations-while-testing
Category: Writing

<p>If you have a large Django 1.7+ project with a lot of migrations running test even with <code>--keepdb</code> can be slow just because the new  migration framework has to order the migrations even if there is nothing to do.</p>
<p>After a few attempts I have found something which works pretty well for me. In your testing setting you can include the following:</p>
<pre>
class DisableMigrations(object):

    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return "notmigrations"

MIGRATION_MODULES = DisableMigrations()
</pre>
<p>I have found related suggestions on the <a href="https://groups.google.com/forum/#!msg/django-developers/PWPj3etj3-U/kCl6pMsQYYoJ">Django mailing list</a>. Both ideas are presented on <a href="http://stackoverflow.com/questions/25161425/disable-migrations-when-running-unit-tests-in-django-1-7">Stackoverflow</a>.</p>
<p><strong>Update:</strong> Thanks <a href="https://github.com/NotSqrt" target="_blank">NotSqrt</a> for linking me to original <a href="https://gist.github.com/NotSqrt/5f3c76cd15e40ef62d09" target="_blank">Gist</a> I found when I was searching but wasn't able to easily find again :).</p>
