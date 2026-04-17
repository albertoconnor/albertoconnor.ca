Title: Export to CSV using the Django ORM
Date: 2012-05-17 16:25
Slug: export-csv-using-django-orm
Category: Writing

<p>Django apps tend to be pretty data heavy. One common task is exporting sets of data to csv (comma separated values), a plain text file which can be loaded up in a spreadsheet and manipulated further. The first thing to do is make sure you know about the Python <a href="http://docs.python.org/library/csv.html">csv</a> library.</p>
<p>If you are exporting all of you data with respect to one model, here is a quick way to do it and keep your code cleaner using values_list and the Django ORM query shorthand. Start by defining your export as a data structure.</p>
<div class="highlight"><pre><span class="n">export_info</span> <span class="o">=</span> <span class="p">[</span>
    <span class="p">(</span><span class="s">&quot;Role&quot;</span><span class="p">,</span> <span class="s">&quot;role__name&quot;</span><span class="p">),</span>
    <span class="p">(</span><span class="s">&quot;Department&quot;</span><span class="p">,</span> <span class="s">&quot;department&quot;</span><span class="p">),</span>
    <span class="p">(</span><span class="s">&quot;Last Name&quot;</span><span class="p">,</span> <span class="s">&quot;person__last_name&quot;</span><span class="p">),</span>
    <span class="p">(</span><span class="s">&quot;First Name&quot;</span><span class="p">,</span> <span class="s">&quot;person__first_name&quot;</span><span class="p">),</span>
<span class="p">]</span>
</pre></div>

<p>The first item in the tuple is the row header and the second item is an ORM path to the value you want. It will be passed in to values_list. One quirk to note is if you have a relationship and you don't specify the field on the relationship are you interested in you will just get the id for the object. The model's unicode method isn't called. For a better idea here is what the models would look like in this example.</p>
<div class="highlight"><pre><span class="k">class</span> <span class="nc">Position</span><span class="p">(</span><span class="n">models</span><span class="o">.</span><span class="n">Model</span><span class="p">):</span>
    <span class="n">role</span> <span class="o">=</span> <span class="n">models</span><span class="o">.</span><span class="n">ForeignKey</span><span class="p">(</span><span class="s">&quot;Role&quot;</span><span class="p">)</span>
    <span class="n">department</span> <span class="o">=</span> <span class="n">models</span><span class="o">.</span><span class="n">CharField</span><span class="p">(</span><span class="n">max_length</span><span class="o">=</span><span class="mi">256</span><span class="p">)</span>
    <span class="n">person</span> <span class="o">=</span> <span class="n">models</span><span class="o">.</span><span class="n">ForeignKey</span><span class="p">(</span><span class="s">&quot;Person&quot;</span><span class="p">)</span>

<span class="k">class</span> <span class="nc">Role</span><span class="p">(</span><span class="n">models</span><span class="o">.</span><span class="n">Model</span><span class="p">):</span>
    <span class="n">name</span> <span class="o">=</span> <span class="n">models</span><span class="o">.</span><span class="n">CharField</span><span class="p">(</span><span class="n">max_length</span><span class="o">=</span><span class="mi">256</span><span class="p">)</span>

<span class="k">class</span> <span class="nc">Person</span><span class="p">(</span><span class="n">models</span><span class="o">.</span><span class="n">Model</span><span class="p">):</span>
    <span class="n">first_name</span> <span class="o">=</span> <span class="n">models</span><span class="o">.</span><span class="n">CharField</span><span class="p">(</span><span class="n">max_length</span><span class="o">=</span><span class="mi">256</span><span class="p">)</span>
    <span class="n">last_name</span> <span class="o">=</span> <span class="n">models</span><span class="o">.</span><span class="n">CharField</span><span class="p">(</span><span class="n">max_length</span><span class="o">=</span><span class="mi">256</span><span class="p">)</span>
</pre></div>

<p>The core logic looks like this.</p>
<div class="highlight"><pre><span class="k">global</span> <span class="n">export_info</span>
<span class="n">positions</span> <span class="o">=</span> <span class="n">Position</span><span class="o">.</span><span class="n">objects</span><span class="o">.</span><span class="n">all</span><span class="p">()</span><span class="o">.</span><span class="n">order_by</span><span class="p">(</span><span class="s">&quot;role__name&quot;</span><span class="p">,</span> 
                                            <span class="s">&quot;person__last_name&quot;</span><span class="p">)</span>
<span class="c"># The inverse of zip is zip</span>
<span class="n">headers</span><span class="p">,</span> <span class="n">fields</span> <span class="o">=</span> <span class="nb">zip</span><span class="p">(</span><span class="o">*</span><span class="n">export_info</span><span class="p">)</span>     
<span class="n">rows</span> <span class="o">=</span> <span class="p">[</span><span class="n">headers</span><span class="p">]</span>
<span class="k">for</span> <span class="n">position</span> <span class="ow">in</span> <span class="n">positions</span><span class="p">:</span>
    <span class="n">qs</span> <span class="o">=</span> <span class="n">Position</span><span class="o">.</span><span class="n">objects</span><span class="o">.</span><span class="n">filter</span><span class="p">(</span><span class="n">pk</span><span class="o">=</span><span class="n">position</span><span class="o">.</span><span class="n">id</span><span class="p">)</span>    
    <span class="c"># convert values like datetimes into unicode objects</span>
    <span class="n">rows</span><span class="o">.</span><span class="n">append</span><span class="p">([</span><span class="nb">unicode</span><span class="p">(</span><span class="n">v</span><span class="p">)</span> <span class="k">for</span> <span class="n">v</span> <span class="ow">in</span> <span class="n">qs</span><span class="o">.</span><span class="n">values_list</span><span class="p">(</span><span class="o">*</span><span class="n">fields</span><span class="p">)[</span><span class="mi">0</span><span class="p">]])</span>
</pre></div>

<p>The last line is where the magic happens. I suggest going through it in your interpreter if you are confused about what it does. When this code is done you will have the list of rows which are your csv file. All that is left is to write the result to a proxy file and return it in a response.</p>
<div class="highlight"><pre><span class="n">f</span> <span class="o">=</span> <span class="n">StringIO</span><span class="o">.</span><span class="n">StringIO</span><span class="p">()</span>
<span class="n">writer</span> <span class="o">=</span> <span class="n">UnicodeWriter</span><span class="p">(</span><span class="n">f</span><span class="p">)</span>
<span class="k">for</span> <span class="n">row</span> <span class="ow">in</span> <span class="n">rows</span><span class="p">:</span>
    <span class="n">writer</span><span class="o">.</span><span class="n">writerow</span><span class="p">(</span><span class="n">row</span><span class="p">)</span>
<span class="n">response</span> <span class="o">=</span> <span class="n">HttpResponse</span><span class="p">(</span><span class="n">f</span><span class="o">.</span><span class="n">getvalue</span><span class="p">(),</span> <span class="n">mimetype</span><span class="o">=</span><span class="s">&quot;text/csv&quot;</span><span class="p">)</span>  
<span class="n">response</span><span class="p">[</span><span class="s">&#39;Content-Disposition&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="s">&#39;attachment; filename=export.csv&#39;</span>
<span class="k">return</span> <span class="n">response</span>
</pre></div>

<p>To get StringIO do "import cStringIO as StringIO". The UnicodeWriter for csv is a bit of custom code inspired by this <a href="http://docs.python.org/library/csv.html#examples">section</a> of the Python docs. You can use the normal csv library writer if all your data is ASCII and different file proxy object if you like.</p><p>
</p><p>Is there an even better way?</p>
