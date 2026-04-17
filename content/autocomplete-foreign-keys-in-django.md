Title: Autocomplete for Foreign Keys in the Django Admin Explained
Date: 2010-09-03 21:26
Slug: autocomplete-foreign-keys-in-django
Category: Writing

<p>When the select drop-down for foreign keys in the Django Admin gets big it can become a usability issue.  One solution is to create a custom UI for the the model, but stretching the Django Admin to the limit is one of the fun parts of working with Django.</p>
<h4>Prior Art</h4>
<p>The top hit on Google is <a href="http://code.google.com/p/django-autocomplete/">django-autocomplete</a>.  This project is the basis of my approach and therefore much thanks goes to the author.  There hasn't been an update since early 2009 and I wasn't able to get it working without a lot of changes.  The changes evolved into what I consider a better approach.</p>
<p>Another interesting project is <a href="http://code.google.com/p/django-ajax-selects/">django-ajax-selects</a> which is very fancy, complicated looking and actively maintained.  It allows for very pretty autocompletes.  My solution does it without any AJAX so it is a bit easier to use and makes for an easier case study.  An AJAX based solution solves another critical problem: the drop down being so large it takes a long time for the admin page to render.  Raw id fields also help to solve this problem albeit in a less elegant way.</p>
<p>There are a few other projects, some using YUI, some focusing on many to many fields.  The solution presented here is jQuery based and for foreign keys in the admin only.  This post attempts to explain the solution end to end and is based on Django 1.2.x.</p>
<h4>Progressive Enhancement</h4>
<a href="http://en.wikipedia.org/wiki/Progressive_enhancement">Progressive enhancement</a> is one of the key benefits of my approach.  Instead of having a hidden input element to hold the real id of the foreign object, I actually keep the select drop-down and merely hide it and show the autocomplete field if Javascript is enabled.
<h4>Usage</h4>

Once complete, using it will look something like this inside an admin.py file:

<div class="highlight"><pre><span class="n">admin</span><span class="o">.</span><span class="n">site</span><span class="o">.</span><span class="n">register</span><span class="p">(</span><span class="n">Foreign</span><span class="p">,</span> <span class="n">AutocompleteTargetModelAdmin</span><span class="p">)</span>
    
