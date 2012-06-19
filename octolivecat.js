
//This requires support for OAuth
$.getJSON('https://api.github.com/users/xmjw/events?callback=?', function(data) {
  var items = []

  console.log(data)

  data = data.data //get the payload.

  $.each(data, function(key, val) {

	//Get the user/org who did something.
	user = val.actor
	if (user == null) { user = val.org }

	container = document.createElement('div')
	$('body').append(container)

	//Create a div for this entry.
	item = document.createElement('div')
	item.id = val.id
	item.className = 'event'
	icon = document.createElement('div')
	icon.className = 'icon'

	container.appendChild(icon)
	container.appendChild(item)
	
	switch (val.type)
	{
		case 'FollowEvent':                   renderFollowEvent(val,item,icon,user); break;
		case 'PullRequestReviewCommentEvent': renderPullRequestCommentEvent(val,item,icon,user); break;
		case 'ForkEvent':                     renderForkEvent(val,item,icon,user); break;
		case 'GistEvent':                     renderGistEvent(val,item,icon,user); break;
		case 'WatchEvent':                    renderWatchEvent(val,item,icon,user); break;
		case 'IssuesEvent':                   renderIssueEvent(val,item,icon,user); break;
		case 'GollumEvent':                   renderGollumEvent(val,item,icon,user); break;
		case 'IssueCommentEvent':             renderIssueCommentEvent(val,item,icon,user); break;
		case 'PushEvent':                     renderPushEvent(val,item,icon,user); break;
		case 'CreateEvent':                   renderCreateEvent(val,item,icon,user); break;
		case 'MemberEvent':	                  renderMemberEvent(val,item,icon,user); break;
		case 'DownloadEvent':                 renderDownloadEvent(val,item,icon,user); break;
		case 'PullRequestEvent':              renderPullRequestEvent(val, item,icon, user); break;
		case 'PullRequestReviewCommentEvent': renderPullRequestReviewCommentEvent(val, item,icon, user);	break;
		case 'CommitCommentEvent':            renderCommitCommentEvent(val, item,icon, user); break;
		case 'DeleteEvent':                   renderDeleteEvent(val,item,icon,user);break; 
		default: 
			unknownEventText = document.createTextNode("An unsupported event occured: "+val.type);
			item.appendChild(unknownEventText);
			break;
	}
  });
});

function createActionTitle(who,did,what,whoLink,whatLink,when)
{
	whoTag = null;
	if (who != null)
	{
		whoTag = document.createElement('a')
		whoTag.href = whoLink;
		whoTag.appendChild(document.createTextNode(who))
	}
	if (who == null)
	{
		whoTag = document.createElement('span')
		whoTag.className = 'anonymous'
		whoTag.appendChild(document.createTextNode('Anonymous user'))
	}
	
	whatTag = document.createElement('a')
	whatTag.href = whatLink;
	whatTag.appendChild(document.createTextNode(what))
	
	didText = document.createTextNode(did)
	
	span = document.createElement('span')
	span.className = 'title'
	
	span.appendChild(whoTag)
	span.appendChild(didText)	
	span.appendChild(whatTag)
	span.appendChild(document.createTextNode(", "+prettyDate(when)))
	
	return span
}

function createActionOnSomethingTitle(who,did,what,on,whoLink,whatLink,onLink,when)
{
	whoTag = null;
	if (who != null)
	{
		whoTag = document.createElement('a')
		whoTag.href = whoLink;
		whoTag.appendChild(document.createTextNode(who))
	}
	if (who == null)
	{
		whoTag = document.createElement('span')
		whoTag.className = 'anonymous'
		whoTag.appendChild(document.createTextNode('Anonymous user'))
	}
	
	whatTag = document.createElement('a')
	whatTag.href = whatLink
	whatTag.appendChild(document.createTextNode(what))
	
	didText = document.createTextNode(did)
	
	onTag = document.createElement('a')
	onTag.href = onLink
	onTag.appendChild(document.createTextNode(on))
	
	span = document.createElement('span')
	span.className = 'title'
	
	span.appendChild(whoTag)
	span.appendChild(didText)	
	span.appendChild(onTag)
	span.appendChild(document.createTextNode(' on '))
	span.appendChild(whatTag)
	span.appendChild(document.createTextNode(", "+prettyDate(when)))
	
	return span
}

function createDetail(user)
{
	d = document.createElement('div')
	d.className = 'detail'
	d.style.backgroundImage = "url('"+user.avatar_url+"')"	
	return d
}

function revealDetail(span,link)
{
	$('#'+span).slideDown('normal');
	$('#'+link).hide();
}

function createCommitDetail(user,val)
{
	commits = createDetail(user)
	span = null
	for (var i = 0; i < val.payload.commits.length; i++) {
		if (val.payload.commits.length > 3 && i == 2)
		{
			span = document.createElement('div')
			span.id = val.payload.commits[i].sha.substring(0,10) //we can be lazy, as this is unique.
			span.className = 'detail hidden'
			commits.appendChild(span);

			more = document.createElement('a')
			more.appendChild(document.createTextNode((val.payload.commits.length-i)+' more'))
			more.href = "javascript: revealDetail('"+val.payload.commits[i].sha.substring(0,10)+"','"+val.payload.commits[i].sha.substring(10,20)+"');";
			more.id = val.payload.commits[i].sha.substring(10,20);
			commits.appendChild(more)
		}
		
		
		commitLink = document.createElement('a')
		commitLink.href = "http://github.com/"+val.repo.name+"/commits/"+val.payload.commits[i].sha
		commitLink.appendChild(document.createTextNode(val.payload.commits[i].sha.substring(0,7)))
		
		if (val.payload.commits.length > 3 && i > 1)
		{
			span.appendChild(commitLink)
	    	span.appendChild(document.createTextNode(" "+val.payload.commits[i].message))
			span.appendChild(document.createElement('br'))
		}
		else
		{
			commits.appendChild(commitLink)
	    	commits.appendChild(document.createTextNode(" "+val.payload.commits[i].message))
			commits.appendChild(document.createElement('br'))
		}
	}
	return commits
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////                                                               /////////////////////
/////////////////////                             Renderes                          /////////////////////
/////////////////////                                                               /////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


function renderPushEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -22px"
	item.appendChild(createActionTitle(user.login," pushed to ",val.repo.name,"http://github.com/"+user.login,"http://github.com/"+val.repo.name,val.created_at))
	item.appendChild(createCommitDetail(user,val))	
}

function renderCreateEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px 0px"
	item.appendChild(createActionTitle(user.login," created ",val.repo.name,"http://github.com/"+user.login,"http://github.com/"+val.repo.name,val.created_at))
	detail = createDetail(user)
	detail.className = 'detail quote'
	detail.appendChild(document.createTextNode(val.payload.description))
	item.appendChild(detail)
}

function renderFollowEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -198px"

	item.appendChild(createActionTitle(user.login," followed ",val.payload.target.name,"http://github.com/"+user.login,"http://github.com/"+val.payload.target.name,val.created_at))

	arrow = document.createElement('img')
	arrow.className = 'arrow'
	arrow.src = 'right.png'
	
	followed = document.createElement('img')
	followed.src = val.payload.target.avatar_url
	followed.className = 'avatar'
	
	detail = createDetail(user,val)
	detail.appendChild(arrow)
	detail.appendChild(followed)

	item.appendChild(detail)
}

function renderGistEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -176px"

	action = " did something to Gist "
	switch(val.payload.action)
	{
		case "create":
			action = " created Gist ";
			break
		case "update":
			action = " updated Gist ";
			break;
		case "delete":
			action = " deleted Gist ";
			break;
		default: console.log("Unhandled Gist Event: '"+val.payload.action+"'")
			break;
	}

	item.appendChild(createActionTitle(user.login,action,val.payload.gist.id,"http://github.com/"+user.login,val.payload.gist.html_url,val.created_at))

	detail = createDetail(user)
	span = document.createElement('span')
	span.className = 'quote'
	
	desc = val.payload.gist.description
	if (desc == "") desc = 'No Description'
	
	span.appendChild(document.createTextNode(desc))
	span.className = 'quote'
	detail.appendChild(span)
	item.appendChild(detail)
}

function renderWatchEvent(val,item,icon,user) 
{
	//These are very stream lined, the extra data is pointless...
	icon.style.backgroundPosition = "0px -220px"
	item.appendChild(createActionTitle(user.login," "+val.payload.action+" watching ",val.repo.name,"http://github.com/"+user.login,"http://github.com/"+val.repo.name,val.created_at))
}

function renderIssueEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -88px"
    item.appendChild(createActionOnSomethingTitle(user.login," "+val.payload.action+" ",val.repo.name," issue "+val.payload.issue.number+" ","http://github.com/"+user.login,"http://github.com/"+val.repo.name,val.payload.issue.html_url,val.created_at))
	
	detail = createDetail(user)
	span = document.createElement('span')
	span.className = 'quote'
	span.appendChild(document.createTextNode(val.payload.issue.body))
	span.className = 'quote'
	detail.appendChild(span)
	item.appendChild(detail)
}

function renderIssueCommentEvent(val,item,icon,user)
{
	icon.style.backgroundPosition = "0px -66px"
    item.appendChild(createActionOnSomethingTitle(user.login,
	                                              " "+val.payload.action+" a ",
	                                              "issue "+val.payload.issue.number,
	                                              " comment ",
	                                              "http://github.com/"+user.login,
	                                              val.payload.issue.html_url,
	                                              val.payload.issue.html_url+"#issuecomment-"+val.payload.comment.id,
	                                              val.created_at))
	
	detail = createDetail(user)
	span = document.createElement('span')
	span.className = 'quote'
	span.appendChild(document.createTextNode(val.payload.comment.body))
	span.className = 'quote'
	detail.appendChild(span)
	item.appendChild(detail)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////                                                               /////////////////////
/////////////////////                      Unfinised Event Renderes                 /////////////////////
/////////////////////                                                               /////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderDownloadEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -220px"

	//Still haven't actually seen one of these. Need a test spec to help
	title = document.createTextNode(user.login + ' downloaded '+val.payload.download.name)

	desc = document.createTextNode(val.payload.download.description)
	url = val.payload.download.html_url
	content_type = val.payload.download.content_type
		
	item.appendChild(title)
	item.appendChild(document.createElement('br'))
	item.appendChild(desc)
}

function renderForkEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -242px"

	user = document.createTextNode(user.login + ' forked')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

function renderDeleteEvent(val,item,icon,user)
{
	icon.style.backgroundPosition = "0px -110px"

	user = document.createTextNode(user.login + ' deleted')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))	
}

function renderCommitCommentEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -154px"

	user = document.createTextNode(user.login + ' commited commented')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

function renderPullRequestReviewCommentEvent(val,item,icon,user) 
{
	console.log("PullRequestReviewComment event will go un shown.")
	
}

function renderMemberEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -198px"

	user = document.createTextNode(user.login + ' did a member thing')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
	
}


function renderGollumEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -308px"

	user = document.createTextNode(user.login + " gollum'd")
		
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

function renderPullRequestEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -264px"

	user = document.createTextNode(user.login + ' pull request')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

function renderPullRequestCommentEvent(val,item,icon,user)
{
	icon.style.backgroundPosition = "0px -264px"

	user = document.createTextNode(user.login + ' commented on pull reqest')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

