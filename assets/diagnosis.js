/* SEO problem diagnosis: runs entirely in the browser. Nothing is sent unless the visitor chooses to contact us. */
(function(){
  var root=document.getElementById('quiz');if(!root)return;
  var C={
    penalty:{t:'A manual action from Google',u:'/google-penalty-removal/',g:'Read: manual action removal',
      d:'Your answers point to a manual action. A reviewer at Google has flagged something on the site that breaks its spam policies, and affected pages lose visibility until it is fixed and a reconsideration request is approved.',
      c:['Open Search Console, Security & Manual Actions, and note the exact action type and whether it is site-wide or partial.','Fix every instance of the issue, not only the sample URLs Google lists.','Do not submit a reconsideration request until the cleanup is complete and documented.']},
    migration:{t:'Migration or redesign damage',u:'/site-migration-rescue/',g:'Read: migration rescue',
      d:'Your answers point to a problem introduced by a redesign, platform move or URL change. The usual causes are missing or wrong redirects, pages that were removed or thinned out, and staging settings that went live.',
      c:['Collect the old URLs from Search Console and analytics and test where each one goes now.','Check robots.txt and look for a site-wide noindex tag.','Compare old and new versions of the pages that used to bring in the most leads.']},
    technical:{t:'A technical fault',u:'/seo-audit-expert/',g:'Read: expert SEO audit',
      d:'Your answers point to a technical change, such as a plugin, theme, hosting or setting change, that stopped Google crawling, indexing or showing some pages. These faults are usually abrupt and often fixable quickly once found.',
      c:['Check the Page indexing report in Search Console for a jump in excluded pages.','Look for noindex tags, robots.txt changes or canonical tags pointing to the wrong URLs.','Test a few key pages with the URL Inspection tool.']},
    update:{t:'An algorithmic change from a Google update',u:'/google-update-recovery/',g:'Read: Google update recovery',
      d:'Your answers point to a Google update. For a core update, Google says this does not mean the site broke a rule; its systems now judge other pages more useful for those searches. Recovery comes from genuinely improving the affected content, and may not show until a later update.',
      c:['Check the dates on the Google Search Status Dashboard against your decline.','Wait at least a week after the update finishes, then compare the week after with the week before.','Look at what now ranks in your place for your most valuable searches.']},
    season:{t:'Seasonal or market demand',u:'/traffic-drop-recovery/',g:'Read: traffic drop diagnosis',
      d:'Your answers suggest the drop may be demand rather than rankings: fewer people searching, as happens every year for many Colorado businesses. That calls for patience and planning, not emergency changes.',
      c:['Set the Search Console Performance report to 16 months and compare the same period last year.','Check Google Trends for your main searches.','Look at average position: if it is steady while clicks fell, demand is the likely cause.']},
    tracking:{t:'A measurement or tracking problem',u:'/traffic-drop-recovery/',g:'Read: traffic drop diagnosis',
      d:'Your answers suggest the drop may be in your analytics rather than in Google. If Search Console shows steady clicks, the likely culprits are a broken tag, a consent banner change or a filter.',
      c:['Compare Search Console clicks with analytics sessions for the same dates.','Check when the tracking code or tag manager setup last changed.','Fix tracking before making any SEO changes.']},
    gbp:{t:'A Google Business Profile suspension',u:'/google-business-profile-suspended/',g:'Read: Business Profile suspensions',
      d:'Your answers point to a suspended or disabled Business Profile, which removes or freezes your Maps listing. The appeal process works, but each appeal can be submitted only once, so fix the cause and gather evidence first.',
      c:['Read the notice exactly as written: profile, content or account restriction.','Compare the business name, address and category with your signage and registration.','Do not create a new profile for the same business.']},
    local:{t:'A local ranking or Maps visibility problem',u:'/google-business-profile-denver.html',g:'Read: Business Profile guide',
      d:'Your answers point to weaker local visibility rather than a website problem: your Business Profile still exists but shows up less in Maps or the local pack.',
      c:['Check the profile for recent edits, including changes suggested by Google or users.','Review categories, service areas and hours against what the business really does.','Compare your reviews and photos with the competitors now appearing above you.']},
    ai:{t:'Clicks lost to AI Overviews or other search features',u:'/ai-overviews-visibility/',g:'Read: AI Overviews visibility',
      d:'Your answers suggest your rankings held while clicks fell, a pattern that often means AI Overviews or other features now sit above your result, or that competitors are being cited instead of you.',
      c:['In Search Console, find the queries where impressions are steady but clicks fell.','Search those queries yourself and note what appears above your result.','Make sure the pages you want cited state the key facts clearly and early.']},
    conversion:{t:'A conversion problem, not a traffic problem',u:'/seo-audit-expert/',g:'Read: expert SEO audit',
      d:'Your answers suggest visitors are arriving but not calling or filling in forms. More traffic will not fix that; the landing pages, calls to action, speed and tracking need attention first.',
      c:['Test your main pages on a phone: is the phone number one tap away?','Check that form submissions and calls are actually being recorded.','Look at which pages get search traffic and whether they ask for the next step.']},
    foundation:{t:'Missing SEO foundations',u:'/seo-consultant/',g:'Read: consulting and coaching',
      d:'Your answers suggest nothing broke; the site has simply never been built to earn search traffic. That needs a plan more than a rescue: the right pages for the right searches, a sound technical base and a healthy Business Profile.',
      c:['Set up Google Search Console if you have not, so you can see real data.','List the services and areas you want to be found for, and check each has a strong page.','Look at the three competitors you lose business to and what their pages offer.']}
  };
  var Q=[
    {q:'Which best describes the problem?',h:'Pick the closest match.',o:[
      ['Traffic or leads from Google fell',{}],
      ['We never had much search traffic',{foundation:3}],
      ['We have dropped out of Google Maps or our profile has an issue',{local:2,gbp:1}],
      ['AI answers and Overviews mention competitors, not us',{ai:3}],
      ['We get visitors, but few calls or forms',{conversion:4}]]},
    {q:'How did the change happen?',h:'Think about the shape of the decline in your reports.',o:[
      ['Suddenly, within a few days',{technical:2,penalty:1,migration:1,tracking:1}],
      ['Gradually, over several weeks',{update:2,season:1,ai:1}],
      ['Nothing changed: it has always been low',{foundation:3,conversion:1}],
      ['Not sure',{}]]},
    {q:'Did anything change on the website in the 60 days before?',h:'Include changes made by a developer, agency or hosting company.',o:[
      ['A redesign, new platform, new domain or new URLs',{migration:5}],
      ['A plugin, theme, hosting or setting change',{technical:4,tracking:1}],
      ['Pages were removed, merged or shortened',{migration:3,update:1}],
      ['Nothing that we know of',{update:1,season:1,penalty:1}],
      ['I do not know',{}]]},
    {q:'What does the Manual Actions report in Search Console say?',h:'In Search Console, under Security & Manual Actions.',o:[
      ['It lists a manual action',{penalty:8}],
      ['"No issues detected"',{}],
      ['We do not use Search Console',{foundation:1,technical:1}],
      ['Not sure where to look',{}]]},
    {q:'Did the decline line up with an announced Google update?',h:'Google lists update dates on its Search Status Dashboard.',o:[
      ['Yes, the dates match',{update:5}],
      ['No, the dates do not match',{technical:1,migration:1,season:1}],
      ['I have not checked',{}]]},
    {q:'How does it compare with the same months last year?',h:'Seasonal businesses often see the same dip every year.',o:[
      ['A similar dip happened last year too',{season:5}],
      ['It is clearly worse than last year',{update:1,technical:1,migration:1}],
      ['We do not have data from last year',{}]]},
    {q:'What is the status of your Google Business Profile?',h:'The listing that shows in Google Maps.',o:[
      ['It says suspended, disabled or restricted',{gbp:8}],
      ['It looks fine but shows up less in Maps',{local:4}],
      ['It is fine, or we do not rely on Maps',{}],
      ['We do not have one',{foundation:1,local:1}]]},
    {q:'What do Search Console and your analytics show?',h:'Search Console counts clicks from Google directly.',o:[
      ['Search Console is steady, but analytics dropped',{tracking:7}],
      ['Impressions steady, clicks down',{ai:4,update:1}],
      ['Impressions and clicks both down',{update:1,technical:1,migration:1,penalty:1}],
      ['I do not know or cannot access it',{}]]}
  ];
  var step=0,ans=new Array(Q.length);
  var form=root.querySelector('#qform'),bar=root.querySelector('.qprog span'),cnt=root.querySelector('.qcount'),
      back=root.querySelector('#qback'),next=root.querySelector('#qnext'),res=document.getElementById('qresult');
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function render(){
    var it=Q[step];
    var h='<fieldset><legend tabindex="-1" id="qleg">'+esc(it.q)+'</legend><p class="help">'+esc(it.h)+'</p><div class="opts">';
    it.o.forEach(function(o,i){h+='<label class="opt"><input type="radio" name="q" value="'+i+'"'+(ans[step]===i?' checked':'')+'><span>'+esc(o[0])+'</span></label>';});
    h+='</div></fieldset>';
    form.innerHTML=h;
    bar.style.width=Math.round(step/Q.length*100)+'%';
    cnt.textContent='Question '+(step+1)+' of '+Q.length;
    back.disabled=step===0;
    next.disabled=ans[step]===undefined;
    next.textContent=step===Q.length-1?'See my diagnosis':'Next';
    form.querySelectorAll('input').forEach(function(r){r.addEventListener('change',function(){ans[step]=+r.value;next.disabled=false;});});
  }
  function score(){
    var s={};Object.keys(C).forEach(function(k){s[k]=0;});
    ans.forEach(function(a,i){if(a===undefined)return;var w=Q[i].o[a][1];for(var k in w)s[k]+=w[k];});
    return Object.keys(s).map(function(k){return[k,s[k]];}).sort(function(a,b){return b[1]-a[1];});
  }
  function result(){
    var r=score(),top=r[0];
    if(top[1]===0){top=['technical',0];}
    var p=C[top[0]],also=r.slice(1).filter(function(x){return x[1]>0;}).slice(0,2);
    var max=Math.max(top[1],1);
    var summary=p.t+(also.length?' (also check: '+also.map(function(x){return C[x[0]].t;}).join('; ')+')':'');
    var h='<h2 id="res-h" tabindex="-1">Most likely: '+esc(p.t)+'</h2><p>'+esc(p.d)+'</p>';
    h+='<div class="primary"><h3>What to check first</h3><ol>'+p.c.map(function(x){return'<li>'+esc(x)+'</li>';}).join('')+'</ol><p style="margin:0"><a href="'+p.u+'">'+esc(p.g)+'</a></p></div>';
    if(also.length){h+='<h3>Also worth ruling out</h3><div class="also">'+also.map(function(x){var c=C[x[0]];return'<div><h4>'+esc(c.t)+'</h4><div class="meter"><i style="width:'+Math.round(x[1]/max*100)+'px"></i>weaker signal</div><p><a href="'+c.u+'">'+esc(c.g)+'</a></p></div>';}).join('')+'</div>';}
    h+='<p>This is an automated first read based on eight answers, not a diagnosis of your actual data. An expert review uses your Search Console and analytics to confirm or rule it out.</p>';
    h+='<div class="btn-row"><a class="btn btn-blue" href="/contact/?d='+encodeURIComponent(summary)+'">Send this result to an SEO expert</a><button class="btn btn-line" type="button" id="qagain">Start over</button></div>';
    res.innerHTML=h;res.hidden=false;root.hidden=true;
    var hh=document.getElementById('res-h');if(hh)hh.focus();
    document.getElementById('qagain').addEventListener('click',function(){ans=new Array(Q.length);step=0;res.hidden=true;root.hidden=false;render();document.getElementById('qleg').focus();});
  }
  back.addEventListener('click',function(){if(step>0){step--;render();document.getElementById('qleg').focus();}});
  next.addEventListener('click',function(){if(ans[step]===undefined)return;if(step<Q.length-1){step++;render();document.getElementById('qleg').focus();}else{bar.style.width='100%';result();}});
  root.querySelector('.qjs').hidden=false;
  render();
})();