<span class="k">class</span> <span class="nc">MainAdmin</span><span class="p">(</span><span class="n">AutocompleteModelAdmin</span><span class="p">):</span>
    <span class="c">#...</span>
    <span class="n">autocomplete_fields</span> <span class="o">=</span> <span class="p">(</span><span class="s">&#39;foreign&#39;</span><span class="p">,)</span>
    <span class="c">#...</span>

<span class="n">admin</span><span class="o">.</span><span class="n">site</span><span class="o">.</span><span class="n">register</span><span class="p">(</span><span class="n">Main</span><span class="p">,</span> <span class="n">MainAdmin</span><span class="p">)</span>
</pre></div>


Where the Main model has a ForeignKey, foreign, to the model named Foreign.

<h4>What You Will Need</h4>
<p>In addition to Django you will need:</p>
<ul>
<li><a href="http://www.jquery.com">jquery</a></li>
<li><a href="http://docs.jquery.com/Plugins/Autocomplete">jquery.autocomplete</a></li>
</ul>
<h4>Getting The Autocomplete Data</h4>
<p>Normally the hard part is providing an AJAX response from some url, for which you have to define a view which provides the possible values.  Requiring the client to do this every time is undesirable.  There is a simpler way. Autocomplete can also work on static arrays, and since the drop-down is static it should work just as well.  Actually, the select drop-down we are keeping hidden <strong>is</strong> a static list of possible values!  We will use the select to generate a static array of values to populate the autocomplete.</p>
<h4>The New Hard Part</h4>
<p>The only really hard part left is keeping the "+" adding of items in the Django Admin working.  This will force us to do one zany thing: require that our foreign model's admin class is a subclass of a special class we provide, the so called AutocompleteTargetAdminModel.  More on this shortly.</p>
<h4>Let's Do It</h4>
<p>Now that you have some idea of what is coming let's get started.  Define a separate app called something clever like "autocomplete".  It will contain an admin.py file (abuse of naming: we will be subclassing classes in django.contrib.admin rather than defining new admin classes like in a regular app admin.py file) and a widget.py file where a custom widget is defined.</p>
<p>Starting with widget.py.  The ForeignKeyAutocompleteInput is based the ForeignKeySearchInput in the source of <a href="http://code.google.com/p/django-autocomplete/source/browse/trunk/widgets.py">django-autocomplete</a>.  The major difference is I hide the original select widget with Javascript instead of using a hidden widget.</p>
<div class="highlight"><pre><span class="kn">from</span> <span class="nn">django.conf</span> <span class="kn">import</span> <span class="n">settings</span>
<span class="kn">from</span> <span class="nn">django</span> <span class="kn">import</span> <span class="n">forms</span>
<span class="kn">from</span> <span class="nn">django.db</span> <span class="kn">import</span> <span class="n">models</span>

<span class="kn">from</span> <span class="nn">django.utils.safestring</span> <span class="kn">import</span> <span class="n">mark_safe</span>

<span class="k">class</span> <span class="nc">ForeignKeyAutocompleteInput</span><span class="p">(</span><span class="n">forms</span><span class="o">.</span><span class="n">widgets</span><span class="o">.</span><span class="n">Select</span><span class="p">):</span>
    <span class="k">class</span> <span class="nc">Media</span><span class="p">:</span>
        <span class="n">css</span> <span class="o">=</span> <span class="p">{</span>
                <span class="s">&#39;all&#39;</span><span class="p">:</span> <span class="p">(</span><span class="s">&#39;</span><span class="si">%s</span><span class="s">/css/jquery.autocomplete.css&#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,)</span>
        <span class="p">}</span>
        <span class="n">js</span> <span class="o">=</span> <span class="p">(</span>
                <span class="s">&#39;</span><span class="si">%s</span><span class="s">/js/jquery.js&#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,</span>
                <span class="s">&#39;</span><span class="si">%s</span><span class="s">/js/jquery.autocomplete.js&#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,</span>
                <span class="s">&#39;</span><span class="si">%s</span><span class="s">/js/autocomplete.popup.js &#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span>
        <span class="p">)</span>

    <span class="k">def</span> <span class="nf">text_field_value</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">value</span><span class="p">):</span>
        <span class="n">key</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">get_related_field</span><span class="p">()</span><span class="o">.</span><span class="n">name</span>
        <span class="n">obj</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">to</span><span class="o">.</span><span class="n">_default_manager</span><span class="o">.</span><span class="n">get</span><span class="p">(</span><span class="o">**</span><span class="p">{</span><span class="n">key</span><span class="p">:</span> <span class="n">value</span><span class="p">})</span>
        
        <span class="k">return</span> <span class="nb">unicode</span><span class="p">(</span><span class="n">obj</span><span class="p">)</span>

    <span class="k">def</span> <span class="nf">__init__</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">rel</span><span class="p">,</span> <span class="n">attrs</span><span class="o">=</span><span class="bp">None</span><span class="p">):</span>
        <span class="sd">&quot;&quot;&quot;</span>
<span class="sd">        rel - the relation for the foreign key.</span>
<span class="sd">        &quot;&quot;&quot;</span>
        <span class="bp">self</span><span class="o">.</span><span class="n">rel</span> <span class="o">=</span> <span class="n">rel</span>
        <span class="nb">super</span><span class="p">(</span><span class="n">ForeignKeyAutocompleteInput</span><span class="p">,</span> <span class="bp">self</span><span class="p">)</span><span class="o">.</span><span class="n">__init__</span><span class="p">(</span><span class="n">attrs</span><span class="p">)</span>

    <span class="k">def</span> <span class="nf">render</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">name</span><span class="p">,</span> <span class="n">value</span><span class="p">,</span> <span class="n">attrs</span><span class="o">=</span><span class="bp">None</span><span class="p">):</span>
        <span class="k">if</span> <span class="n">attrs</span> <span class="ow">is</span> <span class="bp">None</span><span class="p">:</span>
            <span class="n">attrs</span> <span class="o">=</span> <span class="p">{}</span>
        <span class="n">rendered</span> <span class="o">=</span> <span class="nb">super</span><span class="p">(</span><span class="n">ForeignKeyAutocompleteInput</span><span class="p">,</span> <span class="bp">self</span><span class="p">)</span><span class="o">.</span><span class="n">render</span><span class="p">(</span><span class="n">name</span><span class="p">,</span> <span class="n">value</span><span class="p">,</span> <span class="n">attrs</span><span class="p">)</span>
        <span class="k">if</span> <span class="n">value</span><span class="p">:</span>
            <span class="n">text_field_value</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">text_field_value</span><span class="p">(</span><span class="n">value</span><span class="p">)</span>
        <span class="k">else</span><span class="p">:</span>
            <span class="n">text_field_value</span> <span class="o">=</span> <span class="s">u&#39;&#39;</span>
        <span class="k">return</span> <span class="n">rendered</span> <span class="o">+</span> <span class="n">mark_safe</span><span class="p">(</span><span class="s">u&#39;&#39;&#39;</span>
<span class="s">#</span>
<span class="s"># Insert javascript wrapped in HTML as listed below here</span>
<span class="s">#</span>
<span class="s">                &#39;&#39;&#39;</span><span class="p">)</span> <span class="o">%</span> <span class="p">{</span>
                        <span class="s">&#39;MEDIA_URL&#39;</span><span class="p">:</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,</span>
                        <span class="s">&#39;model_name&#39;</span><span class="p">:</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">to</span><span class="o">.</span><span class="n">_meta</span><span class="o">.</span><span class="n">module_name</span><span class="p">,</span>
                        <span class="s">&#39;app_label&#39;</span><span class="p">:</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">to</span><span class="o">.</span><span class="n">_meta</span><span class="o">.</span><span class="n">app_label</span><span class="p">,</span>
                        <span class="s">&#39;text_field_value&#39;</span><span class="p">:</span> <span class="n">text_field_value</span><span class="p">,</span>
                        <span class="s">&#39;name&#39;</span><span class="p">:</span> <span class="n">name</span><span class="p">,</span>
                        <span class="s">&#39;value&#39;</span><span class="p">:</span> <span class="n">value</span><span class="p">,</span>
                <span class="p">}</span>
</pre></div>

<p>Let us focus on the key parts one at a time.  First we define an internal class called Media which defines the external resources required to render.</p>
<div class="highlight"><pre><span class="k">class</span> <span class="nc">Media</span><span class="p">:</span>
    <span class="n">css</span> <span class="o">=</span> <span class="p">{</span>
            <span class="s">&#39;all&#39;</span><span class="p">:</span> <span class="p">(</span><span class="s">&#39;</span><span class="si">%s</span><span class="s">css/jquery.autocomplete.css&#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,)</span>
    <span class="p">}</span>
    <span class="n">js</span> <span class="o">=</span> <span class="p">(</span>
            <span class="s">&#39;</span><span class="si">%s</span><span class="s">/js/jquery.js&#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,</span>
            <span class="s">&#39;</span><span class="si">%s</span><span class="s">/js/jquery.autocomplete.js&#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,</span>
            <span class="s">&#39;</span><span class="si">%s</span><span class="s">/js/autocomplete.popup.js &#39;</span> <span class="o">%</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span>
    <span class="p">)</span>
</pre></div>

<p>We require jQuery and jquery.autocomplete which provides the jquery.autocomplete.css.  We will need to write a bit of Javascript which I called autocomplete.popup.js to support adding new values.</p>
<p>Next we write some boiler plate the widget class needs to work.</p>
<div class="highlight"><pre><span class="k">def</span> <span class="nf">text_field_value</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">value</span><span class="p">):</span>
    <span class="n">key</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">get_related_field</span><span class="p">()</span><span class="o">.</span><span class="n">name</span>
    <span class="n">obj</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">to</span><span class="o">.</span><span class="n">_default_manager</span><span class="o">.</span><span class="n">get</span><span class="p">(</span><span class="o">**</span><span class="p">{</span><span class="n">key</span><span class="p">:</span> <span class="n">value</span><span class="p">})</span>
    
    <span class="k">return</span> <span class="nb">unicode</span><span class="p">(</span><span class="n">obj</span><span class="p">)</span>

<span class="k">def</span> <span class="nf">__init__</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">rel</span><span class="p">,</span> <span class="n">attrs</span><span class="o">=</span><span class="bp">None</span><span class="p">):</span>
    <span class="sd">&quot;&quot;&quot;</span>
<span class="sd">    rel - the relation for the foreign key.</span>
<span class="sd">    &quot;&quot;&quot;</span>
    <span class="bp">self</span><span class="o">.</span><span class="n">rel</span> <span class="o">=</span> <span class="n">rel</span>
    <span class="nb">super</span><span class="p">(</span><span class="n">ForeignKeyAutocompleteInput</span><span class="p">,</span> <span class="bp">self</span><span class="p">)</span><span class="o">.</span><span class="n">__init__</span><span class="p">(</span><span class="n">attrs</span><span class="p">)</span>
</pre></div>

<p>The interesting bit is render.</p>
<div class="highlight"><pre><span class="k">def</span> <span class="nf">render</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">name</span><span class="p">,</span> <span class="n">value</span><span class="p">,</span> <span class="n">attrs</span><span class="o">=</span><span class="bp">None</span><span class="p">):</span>
    <span class="k">if</span> <span class="n">attrs</span> <span class="ow">is</span> <span class="bp">None</span><span class="p">:</span>
        <span class="n">attrs</span> <span class="o">=</span> <span class="p">{}</span>
    <span class="n">rendered</span> <span class="o">=</span> <span class="nb">super</span><span class="p">(</span><span class="n">ForeignKeyAutocompleteInput</span><span class="p">,</span> <span class="bp">self</span><span class="p">)</span><span class="o">.</span><span class="n">render</span><span class="p">(</span><span class="n">name</span><span class="p">,</span> <span class="n">value</span><span class="p">,</span> <span class="n">attrs</span><span class="p">)</span>
    <span class="k">if</span> <span class="n">value</span><span class="p">:</span>
        <span class="n">text_field_value</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">text_field_value</span><span class="p">(</span><span class="n">value</span><span class="p">)</span>
    <span class="k">else</span><span class="p">:</span>
        <span class="n">text_field_value</span> <span class="o">=</span> <span class="s">u&#39;&#39;</span>
    <span class="k">return</span> <span class="n">rendered</span> <span class="o">+</span> <span class="n">mark_safe</span><span class="p">(</span><span class="s">u&#39;&#39;&#39;</span>
</pre></div>

<p>This is followed by a huge Javascript filled string which is the real meat of what we are doing here.  We have rendered the select normally and in the very last line we append a bunch of additional HTML which includes the autocomplete widget and the Javascript to create the array of possible values and pass it into an .autocomplete function.</p>
<div class="highlight"><pre><span class="o">&lt;</span><span class="nx">input</span> <span class="nx">type</span><span class="o">=</span><span class="s2">&quot;text&quot;</span> <span class="nx">id</span><span class="o">=</span><span class="s2">&quot;lookup_%(name)s&quot;</span> <span class="nx">value</span><span class="o">=</span><span class="s2">&quot;%(text_field_value)s&quot;</span> <span class="nx">size</span><span class="o">=</span><span class="s2">&quot;40&quot;</span> <span class="nx">style</span><span class="o">=</span><span class="s2">&quot;display: none;&quot;</span><span class="o">/&gt;</span>
<span class="o">&lt;</span><span class="nx">script</span> <span class="nx">type</span><span class="o">=</span><span class="s2">&quot;text/javascript&quot;</span><span class="o">&gt;</span>

<span class="nx">$</span><span class="p">(</span><span class="nb">document</span><span class="p">).</span><span class="nx">ready</span><span class="p">(</span><span class="kd">function</span><span class="p">(){</span>
    <span class="c1">// Javascript is required to show the autocomplete field and hide the select field.</span>
    <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#id_%(name)s&quot;</span><span class="p">).</span><span class="nx">hide</span><span class="p">();</span>
    <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#lookup_%(name)s&quot;</span><span class="p">).</span><span class="nx">show</span><span class="p">();</span>

    <span class="kd">function</span> <span class="nx">liFormat_</span><span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s</span> <span class="p">(</span><span class="nx">row</span><span class="p">,</span> <span class="nx">i</span><span class="p">,</span> <span class="nx">num</span><span class="p">)</span> <span class="p">{</span>
            <span class="kd">var</span> <span class="nx">result</span> <span class="o">=</span> <span class="nx">row</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="p">;</span>
            <span class="k">return</span> <span class="nx">result</span><span class="p">;</span>
    <span class="p">}</span>
    
    <span class="kd">var</span> <span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_data</span> <span class="o">=</span> <span class="nb">Array</span><span class="p">();</span>
    <span class="kd">var</span> <span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_id_map</span> <span class="o">=</span> <span class="p">{};</span>
    
    <span class="kd">function</span> <span class="nx">load_autocomplete_data_from_select</span><span class="p">()</span> <span class="p">{</span>
        <span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_data</span> <span class="o">=</span> <span class="nb">Array</span><span class="p">();</span>
        <span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_id_map</span> <span class="o">=</span> <span class="p">{};</span>
        <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#id_%(name)s option&quot;</span><span class="p">).</span><span class="nx">each</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">d</span><span class="p">)</span> <span class="p">{</span>
            <span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_data</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">).</span><span class="nx">html</span><span class="p">());</span>
            <span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_id_map</span><span class="p">[</span><span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">).</span><span class="nx">html</span><span class="p">()]</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">).</span><span class="nx">val</span><span class="p">();</span>
        <span class="p">})</span>
        
        <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#lookup_%(name)s&quot;</span><span class="p">).</span><span class="nx">autocomplete</span><span class="p">(</span><span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_data</span><span class="p">,</span> <span class="p">{</span>
            <span class="nx">delay</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span>
            <span class="nx">minChars</span><span class="o">:</span><span class="mi">1</span><span class="p">,</span>
            <span class="nx">matchSubset</span><span class="o">:</span><span class="mi">1</span><span class="p">,</span>
            <span class="nx">autoFill</span><span class="o">:</span><span class="kc">false</span><span class="p">,</span>
            <span class="nx">matchContains</span><span class="o">:</span><span class="mi">1</span><span class="p">,</span>
            <span class="nx">cacheLength</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span>
            <span class="nx">selectFirst</span><span class="o">:</span><span class="kc">true</span><span class="p">,</span>
            <span class="nx">formatItem</span><span class="o">:</span><span class="nx">liFormat_</span><span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s</span><span class="p">,</span>
            <span class="nx">maxItemsToShow</span><span class="o">:</span><span class="mi">10</span>
        <span class="p">});</span> 
    <span class="p">}</span>
    
    <span class="nx">load_autocomplete_data_from_select</span><span class="p">();</span> <span class="c1">// Inital load</span>
    
    <span class="c1">// Changing the autocomplete field needs to change the hidden select field</span>
    <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#lookup_%(name)s&quot;</span><span class="p">).</span><span class="nx">change</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
        <span class="nx">new_value</span> <span class="o">=</span> <span class="o">%</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span><span class="nx">s_id_map</span><span class="p">[</span><span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">).</span><span class="nx">val</span><span class="p">()];</span>
        <span class="k">if</span> <span class="p">(</span><span class="nx">new_value</span> <span class="o">==</span> <span class="kc">undefined</span><span class="p">)</span> <span class="p">{</span>
            <span class="nx">new_value</span> <span class="o">=</span> <span class="s2">&quot;&quot;</span>
        <span class="p">}</span>
        <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#id_%(name)s&quot;</span><span class="p">).</span><span class="nx">val</span><span class="p">(</span><span class="nx">new_value</span><span class="p">);</span> 
    <span class="p">})</span>
    
    <span class="c1">// It is possible to &quot;change&quot; the autocomplete text field and have the change</span>
    <span class="c1">// event not happen.  This double checks right before we submit.</span>
    <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;form&quot;</span><span class="p">).</span><span class="nx">submit</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
        <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#lookup_%(name)s&quot;</span><span class="p">).</span><span class="nx">change</span><span class="p">();</span> <span class="c1">// Just to make sure</span>
    <span class="p">})</span>
    
    <span class="c1">// When the add feature is used, it only knows how to change the select field</span>
    <span class="c1">// so the auto complete field needs to be updated too.</span>
    <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#id_%(name)s&quot;</span><span class="p">).</span><span class="nx">change</span><span class="p">(</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span>
        <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#lookup_%(name)s&quot;</span><span class="p">).</span><span class="nx">val</span><span class="p">(</span><span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">).</span><span class="nx">find</span><span class="p">(</span><span class="s2">&quot;option:selected&quot;</span><span class="p">).</span><span class="nx">html</span><span class="p">());</span>
        <span class="nx">load_autocomplete_data_from_select</span><span class="p">();</span> <span class="c1">// Could be a new value from an add</span>
    <span class="p">})</span>    
