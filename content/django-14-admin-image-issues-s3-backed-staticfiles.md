Title: Django 1.4 admin image issues with S3 backed static files
Date: 2012-04-23 13:17
Slug: django-14-admin-image-issues-s3-backed-staticfiles
Category: Writing

<p>This is going to be kind of obscure, but hopefully it helps someone.</p>
<p>My current default setup for using S3 backed static files for Django broke when I upgraded to 1.4. The affect was that the admin media paths had been URL encoded so "/" was replaced with "%2F".</p>
<pre>
https://s3.amazonaws.com/bucket_name/admin%2Fcss%2Fbase.css
</pre>
<p>This caused images referenced in the css to fail because relative paths were interpreted (in Chrome at least) as being relative to the last unescaped slash instead of to /css. This also caused horizontal filters to fail as well.</p>
<h4>The Source</h4>
<p>The problem was exposed by a change in Django 1.4. Since Django no longer uses ADMIN_MEDIA_PREFIX, the storage system gets involved in creating the urls for the admin site media. I had been using a combination of the S3 Python library and django-storages. Django storages is basically doing the right thing, though it does have an opportunity to unescape the paths it gets from S3. The escaping itself is contained S3 library for Python, but I elected to take a different route to work around it.</p>
<h4>Solution</h4>
<p>My solution was to bypass the problem and switch S3Boto backend for django-storages. I have been using Boto for SES based email for a while, and though I found issues using S3Boto back in the day, I figured the different versions have hopefully have stabilized by now.</p>
<p>Switching to the S3Boto backend was painless, except for my AWS creds being included on every admin media url. Fortunately there is a setting to repress this behaviour when all your media is public.</p>
<pre class='"Python'>
STATIC_URL = 'https://BUCKET_NAME.s3.amazonaws.com/'

#DEFAULT_FILE_STORAGE = 'storages.backends.s3.S3Storage'
#STATICFILES_STORAGE = 'storages.backends.s3.S3Storage'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
AWS_QUERYSTRING_AUTH = False # Don't include auth in every url
AWS_STORAGE_BUCKET_NAME = BUCKET_NAME
</pre>
<p>The django-storages docs claim that Boto requires subdomain style access to S3. I am not convinced that is entirely true, but it does seem like a clean way to do it, so I made that switch at the same time.</p>
