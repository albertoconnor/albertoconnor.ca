Title: Function Based Views Are My First Love
Date: 2012-09-01 16:14
Slug: django-class-based-views-and-domain-specific-langu
Category: Writing

<p>There is something special about your first love. It is possible be too attached and not embrace the new hotness of say Class Based View (CBV). But after having a fling and then dating CBV for a while, I now know that Function Based Views will always have a special place in my heart, and I hope in Django.</p>
<p>Let's look at a FBV:</p>
<pre>
def foo(request, arg, template="foo.html"):
    # Do something
    return render(request,
                  template,
                  dict(bar="bar"))
</pre>
<p>Simple. Beautiful. Easy to follow.</p>
<p>An explicit context filled with exactly what is available in the template and what names those values have. No extra docs needed. Explicit request and response, and the path to get from one to the other is outlined in one place, in one file.</p>
<p>This straight forward approach of FBVs also makes it easier to learn and debug. Most University Computer Science programs are moving away from teaching Object Oriented Programming first and instead focusing on functional and procedural programming because it is easier to learn. There is a time and a place to use the power of classes and in Django CBVs. Consider carefully if your problem is really the kind where you need to use the CBV shaped hammer.</p>
<p><strong>Flat is Beautiful</strong></p>
<p>If you decide to reach for the CBV hammer, I think the flatter and the simpler a hierarchy is, the easier it will be to use. The deeper it goes and the more mixins that are created, the more semantic combinations you can end up with. You may find yourself solving problems which have nothing to do with your original one, but more on that later.</p>
<p>If you look at the Django admin you see it is really one giant flat CBV which is somewhat hard to understand, but easy to extend in specific ways. A better example is the syndication framework, a class which can be specialized in many ways with semantics clearly documented in one place.</p>
<p>Let's say you are going to write some kind of registration app. Instead of passing a bunch of arguments into a FBV, which does get kind of clunky, using CBV enables you to let your client specialize the behaviour to suit their needs. This works well because there is a single flow which could be specialized and because the docs for it could be found in one place. The same kind of thing could also be done by passing a behaviour object to a FBV, but I digress.</p>
<p>A flat CBV used to implement a utility view where there is a single common flow that will be specialized by each user in a subtle different way seems like a good use case. It follows that there are likely apps in contrib which could benefit from providing CBVs. Making CBVs the solution to every problem is a much taller order.</p>
<p><strong>CBVs vs DSLs</strong></p>
<p>Deep hierarchies of CBVs with various mixins can get out of hand. One can look at the new generic views to see an example.</p>
<p>I am reminded of a problem with Domain Specific Languages (DSL). A good DSL can create a powerful platform from which to solve problems, but if you set out to write a new language every time you want to solve a new problem, you will spend your time learning how to write languages and not focusing on your original problems. CBV are similar. You will spend time learning how to get the semantics of your hierarchy right instead of solving whatever problem you originally set out to solve. The deeper and more complex the harder you may find reusing the classes becomes.</p>
<p>It turns out semantics are hard. Hard to write and hard to maintain. Some problems would benefit from a solution built with the power of a reusable class hierarchy, but are you sure that is the first hammer you should reach for? Often using CBVs is akin to prematurely optimizing.</p>
<p>CBVs have a purpose to serve. If they can be made flatter I think it will make them easier to use. Either way FBV are stil my first love and the right way to introduce people to the simplicity of Django. If people advocating Flask can point to Django using FBV and say it is too complex, just imagine what they could say if CBVs became the default.</p>
