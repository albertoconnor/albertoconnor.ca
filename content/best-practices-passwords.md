Title: Best Practices: Passwords
Date: 2010-12-03 13:39
Slug: best-practices-passwords
Category: Writing

<p>When I decided to start working for myself, I felt I needed to establish best practices as soon as possible, while I still had time.  My clients would be trusting me to with their information and access to their systems and I wanted to make sure I was being responsible.</p>
<p>Password management is one area I targeted.  Even if you aren't in business for yourself, being secure online basically requires a good password management scheme.</p>
<strong>Existing Options</strong>
<p>There are a lot of solutions and partial solutions out there.  For example browsers will remember arbitrary passwords for you, but that is only most convenient when you are using that browser.  Many of my passwords are for ssh accounts and I planned on using multiple users on my laptop.</p>
<p>Other 3rd party solutions exists like <a href="http://www.splashdata.com/">Splash Data</a> and <a href="http://agilewebsolutions.com/onepassword">1Password</a>.  My problem with their approach was not being clear how to backup and recover the data cross computers.  As I will write about soon, backups is one of the other best practices I focused on.</p>
<strong>Rolling Your Own</strong>
<p>I talked to my resident cryptography expert <a href="http://www.douglas.stebila.ca/">Douglas Stebila</a> about how he was using a simple system which seem to fit my requirements.  It was easy to use, backup, and completely transparent.</p>
<p>This approach is best for those who understand the command line, shell scripts and grep and who are using Unix compatible systems like Linux or Mac OS X.  Cygwin would also work.</p>
<p>The core idea is to store all your password in an OpenSSL encrypted file.  You decrypt the file and pass it through grep to look up passwords.  I use a format of "description: password", but everything is customizable.  I implemented a series of shell scripts and one Python script to make it all work.</p>
<p>First lets look at the passwords script.</p>
<div class="highlight"><pre><span class="c">#!/bin/bash</span>
openssl enc -d -aes128 &lt; /somewhere/accessible/passwords.aes128 | grep -i <span class="nv">$1</span>

<span class="c"># Usage: passwords blah</span>
<span class="c"># password: &lt;Enter master password&gt;</span>
<span class="c"># Finds all descripts or passwords with &quot;blah&quot; in them</span>
</pre></div>

<p>I make sure that the passwords script is always on the path and the passwords.aes128 file is accessible.  It is important you make sure your master password is a strong password since it protects everything.</p>
<p>The master password is really just the password you encrypt the passwords.aes128 file with, so when you are editing it and re-encrypting it, make sure you don't mistype it or you could loose your password archive.  Again a backup strategy is important.</p>
<p>I manage the file with a set of scripts.  First there is passwords-decompress and passwords-edit:</p>
<div class="highlight"><pre><span class="c">#!/bin/bash</span>
openssl enc -d -aes128 &lt; /somewhere/accessible/passwords.aes128 &gt;/somewhere/accessible/passwords.aes128.decrypted
</pre></div>

<div class="highlight"><pre><span class="c">#!/bin/bash</span>
vi /somewhere/accessible/passwords.aes128.decrypted
</pre></div>

<p>Most of these scripts are just so I need to remember paths and arguments.  I want adding passwords to be as easy as possible.  To generate a new password I use something like the following Python script.</p>
<div class="highlight"><pre><span class="kn">import</span> <span class="nn">random</span>

<span class="n">chars</span> <span class="o">=</span> <span class="s">&quot;1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM&quot;</span>

<span class="k">if</span> <span class="n">__name__</span> <span class="o">==</span> <span class="s">&quot;__main__&quot;</span><span class="p">:</span>
    <span class="k">print</span> <span class="s">&quot;Password Helper. Albert O&#39;Connor. 2010&quot;</span>
        
    <span class="n">desc</span> <span class="o">=</span> <span class="nb">raw_input</span><span class="p">(</span><span class="s">&quot;Enter password description: &quot;</span><span class="p">)</span>
    
    <span class="n">password</span> <span class="o">=</span> <span class="s">&quot;&quot;</span>
    <span class="k">for</span> <span class="n">i</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="mi">8</span><span class="p">):</span>
        <span class="n">password</span> <span class="o">+=</span> <span class="n">random</span><span class="o">.</span><span class="n">choice</span><span class="p">(</span><span class="n">chars</span><span class="p">)</span>
    
    <span class="k">print</span> <span class="s">&quot;</span><span class="si">%s</span><span class="s">: </span><span class="si">%s</span><span class="s">&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="n">desc</span><span class="p">,</span> <span class="n">password</span><span class="p">)</span>
</pre></div>

<p>The last line this script prints out is what I copy and paste into the passwords file.  If you want to be more secure about it you can use <a href="http://www.dlitz.net/software/pycrypto/doc/#crypto-random">Python Cryptography's Random</a>.  Once I have edited the decrypted passwords my satisfaction I run passwords-compress.</p>
<div class="highlight"><pre><span class="c">#!/bin/bash</span>
openssl enc -e -aes128 &lt; /somewhere/accessible/passwords.aes128.decrypted &gt; /somewhere/accessible/passwords.aes128
</pre></div>

<p>This is where you have to be careful, since consistently mistyping your master password can lead to inaccessible data.  I always test out the new password I added with passwords before backing up with passwords-backup.</p>
<div class="highlight"><pre><span class="c">#!/bin/bash</span>
cp /somewhere/accessible/passwords.aes128 /somewhere/accessible/passwords.aes128.backup
scp /somewhere/accessible/passwords.aes128 user@server.org:~/backup/
</pre></div>

<p>This makes a local and off site backup of the encrypted file.  Finally I clean up with passwords-cleanup:</p>
<div class="highlight"><pre><span class="c">#!/bin/bash</span>
srm  /somewhere/accessible/passwords.aes128.decrypted
</pre></div>

<p>Because leaving decrypted versions of your passwords file around totally defeats the purpose.  Now whenever you need a password, open a prompt, type passwords blah, enter your master password, and you will get all your passwords for blah.  Close the terminal when you are done though!</p>
<p>No matter what, if you will be freelancing in a digital world, keeping track of passwords is something you have to do.  This method is simple, the encryption is secure enough for the <a href="http://en.wikipedia.org/wiki/Advanced_Encryption_Standard">NSA</a>, and highly usable.  If it doesn't suit your taste employ another one, just make sure you are using one.</p>
