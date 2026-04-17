Title: Showing Current Values for FileFields in Django
Date: 2010-08-09 16:47
Slug: showing-current-values-filefields
Category: Writing

<p>I am working on a dynamic form which contained multiple FileFields which could have initial values.  The FileInput widget doesn't show initial values since that could expose too much about the servers underlying file system.  Despite this I wanted to show the file name as user feedback.</p>
<p>If the form was static, I could pass current file names in through the context and just be very explicit with my template code.  Since the form was dynamic the template code would have to iterate though the fields, and there is no easy way to look up unrelated data at the same time.</p>
<p>To learn some nifty tricks on how to create dynamic forms check out <a href="http://www.b-list.org/weblog/2008/nov/09/dynamic-forms/" target="_blank"><i>So you want a dynamic form</i></a> on the <a href="http://www.b-list.org" target="_blank">b-list</a> blog.</p>
<p>Meanwhile I need a solution to pass in the initial file name data with the form.  The built in initial dictionary didn't really work, and the field objects initial data member was empty.  I had to look outside the form.  Beyond the form to the truth:  there is not form!</p>
<p><strong>There Is No Form</strong></p>
<p>A pearl of wisdom in my grasp, the form object did not matter, only the field objects were required to render a form. (Assuming you don't need form-wide errors ...)</p>
<p>In the view I passed in 2-uples of the initial file names of the files and the field objects.  I did not need to pass the form object into the template at all:</p>
<div class="highlight"><pre><span class="k">def</span> <span class="nf">view</span><span class="p">(</span><span class="n">request</span><span class="p">):</span>
   <span class="n">posting</span> <span class="o">=</span> <span class="n">get_object_or_404</span><span class="p">(</span><span class="n">Posting</span><span class="p">,</span> <span class="n">pk</span><span class="o">=</span><span class="nb">id</span><span class="p">)</span> <span class="c"># Get the thing the dynamic form depends on</span>
   <span class="n">file_store</span> <span class="o">=</span> <span class="n">get_object_or_404</span><span class="p">(</span><span class="n">FileStore</span><span class="p">,</span> <span class="n">pk</span><span class="o">=</span><span class="nb">id</span><span class="p">)</span> <span class="c"># Something like this</span>

   <span class="k">if</span> <span class="n">request</span><span class="o">.</span><span class="n">method</span> <span class="o">==</span> <span class="s">&quot;POST&quot;</span><span class="p">:</span>
     <span class="n">file_form</span> <span class="o">=</span> <span class="n">make_file_application_form</span><span class="p">(</span><span class="n">posting</span><span class="p">)(</span><span class="n">request</span><span class="o">.</span><span class="n">POST</span><span class="p">,</span> <span class="n">request</span><span class="o">.</span><span class="n">FILES</span><span class="p">)</span>

     <span class="n">file_fields_and_names</span> <span class="o">=</span> <span class="p">[(</span><span class="n">file_form</span><span class="p">[</span><span class="n">key</span><span class="p">],</span> <span class="nb">getattr</span><span class="p">(</span><span class="n">file_store</span><span class="p">,</span> <span class="n">key</span><span class="p">))</span> <span class="k">for</span> <span class="n">key</span> <span class="ow">in</span> <span class="n">file_form</span><span class="o">.</span><span class="n">fields</span><span class="p">]</span>
     <span class="n">file_fields_and_names</span> <span class="o">=</span> <span class="p">[(</span><span class="n">field</span><span class="p">,</span> <span class="n">file_name_from_file_obj</span><span class="p">(</span><span class="nb">file</span><span class="p">))</span> <span class="k">for</span> <span class="n">field</span><span class="p">,</span><span class="nb">file</span> <span class="ow">in</span> <span class="n">file_fields_and_names</span><span class="p">]</span>

     <span class="k">if</span> <span class="n">file_form</span><span class="o">.</span><span class="n">is_valid</span><span class="p">():</span>
       <span class="n">file_data</span> <span class="o">=</span> <span class="n">file_form</span><span class="o">.</span><span class="n">cleaned_data</span>
       <span class="k">for</span> <span class="n">key</span> <span class="ow">in</span> <span class="n">file_data</span><span class="p">:</span>
          <span class="k">if</span> <span class="n">file_data</span><span class="p">[</span><span class="n">key</span><span class="p">]:</span>
            <span class="nb">setattr</span><span class="p">(</span><span class="n">file_store</span><span class="p">,</span> <span class="n">key</span><span class="p">,</span> <span class="n">file_data</span><span class="p">[</span><span class="n">key</span><span class="p">])</span>
       <span class="n">file_store</span><span class="o">.</span><span class="n">save</span><span class="p">()</span>
       <span class="k">return</span> <span class="n">redirect</span><span class="p">(</span><span class="s">&quot;view&quot;</span><span class="p">)</span>
     <span class="k">else</span><span class="p">:</span>
       <span class="n">file_form</span> <span class="o">=</span> <span class="n">make_file_application_form</span><span class="p">(</span><span class="n">posting</span><span class="p">)()</span>

       <span class="n">file_fields_and_names</span> <span class="o">=</span> <span class="p">[(</span><span class="n">file_form</span><span class="p">[</span><span class="n">key</span><span class="p">],</span> <span class="nb">getattr</span><span class="p">(</span><span class="n">file_store</span><span class="p">,</span> <span class="n">key</span><span class="p">))</span> <span class="k">for</span> <span class="n">key</span> <span class="ow">in</span> <span class="n">file_form</span><span class="o">.</span><span class="n">fields</span><span class="p">]</span>
       <span class="n">file_fields_and_names</span> <span class="o">=</span> <span class="p">[(</span><span class="n">field</span><span class="p">,</span> <span class="n">file_name_from_file_obj</span><span class="p">(</span><span class="nb">file</span><span class="p">))</span> <span class="k">for</span> <span class="n">field</span><span class="p">,</span><span class="nb">file</span> <span class="ow">in</span> <span class="n">file_fields_and_names</span><span class="p">]</span>

   <span class="k">return</span> <span class="n">render_to_response</span><span class="p">(</span><span class="n">template</span><span class="p">,</span>
                              <span class="nb">dict</span><span class="p">(</span><span class="n">file_fields_and_names</span><span class="o">=</span><span class="n">file_fields_and_names</span><span class="p">,</span> <span class="o">...</span><span class="p">),</span>
                              <span class="n">context_instance</span><span class="o">=</span><span class="n">RequestContext</span><span class="p">(</span><span class="n">request</span><span class="p">))</span>
</pre></div>

<p>So if you need to, you can get creative with how you pass your fields into your template.</p>
