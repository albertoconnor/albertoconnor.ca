Title: jQuery fallback for HTML5 placeholder attribute
Date: 2011-08-21 19:56
Slug: jquery-fallback-html5-placeholder-attribute
Category: Writing

<p>If you google placeholder and jQuery you quickly find some handy code for a javascript fallback for the HTML5 placeholder functionality:</p>
<p><a href="https://gist.github.com/379601">https://gist.github.com/379601</a></p>
<p>If you want to read more check out the <a href="http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html">blog post</a>.</p>
<p>As written this will always override the built in browser behaviour, and it isn't as good as the built in behaviour. We only want this code to be registered if the current browser doesn't natively support placeholder, fortunately detection is easy thanks to Dive Into HTML5</p>
<p><a href="http://diveintohtml5.org/everything.html#placeholder">http://diveintohtml5.org/everything.html#placeholder</a></p>
<p>This leads to this combination of code:</p>
<div class="highlight"><pre><span class="k">if</span>  <span class="p">(</span><span class="o">!</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span> <span class="k">in</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="s1">&#39;input&#39;</span><span class="p">))</span> <span class="o">||</span> <span class="o">!</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span> <span class="k">in</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="s1">&#39;textarea&#39;</span><span class="p">)))</span> <span class="p">{</span>
    <span class="nx">$</span><span class="p">(</span><span class="nb">document</span><span class="p">).</span><span class="nx">ready</span><span class="p">(</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
        <span class="nx">$</span><span class="p">(</span><span class="s1">&#39;[placeholder]&#39;</span><span class="p">).</span><span class="nx">focus</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
          <span class="kd">var</span> <span class="nx">input</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
          <span class="k">if</span> <span class="p">(</span><span class="nx">input</span><span class="p">.</span><span class="nx">val</span><span class="p">()</span> <span class="o">==</span> <span class="nx">input</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span><span class="p">))</span> <span class="p">{</span>
            <span class="nx">input</span><span class="p">.</span><span class="nx">val</span><span class="p">(</span><span class="s1">&#39;&#39;</span><span class="p">);</span>
            <span class="nx">input</span><span class="p">.</span><span class="nx">removeClass</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span><span class="p">);</span>
          <span class="p">}</span>
        <span class="p">}).</span><span class="nx">blur</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
          <span class="kd">var</span> <span class="nx">input</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
          <span class="k">if</span> <span class="p">(</span><span class="nx">input</span><span class="p">.</span><span class="nx">val</span><span class="p">()</span> <span class="o">==</span> <span class="s1">&#39;&#39;</span> <span class="o">||</span> <span class="nx">input</span><span class="p">.</span><span class="nx">val</span><span class="p">()</span> <span class="o">==</span> <span class="nx">input</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span><span class="p">))</span> <span class="p">{</span>
            <span class="nx">input</span><span class="p">.</span><span class="nx">addClass</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span><span class="p">);</span>
            <span class="nx">input</span><span class="p">.</span><span class="nx">val</span><span class="p">(</span><span class="nx">input</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span><span class="p">));</span>
          <span class="p">}</span>
        <span class="p">}).</span><span class="nx">blur</span><span class="p">().</span><span class="nx">parents</span><span class="p">(</span><span class="s1">&#39;form&#39;</span><span class="p">).</span><span class="nx">submit</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
          <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">).</span><span class="nx">find</span><span class="p">(</span><span class="s1">&#39;[placeholder]&#39;</span><span class="p">).</span><span class="nx">each</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
            <span class="kd">var</span> <span class="nx">input</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
            <span class="k">if</span> <span class="p">(</span><span class="nx">input</span><span class="p">.</span><span class="nx">val</span><span class="p">()</span> <span class="o">==</span> <span class="nx">input</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;placeholder&#39;</span><span class="p">))</span> <span class="p">{</span>
              <span class="nx">input</span><span class="p">.</span><span class="nx">val</span><span class="p">(</span><span class="s1">&#39;&#39;</span><span class="p">);</span>
            <span class="p">}</span>
          <span class="p">})</span>
        <span class="p">});</span>
    <span class="p">});</span>
<span class="p">}</span>
</pre></div>
<p>The code makes the somewhat broad assumption that no browser supports placeholder for an input but not for a textarea, or if it did, the behaviour shouldn't be overridden. Part of the appeal for HTML5 for me is the ability to provide great user experience for those on modern browser and good experiences on those forced not to upgrade.</p>
