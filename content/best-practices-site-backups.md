Title: Best Practices: Off-Site Backups
Date: 2011-05-31 23:52
Slug: best-practices-site-backups
Category: Writing

<p>Having a backup strategy is key.  What works for me won't necessary work for you.  I am going to outline my method for my own reference, to get feedback, and in the hope it might help someone else out there.</p>
<p>I am using <a href="http://aws.amazon.com/s3/">Amazon S3</a> as my back-end, taking advantage of 10 GB for a year for free.  I am abusing <a href="http://fabfile.org/">Fabric</a> as my glue.  Fabric is meant for remote execution but I am using its local feature as a kind of Pythonic shell script.</p>
<p>The first major issue is security.  S3 is private by default but you are implicitly trusting Amazon.  The only solution is to encrypt your data, which is easier said then done.  The core of this post is documenting my method for encryption.</p>
<strong>Encrypting Your Bits</strong>
<p>I use OpenSSL to do the encryption instead of GPG or PGP because it is available on my Mac and widely on Linux without apt-getting.</p>
<p>Conceptually a backup is like a message sent from present day me to future me using asymmetric, or public/private key, encryption.  I want to encrypt the backup with my public key and decrypt it later with my private key.</p>
<p>The trouble is that with OpenSSL asymmetric encryption can only be used for small files.  The solution is to generate a unique symmetric key for every backup and encrypt that small file with my public key.  I save the symmetrically encrypted backup and the asymmetrically encrypted symmetric key together and send them both to S3.  Without your private key the two files get you nothing since they are both encrypted.</p>
<p>The first thing you have to once and only once is generate the public/private keys for encrypting the symmetric encryption keys (passwords):</p>
<div class="highlight"><pre><span class="k">def</span> <span class="nf">create_keys</span><span class="p">():</span>
    <span class="sd">&quot;&quot;&quot;</span>
<span class="sd">    Only do this once, if you overwrite your keys you won&#39;t be able to decrypt your backups!</span>
<span class="sd">    &quot;&quot;&quot;</span>
    <span class="n">key_file_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">root</span><span class="p">,</span> <span class="s">&quot;keys/backup.pem&quot;</span><span class="p">)</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;openssl genrsa -des3 -out </span><span class="si">%s</span><span class="s"> 1024&quot;</span> <span class="o">%</span> <span class="n">key_file_name</span><span class="p">)</span> <span class="c"># Generate encrypted private key</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;openssl rsa -in </span><span class="si">%s</span><span class="s"> -pubout &gt; </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">key_file_name</span><span class="p">,</span> <span class="n">key_file_name</span> <span class="o">+</span> <span class="s">&quot;.pub&quot;</span><span class="p">))</span> <span class="c">#Output the public part</span>
</pre></div>

