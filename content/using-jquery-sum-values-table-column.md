Title: Using jQuery to sum the values in a table column
Date: 2012-05-09 14:45
Slug: using-jquery-sum-values-table-column
Category: Writing

<p>Here is some neat jQuery based off of this <a href="http://naspinski.net/post/Use-jQuery-to-add-all-the-values-in-a-table-column_.aspx">post</a> [naspinski.net] that lets you sum up the values in a HTML table.</p><p>
</p><p>In general I would definitely use a different, usually database centric, approach to summing values. On the page I am currently working on though, there are going to be over 10 tables which are only useful with sums. As it is I am going to be doing many queries for this page, and it will be alright that the summing is a bit delayed.</p><p>
</p><p>First the HTML:</p>
<div class="highlight"><pre><span class="nt">&lt;table</span> <span class="na">class=</span><span class="s">&quot;tally&quot;</span><span class="nt">&gt;</span>
        <span class="nt">&lt;th&gt;</span>balance<span class="nt">&lt;/th&gt;</span>
        <span class="nt">&lt;td&gt;</span>100<span class="nt">&lt;/td&gt;</span>
    
    <span class="nt">&lt;tr&gt;</span>
        <span class="nt">&lt;th&gt;</span>gains<span class="nt">&lt;/th&gt;</span>
        <span class="nt">&lt;td&gt;</span>20<span class="nt">&lt;/td&gt;</span>
    <span class="nt">&lt;/tr&gt;</span>
    <span class="nt">&lt;tr&gt;</span>
        <span class="nt">&lt;th&gt;</span>loses<span class="nt">&lt;/th&gt;</span>
        <span class="nt">&lt;td&gt;</span>-36<span class="nt">&lt;/td&gt;</span>
    <span class="nt">&lt;/tr&gt;</span>
    <span class="nt">&lt;tr</span> <span class="na">class=</span><span class="s">&quot;sum&quot;</span><span class="nt">&gt;</span>
        <span class="nt">&lt;th&gt;</span>Total<span class="nt">&lt;/th&gt;</span>
        <span class="nt">&lt;td</span> <span class="na">class=</span><span class="s">&quot;sum&quot;</span><span class="nt">&gt;</span>#<span class="nt">&lt;/td&gt;</span>
    <span class="nt">&lt;/tr&gt;</span>
<span class="nt">&lt;/table&gt;</span>
</pre></div>

<p>This will render a table with some values and "#" where the total should be. With some jQuery powered javascript we can do the summing:</p>
<div class="highlight"><pre><span class="kd">function</span> <span class="nx">sumOfColumns</span><span class="p">(</span><span class="nx">table</span><span class="p">,</span> <span class="nx">columnIndex</span><span class="p">)</span> <span class="p">{</span>
    <span class="kd">var</span> <span class="nx">tot</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
    <span class="nx">table</span><span class="p">.</span><span class="nx">find</span><span class="p">(</span><span class="s2">&quot;tr&quot;</span><span class="p">).</span><span class="nx">children</span><span class="p">(</span><span class="s2">&quot;td:nth-child(&quot;</span> <span class="o">+</span> <span class="nx">columnIndex</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">)</span>
    <span class="p">.</span><span class="nx">each</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span>
        <span class="nx">$this</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
        <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">$this</span><span class="p">.</span><span class="nx">hasClass</span><span class="p">(</span><span class="s2">&quot;sum&quot;</span><span class="p">)</span> <span class="o">&amp;&amp;</span> <span class="nx">$this</span><span class="p">.</span><span class="nx">html</span><span class="p">()</span> <span class="o">!=</span> <span class="s2">&quot;&quot;</span><span class="p">)</span> <span class="p">{</span>
            <span class="nx">tot</span> <span class="o">+=</span> <span class="nb">parseInt</span><span class="p">(</span><span class="nx">$this</span><span class="p">.</span><span class="nx">html</span><span class="p">());</span>
        <span class="p">}</span>
    <span class="p">});</span>
    <span class="k">return</span> <span class="nx">tot</span><span class="p">;</span>
<span class="p">}</span>

<span class="kd">function</span> <span class="nx">do_sums</span><span class="p">()</span> <span class="p">{</span>
    <span class="nx">$</span><span class="p">(</span><span class="s2">&quot;tr.sum&quot;</span><span class="p">).</span><span class="nx">each</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">i</span><span class="p">,</span> <span class="nx">tr</span><span class="p">)</span> <span class="p">{</span>
        <span class="nx">$tr</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="nx">tr</span><span class="p">);</span>
        <span class="nx">$tr</span><span class="p">.</span><span class="nx">children</span><span class="p">().</span><span class="nx">each</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">i</span><span class="p">,</span> <span class="nx">td</span><span class="p">)</span> <span class="p">{</span>
            <span class="nx">$td</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="nx">td</span><span class="p">);</span>
            <span class="kd">var</span> <span class="nx">table</span> <span class="o">=</span> <span class="nx">$td</span><span class="p">.</span><span class="nx">parent</span><span class="p">().</span><span class="nx">parent</span><span class="p">().</span><span class="nx">parent</span><span class="p">();</span>
            <span class="k">if</span> <span class="p">(</span><span class="nx">$td</span><span class="p">.</span><span class="nx">hasClass</span><span class="p">(</span><span class="s2">&quot;sum&quot;</span><span class="p">))</span> <span class="p">{</span>
                <span class="nx">$td</span><span class="p">.</span><span class="nx">html</span><span class="p">(</span><span class="nx">sumOfColumns</span><span class="p">(</span><span class="nx">table</span><span class="p">,</span> <span class="nx">i</span><span class="o">+</span><span class="mi">1</span><span class="p">));</span>
            <span class="p">}</span>
        <span class="p">})</span>
    <span class="p">});</span>
<span class="p">}</span>
</pre></div>

<p>You can use some css with the class "sum" to highlight your sums to make your tables easier to read. This should work with different types of tables, including summing multiple columns at once. Unfortunately, it won't work with tables which use colspans or rowspans.</p>
