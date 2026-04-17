Title: Viewport: Making webpages look great on iOS devices
Date: 2012-01-19 13:52
Slug: viewport-making-webpages-look-great-ios-devices
Category: Writing

<pre>
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0">
</pre>
<p>This is the default viewport meta tag found in the very useful <a href="http://html5boilerplate.com/">html5 boilerplate</a>.</p>
<p>If you are like me, and don't initially understand exactly what it does, this default <strong>will</strong> get you into trouble.</p>
<p>The main issue is your website will look great on your computer but when you look at it on an iPhone or iPad it will look small, squished even depending on your CSS. If you happen be making a website which is pixel perfect for the iPhone resolution, then everything will look good, but most websites I develop are meant to be viewed on computer browser and on mobile devices, so knowing what the viewport meta tag does helps you look great everywhere.</p>
<strong>What is the viewport</strong>
<p>The viewport is the space your webpage will rendered into. Think of it like the size of the browser window. When you zoom, you are zooming into the viewport, but the size of the viewport doesn't change. You can zoom out of the viewport either, though if the page is wider than the viewport you can scroll to see more.</p>
<p>The above viewport meta tag says make the viewport the same size as the device's screen width and a 1:1 scale, pixel perfect. In the case of an iPhone that means 320px wide. If your CSS is designed for 800px of minimum width your page is guaranteed to look bad.</p>
<p>You can specify any default width in pixels, and default scale or let the scale be determined automatically.</p>
<p>For more detail you can consult the in-depth Apple documentation on the <a href="http://developer.apple.com/library/IOs/#documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html">viewport meta tag</a>.</p>
<strong>Looking good everywhere</strong>
<p>If you have designed your website to be rendered at a minimum width of say 1000 pixels, you can make it look great on a computer and on a mobile device with the following meta tag:</p>
<pre>
&lt;meta name="viewport" content="width=1000">
</pre>
<p>This will make the viewport, the space the website renders into, 1000 pixels wide, and default the scaling to show the entire width.</p>
<p>By default if no viewport meta tag is provided a default viewport width 985 pixel is used, which will actually works well for most sites. If you want your site to look really good and you have an optimal width of  600 pixels, explicitly setting the viewport width to 600 pixels ("width=600") will make it look just as you intend. If your sites optimal width is smaller than 985 pixel it is good to be explicit, otherwise your pages might appear kind of far away and the user will have to manually zoom in.</p>