<p>Here is the meat of a backup:</p>
<div class="highlight"><pre><span class="k">def</span> <span class="nf">backup_to_s3</span><span class="p">():</span>
    <span class="n">today</span> <span class="o">=</span> <span class="n">datetime</span><span class="o">.</span><span class="n">date</span><span class="o">.</span><span class="n">today</span><span class="p">()</span>
    <span class="nb">id</span> <span class="o">=</span> <span class="n">today</span><span class="o">.</span><span class="n">strftime</span><span class="p">(</span><span class="s">&quot;</span><span class="si">%d</span><span class="s">-%m-%Y&quot;</span><span class="p">)</span>
    
    <span class="c"># Tar everything you want to backup.  Assume a list of directories in backup_dirs.</span>
    <span class="n">backup_file_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">relative_store</span><span class="p">,</span> <span class="s">&quot;backup-</span><span class="si">%s</span><span class="s">.tar.gz&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">)</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;tar -zcf </span><span class="si">%s</span><span class="s"> </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">backup_file_name</span><span class="p">,</span><span class="s">&quot; &quot;</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">backup_dirs</span><span class="p">)))</span>
    
    <span class="c"># Generate a 64 character symmetric key</span>
    <span class="n">key</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">urandom</span><span class="p">(</span><span class="mi">64</span><span class="p">)</span>
    <span class="n">key_file_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">relative_store</span><span class="p">,</span> <span class="s">&quot;backup-</span><span class="si">%s</span><span class="s">.key&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">)</span>
    <span class="n">f</span> <span class="o">=</span> <span class="nb">open</span><span class="p">(</span><span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">local_store</span><span class="p">,</span> <span class="s">&quot;backup-</span><span class="si">%s</span><span class="s">.key&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">),</span> <span class="s">&quot;w&quot;</span><span class="p">)</span>
    <span class="n">f</span><span class="o">.</span><span class="n">write</span><span class="p">(</span><span class="n">key</span><span class="p">)</span>
    <span class="n">f</span><span class="o">.</span><span class="n">close</span><span class="p">()</span>
    
    <span class="c"># Encrypt the backup with the symmetric key</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;openssl enc -e -aes128 -pass file:</span><span class="si">%s</span><span class="s"> &lt; </span><span class="si">%s</span><span class="s"> &gt; </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">key_file_name</span><span class="p">,</span>
                                                              <span class="n">backup_file_name</span><span class="p">,</span>
                                                              <span class="n">backup_file_name</span> <span class="o">+</span> <span class="s">&quot;.enc&quot;</span><span class="p">))</span>
    
    <span class="c"># Encrypt the symmetric key with the public key generated before</span>
    <span class="n">public_key_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">root</span><span class="p">,</span> <span class="s">&quot;keys/backup.pem.pub&quot;</span><span class="p">)</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;openssl rsautl -encrypt -inkey </span><span class="si">%s</span><span class="s"> -pubin -in </span><span class="si">%s</span><span class="s"> -out </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">public_key_name</span><span class="p">,</span>
                                                                       <span class="n">key_file_name</span><span class="p">,</span>
                                                                       <span class="n">key_file_name</span> <span class="o">+</span> <span class="s">&quot;.pubenc&quot;</span><span class="p">))</span>
    
    <span class="c"># Securely remove the unencrypted symmetric key file</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;srm </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="n">key_file_name</span><span class="p">)</span>
    
    <span class="c"># Tar the encrypted backup and encrypted key together</span>
    <span class="n">unfied_backup_file_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">relative_store</span><span class="p">,</span> <span class="s">&quot;unified_backup-</span><span class="si">%s</span><span class="s">.tar.gz&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">)</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;tar -zcf </span><span class="si">%s</span><span class="s"> </span><span class="si">%s</span><span class="s"> </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">unfied_backup_file_name</span><span class="p">,</span>
                                 <span class="n">backup_file_name</span> <span class="o">+</span> <span class="s">&quot;.enc&quot;</span><span class="p">,</span>
                                 <span class="n">key_file_name</span> <span class="o">+</span> <span class="s">&quot;.pubenc&quot;</span><span class="p">))</span>
    
    <span class="c"># Push the result to s3</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;s3put -a </span><span class="si">%s</span><span class="s"> -s </span><span class="si">%s</span><span class="s"> -b amjoconn-backups -p </span><span class="si">%s</span><span class="s"> </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">ACCESS_KEY</span><span class="p">,</span>
                                                             <span class="n">SECRET_KEY</span><span class="p">,</span>
                                                             <span class="n">local_store</span><span class="p">,</span>
                                                             <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">abspath</span><span class="p">(</span><span class="n">unfied_backup_file_name</span><span class="p">)))</span>
</pre></div>