<span class="p">});</span>
<span class="o">&lt;</span><span class="err">/script&gt;</span>
</pre></div>

<p>We pass some values into the Javascript block allowing us to do some % substitution.  For example the name of the field will be unique on the page so we can use for ids.</p>
<div class="highlight"><pre><span class="p">)</span> <span class="o">%</span> <span class="p">{</span>
        <span class="s">&#39;MEDIA_URL&#39;</span><span class="p">:</span> <span class="n">settings</span><span class="o">.</span><span class="n">MEDIA_URL</span><span class="p">,</span>
        <span class="s">&#39;model_name&#39;</span><span class="p">:</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">to</span><span class="o">.</span><span class="n">_meta</span><span class="o">.</span><span class="n">module_name</span><span class="p">,</span>
        <span class="s">&#39;app_label&#39;</span><span class="p">:</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">to</span><span class="o">.</span><span class="n">_meta</span><span class="o">.</span><span class="n">app_label</span><span class="p">,</span>
        <span class="s">&#39;text_field_value&#39;</span><span class="p">:</span> <span class="n">text_field_value</span><span class="p">,</span>
        <span class="s">&#39;name&#39;</span><span class="p">:</span> <span class="n">name</span><span class="p">,</span>
        <span class="s">&#39;value&#39;</span><span class="p">:</span> <span class="n">value</span><span class="p">,</span>
<span class="p">}</span>
</pre></div>

