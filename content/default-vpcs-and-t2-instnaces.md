Title: Default VPCs and T2 Instnaces
Date: 2014-07-28 14:45
Slug: default-vpcs-and-t2-instnaces
Category: Writing

<p><a href="http://aws.amazon.com/">Amazon Web Services</a> grows increasingly complex as they provide new an compelling features while supporting legacy users. To some extent this is unavoidable, but the upgrade path is not always clear and keeping documentation up to date is challenging. I did some digging into the new T2 instances and this is some of what I found.</p>
<h2>New T2 Instances</h2>
<p>My interest was peaked by the T2 instances. The t2.micro is less expensive while nearly doubling the available memory. There are other trade offs to be aware of. T2 instances must be HVM (Hardware) instead of PV (Paravirtualization), which for Linux could mean reduced performance. The machines they will be on will be more powerful so it may end up being a net gain.

</p><p>T2 instances must also be 64-bit, which means your memory foot print may double versus 32-bit. A t2.mirco has twice the memory but if you are used to using 32-bit systems you may not get much actual benefit.</p>
<h2>VPC and Default VPC</h2>
<p>Virtual Private Cloud (VPC) was originally a way for large companies with existing data centres to extend them into AWS. Over time it has evolved into EC2 networking done better to the point that new AWS accounts
get a "default VPC" automatically. If you go into a new Region you haven't been in before you also get one automatically.</p>
<p>VPC have some nice advantages. They can be more secure. You can change security groups on running instances. They also feel more like real world data centre networking if you are into that kind of thing.</p>
<p>The downside is complexity. Lots of complexity. The default VPC helps by doing the right thing for you, though it may not be the most secure setup. Another downside is the NATs, but more on that soon.</p>
<p>If you don't have a default VPC because your AWS account is more than a year old you are stuck in EC2-Classic with the option of building your own VPC without the goodness of the default VPC, or are you?</p>
<h2>T2 and EC2-Classic</h2>
<p>During my first attempt to launch a t2.micro with the <a href="http://aws.amazon.com/cli/" target="_blank">aws cli</a> I received an error saying a VPC was required. This started my most recent dive into the world VPC and the discovery that I was stuck in EC2-Classic.</p>
<p>Next I tried to lunch a t2.micro via the management console and something fascinating happened. The process took a bit longer during one of the steps, and all of a sudden I had a VPC in us-east-1 even though I have had an account there for years.</p>
<p>The VPC appears to be like a "Default VPC", but the default subnet flag is set to "no". I think a key feature of default subnets is that instance launched in them get public IPs by default, but that is now an option when you launch an instance.</p>
<p>It would appear that T2 instances can help continue to bridge the gap between EC2-Classic and default VPC.</p>
<h2>NATs</h2>
<p>When you read the official docs and the unofficial blog posts you hear a lot about creating private subnets and NAT instances. The NAT are EC2 instance which allow outgoing traffic for instance in private subnets which are entirely isolated from the internet.</p>
<p>The downside if you are trying to keep costs low is you have to paid for an extra instance just to have some private subnets. Private subnets though seem to be required for certain managed services like RDS, but if NATs are only required for outbound internet traffic, than that would only be needed for servers I need to install updates on myself.</p><p>
</p><p>Since RDS is managed by Amazon, I image they have there own NAT setup to connect to them and update packages. So my theory is I can use RDS in a private subnet without the extra costs of NATs. Though I want one of my RDS instance to be available across accounts, so I will be left with using security groups to secure them for now.</p>
