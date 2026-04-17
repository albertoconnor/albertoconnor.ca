Title: Python Library for University of Waterloo Open Data API
Date: 2012-04-06 14:28
Slug: python-library-university-waterloo-open-data-api
Category: Writing

<p><a href="http://en.wikipedia.org/wiki/Open_data">Open Data</a> is awesome.</p>
<p>I think there is real value in information made available through flexible standards such as JSON for build the next generation of useful web experiences.</p>
<p>The Open Data initiative at the University of Waterloo has gathered their api at <a href="http://api.uwaterloo.ca/">api.uwaterloo.ca</a> which gives you access to courses, parking, and the weather.</p>
<p>I created a Python library to wrap the API to make it even easier to use:</p>
<p><a href="https://bitbucket.org/amjoconn/uwaterlooapi">https://bitbucket.org/amjoconn/uwaterlooapi</a>*</p>
<p><small>*github version to come soon</small></p>
<pre class="Python">
>>> from uwaterlooapi import UWaterlooAPI
>>> uw = UWaterlooAPI(api_key="YOUR API KEY")
>>> uw.weather()
{u'Date': u'04-01-2012', u'Current': {u'Windchill': u'NA', u'Temp': u'4.1', ...
</pre>
<p>I was bit surprised not to find a Python library designed to make building REST API wrappers easier. My approach, like most API wrappers, is a good start, but lacks the elegance of a solution applied to many different instances of the problem.</p>
<p>Let me know if you create something using this library.</p>