<p>This script has several global configuration variables which aren't addressed.  It also won't clean up your local store except to delete the unencrypted key.</p>
<strong>Recovery</strong>
<p>Like an claiming an insurance policy, recovery is the most important part of any backup system.  Like insurance people tend not to talk too much about how it will work nor do they test it often.  Given the complexity of the backup process, I figured outlining the recovery process even if the automation ultimately fails me would be handy for reference.</p>
<div class="highlight"><pre><span class="k">def</span> <span class="nf">recover_backup</span><span class="p">(</span><span class="nb">id</span><span class="p">):</span>
    <span class="c"># Try to get the file</span>
    <span class="n">conn</span> <span class="o">=</span> <span class="n">boto</span><span class="o">.</span><span class="n">connect_s3</span><span class="p">(</span><span class="n">ACCESS_KEY</span><span class="p">,</span> <span class="n">SECRET_KEY</span><span class="p">)</span>
    <span class="n">bucket</span> <span class="o">=</span> <span class="n">conn</span><span class="o">.</span><span class="n">get_bucket</span><span class="p">(</span><span class="s">&quot;amjoconn-backups&quot;</span><span class="p">)</span>
    <span class="n">key</span> <span class="o">=</span> <span class="n">bucket</span><span class="o">.</span><span class="n">get_key</span><span class="p">(</span><span class="s">&quot;unified_backup-</span><span class="si">%s</span><span class="s">.tar.gz&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">)</span>
    <span class="k">if</span> <span class="n">key</span> <span class="ow">is</span> <span class="bp">None</span><span class="p">:</span>
        <span class="k">print</span> <span class="s">&quot;Unable to find backup with id </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="nb">id</span>
        <span class="k">return</span>
    <span class="n">recover_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">recovery_location</span><span class="p">,</span> <span class="s">&quot;recover-</span><span class="si">%s</span><span class="s">.tar.gz&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">)</span>
    <span class="k">print</span> <span class="s">&quot;Writing&quot;</span><span class="p">,</span> <span class="s">&quot;unified_backup-</span><span class="si">%s</span><span class="s">.tar.gz&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">,</span> <span class="s">&quot;to&quot;</span><span class="p">,</span> <span class="n">recover_name</span>
    <span class="k">print</span> <span class="s">&quot;This might take a bit of time...&quot;</span>
    <span class="n">key</span><span class="o">.</span><span class="n">get_contents_to_filename</span><span class="p">(</span><span class="n">recover_name</span><span class="p">)</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;tar -xzf </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="n">recover_name</span><span class="p">)</span>
    
    <span class="c"># Decrypt the symmetric key file with the private key.</span>
    <span class="n">key_file_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">relative_store</span><span class="p">,</span> <span class="s">&quot;backup-</span><span class="si">%s</span><span class="s">.key&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">)</span>
    <span class="n">private_key_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">root</span><span class="p">,</span> <span class="s">&quot;keys/backup.pem&quot;</span><span class="p">)</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;openssl rsautl -decrypt -inkey </span><span class="si">%s</span><span class="s"> -in </span><span class="si">%s</span><span class="s"> -out </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">private_key_name</span><span class="p">,</span>
                                                                <span class="n">key_file_name</span> <span class="o">+</span> <span class="s">&quot;.pubenc&quot;</span><span class="p">,</span>
                                                                <span class="n">key_file_name</span><span class="p">))</span>
    
    <span class="c"># Decrypt the backup with the recently decrypted symmetric key.</span>
    <span class="n">backup_file_name</span> <span class="o">=</span> <span class="n">os</span><span class="o">.</span><span class="n">path</span><span class="o">.</span><span class="n">join</span><span class="p">(</span><span class="n">relative_store</span><span class="p">,</span> <span class="s">&quot;backup-</span><span class="si">%s</span><span class="s">.tar.gz&quot;</span> <span class="o">%</span> <span class="nb">id</span><span class="p">)</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;openssl enc -d -aes128 -pass file:</span><span class="si">%s</span><span class="s"> &lt; </span><span class="si">%s</span><span class="s"> &gt; </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">key_file_name</span><span class="p">,</span>
                                                              <span class="n">backup_file_name</span> <span class="o">+</span> <span class="s">&quot;.enc&quot;</span><span class="p">,</span>
                                                              <span class="n">backup_file_name</span><span class="p">))</span>
    
    <span class="c"># Untar the data here.  Depending how you used tar, there will be some interesting directories created.</span>
    <span class="n">local</span><span class="p">(</span><span class="s">&quot;tar -zxf </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="n">backup_file_name</span><span class="p">)</span>
</pre></div>

<p>Note, this doesn't clean up the decrypted symmetric key.</p>
<strong>Wrap Up</strong>
<p>There it is.  How I am keeping my bits safe.  Such a problem is never really solved though.  I hope to be able to update this post over time as I discover better ways to backup because this solution has much room for improvement.</p>