<h4>Admin Integration</h4>
<p>The widget is handy, and could probably be used alone pretty effectively.  But to support adding new values, and to make it much easier to use, some deep admin integration is handy.  This approach might not be extremely future-proof, but I have tried to cut down on the zany-ness.</p>
<p>admin.py is also based on <a href="http://code.google.com/p/django-autocomplete/source/browse/trunk/widgets.py">django-autocomplete</a>.  The big change is splitting up the AdminModel subclasses into a target and main variants.</p>
<p>Let's look at it in four parts.  First import a bunch of stuff.  We are going deep into Django so we will need a lot of utils functions.</p>
<div class="highlight"><pre><span class="kn">from</span> <span class="nn">django.conf</span> <span class="kn">import</span> <span class="n">settings</span>
<span class="kn">from</span> <span class="nn">django.contrib</span> <span class="kn">import</span> <span class="n">admin</span>
<span class="kn">from</span> <span class="nn">django.db</span> <span class="kn">import</span> <span class="n">models</span>

<span class="kn">from</span> <span class="nn">django.utils.safestring</span> <span class="kn">import</span> <span class="n">mark_safe</span>
<span class="kn">from</span> <span class="nn">django.utils.translation</span> <span class="kn">import</span> <span class="n">ugettext</span> <span class="k">as</span> <span class="n">_</span>
<span class="kn">from</span> <span class="nn">django.utils.html</span> <span class="kn">import</span> <span class="n">escape</span>
<span class="kn">from</span> <span class="nn">django.utils.encoding</span> <span class="kn">import</span> <span class="n">force_unicode</span>

<span class="kn">from</span> <span class="nn">django.contrib.auth.models</span> <span class="kn">import</span> <span class="n">Message</span>
<span class="kn">from</span> <span class="nn">django.http</span> <span class="kn">import</span> <span class="n">HttpResponse</span><span class="p">,</span> <span class="n">HttpResponseNotFound</span><span class="p">,</span> <span class="n">HttpResponseRedirect</span>

<span class="kn">from</span> <span class="nn">widgets</span> <span class="kn">import</span> <span class="n">ForeignKeyAutocompleteInput</span>
</pre></div>

<p>Moving quickly on we have the part which makes</p>
<div class="highlight"><pre><span class="n">autocomplete_fields</span> <span class="o">=</span> <span class="p">(</span><span class="s">&#39;foreign&#39;</span><span class="p">,)</span>
</pre></div>

<p>work.</p>
<div class="highlight"><pre><span class="k">class</span> <span class="nc">AutocompleteModelAdmin</span><span class="p">(</span><span class="n">admin</span><span class="o">.</span><span class="n">ModelAdmin</span><span class="p">):</span>
    <span class="k">def</span> <span class="nf">formfield_for_dbfield</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">db_field</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">):</span>
        <span class="c"># For ForeignKey use a special Autocomplete widget.</span>
        <span class="k">if</span> <span class="nb">isinstance</span><span class="p">(</span><span class="n">db_field</span><span class="p">,</span> <span class="n">models</span><span class="o">.</span><span class="n">ForeignKey</span><span class="p">)</span> <span class="ow">and</span> <span class="nb">hasattr</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="s">&quot;autocomplete_fields&quot;</span><span class="p">)</span> <span class="ow">and</span> <span class="n">db_field</span><span class="o">.</span><span class="n">name</span> <span class="ow">in</span> <span class="bp">self</span><span class="o">.</span><span class="n">autocomplete_fields</span><span class="p">:</span>
            <span class="n">kwargs</span><span class="p">[</span><span class="s">&#39;widget&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="n">ForeignKeyAutocompleteInput</span><span class="p">(</span><span class="n">db_field</span><span class="o">.</span><span class="n">rel</span><span class="p">)</span>
            <span class="c"># extra HTML to the end of the rendered output.</span>
            <span class="k">if</span> <span class="s">&#39;request&#39;</span> <span class="ow">in</span> <span class="n">kwargs</span><span class="o">.</span><span class="n">keys</span><span class="p">():</span>
                <span class="n">kwargs</span><span class="o">.</span><span class="n">pop</span><span class="p">(</span><span class="s">&#39;request&#39;</span><span class="p">)</span>
                                                        
            <span class="n">formfield</span> <span class="o">=</span> <span class="n">db_field</span><span class="o">.</span><span class="n">formfield</span><span class="p">(</span><span class="o">**</span><span class="n">kwargs</span><span class="p">)</span>
            <span class="c"># Don&#39;t wrap raw_id fields. Their add function is in the popup window.</span>
            <span class="k">if</span> <span class="ow">not</span> <span class="n">db_field</span><span class="o">.</span><span class="n">name</span> <span class="ow">in</span> <span class="bp">self</span><span class="o">.</span><span class="n">raw_id_fields</span><span class="p">:</span>
                <span class="c"># formfield can be None if it came from a OneToOneField with</span>
                <span class="c"># parent_link=True</span>
                <span class="k">if</span> <span class="n">formfield</span> <span class="ow">is</span> <span class="ow">not</span> <span class="bp">None</span><span class="p">:</span>
                    <span class="n">formfield</span><span class="o">.</span><span class="n">widget</span> <span class="o">=</span> <span class="n">AutocompleteWidgetWrapper</span><span class="p">(</span><span class="n">formfield</span><span class="o">.</span><span class="n">widget</span><span class="p">,</span> <span class="n">db_field</span><span class="o">.</span><span class="n">rel</span><span class="p">,</span> <span class="bp">self</span><span class="o">.</span><span class="n">admin_site</span><span class="p">)</span>
            <span class="k">return</span> <span class="n">formfield</span>

        <span class="k">return</span> <span class="nb">super</span><span class="p">(</span><span class="n">AutocompleteModelAdmin</span><span class="p">,</span> <span class="bp">self</span><span class="p">)</span><span class="o">.</span><span class="n">formfield_for_dbfield</span><span class="p">(</span><span class="n">db_field</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">)</span>
</pre></div>

<p>One class overriding one function.  If the field is a ForeignKey and is named in autocomplete_fields, then we use our widget from above, and do a bit of funky wrapping to make the "+" appear.  More on the AutocompleteWidgetWrapper later.</p>
<p>I have separated out the next class.  We use it on models we are targeting with an autocomplete field like this.</p>
<div class="highlight"><pre><span class="n">admin</span><span class="o">.</span><span class="n">site</span><span class="o">.</span><span class="n">register</span><span class="p">(</span><span class="n">Foreign</span><span class="p">,</span> <span class="n">AutocompleteTargetModelAdmin</span><span class="p">)</span>
</pre></div>

<p>The class looks like this:</p>
<div class="highlight"><pre><span class="k">class</span> <span class="nc">AutocompleteTargetModelAdmin</span><span class="p">(</span><span class="n">admin</span><span class="o">.</span><span class="n">ModelAdmin</span><span class="p">):</span>        

    <span class="k">def</span> <span class="nf">response_add</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">request</span><span class="p">,</span> <span class="n">obj</span><span class="p">,</span> <span class="n">post_url_continue</span><span class="o">=</span><span class="s">&#39;../</span><span class="si">%s</span><span class="s">/&#39;</span><span class="p">):</span>
        <span class="sd">&quot;&quot;&quot;</span>
<span class="sd">        Determines the HttpResponse for the add_view stage.</span>
<span class="sd">        &quot;&quot;&quot;</span>
        <span class="n">opts</span> <span class="o">=</span> <span class="n">obj</span><span class="o">.</span><span class="n">_meta</span>
        <span class="n">pk_value</span> <span class="o">=</span> <span class="n">obj</span><span class="o">.</span><span class="n">_get_pk_val</span><span class="p">()</span>
        
        <span class="n">msg</span> <span class="o">=</span> <span class="n">_</span><span class="p">(</span><span class="s">&#39;The </span><span class="si">%(name)s</span><span class="s"> &quot;</span><span class="si">%(obj)s</span><span class="s">&quot; was added successfully.&#39;</span><span class="p">)</span> <span class="o">%</span> <span class="p">{</span><span class="s">&#39;name&#39;</span><span class="p">:</span> <span class="n">force_unicode</span><span class="p">(</span><span class="n">opts</span><span class="o">.</span><span class="n">verbose_name</span><span class="p">),</span> <span class="s">&#39;obj&#39;</span><span class="p">:</span> <span class="n">force_unicode</span><span class="p">(</span><span class="n">obj</span><span class="p">)}</span>
        <span class="c"># Here, we distinguish between different save types by checking for</span>
        <span class="c"># the presence of keys in request.POST.</span>
        <span class="k">if</span> <span class="n">request</span><span class="o">.</span><span class="n">POST</span><span class="o">.</span><span class="n">has_key</span><span class="p">(</span><span class="s">&quot;_continue&quot;</span><span class="p">):</span>
                <span class="bp">self</span><span class="o">.</span><span class="n">message_user</span><span class="p">(</span><span class="n">request</span><span class="p">,</span> <span class="n">msg</span> <span class="o">+</span> <span class="s">&#39; &#39;</span> <span class="o">+</span> <span class="n">_</span><span class="p">(</span><span class="s">&quot;You may edit it again below.&quot;</span><span class="p">))</span>
                <span class="k">if</span> <span class="n">request</span><span class="o">.</span><span class="n">POST</span><span class="o">.</span><span class="n">has_key</span><span class="p">(</span><span class="s">&quot;_popup&quot;</span><span class="p">):</span>
                        <span class="n">post_url_continue</span> <span class="o">+=</span> <span class="s">&quot;?_popup=</span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="n">request</span><span class="o">.</span><span class="n">POST</span><span class="o">.</span><span class="n">get</span><span class="p">(</span><span class="s">&#39;_popup&#39;</span><span class="p">)</span>
                <span class="k">return</span> <span class="n">HttpResponseRedirect</span><span class="p">(</span><span class="n">post_url_continue</span> <span class="o">%</span> <span class="n">pk_value</span><span class="p">)</span>
        
        <span class="k">if</span> <span class="n">request</span><span class="o">.</span><span class="n">POST</span><span class="o">.</span><span class="n">has_key</span><span class="p">(</span><span class="s">&quot;_popup&quot;</span><span class="p">):</span>
                <span class="c">#htturn response to Autocomplete PopUp</span>
                <span class="k">if</span> <span class="n">request</span><span class="o">.</span><span class="n">POST</span><span class="o">.</span><span class="n">has_key</span><span class="p">(</span><span class="s">&quot;_popup&quot;</span><span class="p">):</span>
                        <span class="k">return</span> <span class="n">HttpResponse</span><span class="p">(</span><span class="s">&#39;&lt;script type=&quot;text/javascript&quot;&gt;opener.dismissAutocompletePopup(window, &quot;</span><span class="si">%s</span><span class="s">&quot;, &quot;</span><span class="si">%s</span><span class="s">&quot;);&lt;/script&gt;&#39;</span> <span class="o">%</span> <span class="p">(</span><span class="n">escape</span><span class="p">(</span><span class="n">pk_value</span><span class="p">),</span> <span class="n">escape</span><span class="p">(</span><span class="n">obj</span><span class="p">)))</span>
                                        
        <span class="k">elif</span> <span class="n">request</span><span class="o">.</span><span class="n">POST</span><span class="o">.</span><span class="n">has_key</span><span class="p">(</span><span class="s">&quot;_addanother&quot;</span><span class="p">):</span>
                <span class="bp">self</span><span class="o">.</span><span class="n">message_user</span><span class="p">(</span><span class="n">request</span><span class="p">,</span> <span class="n">msg</span> <span class="o">+</span> <span class="s">&#39; &#39;</span> <span class="o">+</span> <span class="p">(</span><span class="n">_</span><span class="p">(</span><span class="s">&quot;You may add another </span><span class="si">%s</span><span class="s"> below.&quot;</span><span class="p">)</span> <span class="o">%</span> <span class="n">force_unicode</span><span class="p">(</span><span class="n">opts</span><span class="o">.</span><span class="n">verbose_name</span><span class="p">)))</span>
                <span class="k">return</span> <span class="n">HttpResponseRedirect</span><span class="p">(</span><span class="n">request</span><span class="o">.</span><span class="n">path</span><span class="p">)</span>
        <span class="k">else</span><span class="p">:</span>
                <span class="bp">self</span><span class="o">.</span><span class="n">message_user</span><span class="p">(</span><span class="n">request</span><span class="p">,</span> <span class="n">msg</span><span class="p">)</span>

                <span class="c"># Figure out where to redirect. If the user has change permission,</span>
                <span class="c"># redirect to the change-list page for this object. Otherwise,</span>
                <span class="c"># redirect to the admin index.</span>
                <span class="k">if</span> <span class="bp">self</span><span class="o">.</span><span class="n">has_change_permission</span><span class="p">(</span><span class="n">request</span><span class="p">,</span> <span class="bp">None</span><span class="p">):</span>
                        <span class="n">post_url</span> <span class="o">=</span> <span class="s">&#39;../&#39;</span>
                <span class="k">else</span><span class="p">:</span>
                        <span class="n">post_url</span> <span class="o">=</span> <span class="s">&#39;../../../&#39;</span>
                <span class="k">return</span> <span class="n">HttpResponseRedirect</span><span class="p">(</span><span class="n">post_url</span><span class="p">)</span>
</pre></div>

<p>One class, one complete method copied except for one key line:</p>
<div class="highlight"><pre><span class="k">return</span> <span class="n">HttpResponse</span><span class="p">(</span><span class="s">&#39;&lt;script type=&quot;text/javascript&quot;&gt;opener.dismissAutocompletePopup(window, &quot;</span><span class="si">%s</span><span class="s">&quot;, &quot;</span><span class="si">%s</span><span class="s">&quot;);&lt;/script&gt;&#39;</span> <span class="o">%</span> <span class="p">(</span><span class="n">escape</span><span class="p">(</span><span class="n">pk_value</span><span class="p">),</span> <span class="n">escape</span><span class="p">(</span><span class="n">obj</span><span class="p">)))</span>
</pre></div>

<p>Here "opener" is the window a user spawns by hitting the green "+".  This change in the response lets us call our slightly different popup handling code which enables our autocomplete field to update with the new value after the hidden select drop-down is updated by the default Django Admin code.</p>
<p>There might be a better way, but I haven't been able to find it yet.  Suggestions are welcome.  The key problem is, though the select will change by default, it won't produce a change event, so there is no way to update the autocomplete field.</p>
<p>Finally the wrapper, which is all thanks to the author of django-autocomplete.</p>
<div class="highlight"><pre><span class="k">class</span> <span class="nc">AutocompleteWidgetWrapper</span><span class="p">(</span><span class="n">admin</span><span class="o">.</span><span class="n">widgets</span><span class="o">.</span><span class="n">RelatedFieldWidgetWrapper</span><span class="p">):</span>
        <span class="k">def</span> <span class="nf">render</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">name</span><span class="p">,</span> <span class="n">value</span><span class="p">,</span> <span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">):</span>
                <span class="n">rel_to</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">rel</span><span class="o">.</span><span class="n">to</span>
                <span class="n">related_url</span> <span class="o">=</span> <span class="s">&#39;../../../</span><span class="si">%s</span><span class="s">/</span><span class="si">%s</span><span class="s">/&#39;</span> <span class="o">%</span> <span class="p">(</span><span class="n">rel_to</span><span class="o">.</span><span class="n">_meta</span><span class="o">.</span><span class="n">app_label</span><span class="p">,</span> <span class="n">rel_to</span><span class="o">.</span><span class="n">_meta</span><span class="o">.</span><span class="n">object_name</span><span class="o">.</span><span class="n">lower</span><span class="p">())</span>
                <span class="bp">self</span><span class="o">.</span><span class="n">widget</span><span class="o">.</span><span class="n">choices</span> <span class="o">=</span> <span class="bp">self</span><span class="o">.</span><span class="n">choices</span>
                <span class="n">output</span> <span class="o">=</span> <span class="p">[</span><span class="bp">self</span><span class="o">.</span><span class="n">widget</span><span class="o">.</span><span class="n">render</span><span class="p">(</span><span class="n">name</span><span class="p">,</span> <span class="n">value</span><span class="p">,</span> <span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">)]</span>
                <span class="k">if</span> <span class="n">rel_to</span> <span class="ow">in</span> <span class="bp">self</span><span class="o">.</span><span class="n">admin_site</span><span class="o">.</span><span class="n">_registry</span><span class="p">:</span> <span class="c"># If the related object has an admin interface:</span>
                        <span class="c"># TODO: &quot;id_&quot; is hard-coded here. This should instead use the correct</span>
                        <span class="c"># API to determine the ID dynamically.</span>
                        <span class="n">output</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="s">u&#39;&lt;a href=&quot;</span><span class="si">%s</span><span class="s">add/&quot; class=&quot;add-another&quot; id=&quot;add_id_</span><span class="si">%s</span><span class="s">&quot; onclick=&quot;return showAutocompletePopup(this);&quot;&gt; &#39;</span> <span class="o">%</span> \
                                <span class="p">(</span><span class="n">related_url</span><span class="p">,</span> <span class="n">name</span><span class="p">))</span>
                        <span class="n">output</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="s">u&#39;&lt;img src=&quot;</span><span class="si">%s</span><span class="s">img/admin/icon_addlink.gif&quot; width=&quot;10&quot; height=&quot;10&quot; alt=&quot;</span><span class="si">%s</span><span class="s">&quot; /&gt;&lt;/a&gt;&#39;</span> <span class="o">%</span> <span class="p">(</span><span class="n">settings</span><span class="o">.</span><span class="n">ADMIN_MEDIA_PREFIX</span><span class="p">,</span> <span class="n">_</span><span class="p">(</span><span class="s">&#39;Add Another&#39;</span><span class="p">)))</span>
                <span class="k">return</span> <span class="n">mark_safe</span><span class="p">(</span><span class="s">u&#39;&#39;</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">output</span><span class="p">))</span>
</pre></div>

<p>That is basically it except for a bit of Javascript that's needed to stitch together the popup logic which I placed in a file called autocomplete.popup.js</p>
<div class="highlight"><pre><span class="kd">function</span> <span class="nx">showAutocompletePopup</span><span class="p">(</span><span class="nx">triggeringLink</span><span class="p">)</span> <span class="p">{</span>
    <span class="kd">var</span> <span class="nx">name</span> <span class="o">=</span> <span class="nx">triggeringLink</span><span class="p">.</span><span class="nx">id</span><span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/^add_/</span><span class="p">,</span> <span class="s1">&#39;&#39;</span><span class="p">);</span>
    <span class="nx">name</span> <span class="o">=</span> <span class="nx">id_to_windowname</span><span class="p">(</span><span class="nx">name</span><span class="p">);</span>
    <span class="nx">href</span> <span class="o">=</span> <span class="nx">triggeringLink</span><span class="p">.</span><span class="nx">href</span>
    <span class="k">if</span> <span class="p">(</span><span class="nx">href</span><span class="p">.</span><span class="nx">indexOf</span><span class="p">(</span><span class="s1">&#39;?&#39;</span><span class="p">)</span> <span class="o">==</span> <span class="o">-</span><span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
        <span class="nx">href</span> <span class="o">+=</span> <span class="s1">&#39;?_popup=2&#39;</span><span class="p">;</span>
    <span class="p">}</span> <span class="k">else</span> <span class="p">{</span>
        <span class="nx">href</span>  <span class="o">+=</span> <span class="s1">&#39;&amp;_popup=2&#39;</span><span class="p">;</span>
    <span class="p">}</span>
    <span class="kd">var</span> <span class="nx">win</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">open</span><span class="p">(</span><span class="nx">href</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="s1">&#39;height=500,width=800,resizable=yes,scrollbars=yes&#39;</span><span class="p">);</span>
    <span class="nx">win</span><span class="p">.</span><span class="nx">focus</span><span class="p">();</span>
    <span class="k">return</span> <span class="kc">false</span><span class="p">;</span>
<span class="p">}</span>

<span class="kd">function</span> <span class="nx">dismissAutocompletePopup</span><span class="p">(</span><span class="nx">win</span><span class="p">,</span> <span class="nx">newId</span><span class="p">,</span> <span class="nx">newRepr</span><span class="p">)</span> <span class="p">{</span>
    <span class="nx">newId</span> <span class="o">=</span> <span class="nx">html_unescape</span><span class="p">(</span><span class="nx">newId</span><span class="p">);</span>
    <span class="nx">newRepr</span> <span class="o">=</span> <span class="nx">html_unescape</span><span class="p">(</span><span class="nx">newRepr</span><span class="p">);</span>
    <span class="kd">var</span> <span class="nx">name</span> <span class="o">=</span> <span class="nx">windowname_to_id</span><span class="p">(</span><span class="nx">win</span><span class="p">.</span><span class="nx">name</span><span class="p">);</span>
    <span class="nx">dismissAddAnotherPopup</span><span class="p">(</span><span class="nx">win</span><span class="p">,</span> <span class="nx">newId</span><span class="p">,</span> <span class="nx">newRepr</span><span class="p">);</span>
    <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;#&quot;</span> <span class="o">+</span> <span class="nx">name</span><span class="p">).</span><span class="nx">change</span><span class="p">();</span>
<span class="p">}</span>
</pre></div>

<p>Not super simple, but an effective way to get a friendlier admin user interface experience.</p>
<p>If you find this useful please let me know. If there is enough interest I will look into cleaning out the cruft and making an installable package out of this code.</p>
