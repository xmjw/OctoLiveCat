
$.getJSON('https://api.github.com/events?callback=?', function(data) {
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
	whoTag = document.createElement('a')
	whoTag.href = whoLink;
	whoTag.appendChild(document.createTextNode(who))
	
	whatTag = document.createElement('a')
	whatTag.href = whatLink;
	whatTag.appendChild(document.createTextNode(what))
	
	didText = document.createTextNode(did)
	
	span = document.createElement('span')
	
	span.appendChild(whoTag)
	span.appendChild(didText)	
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

function createCommitDetail(user,val)
{
	commits = createDetail(user)
	for (var i = 0; i < val.payload.commits.length; i++) {
		commitLink = document.createElement('a')
		commitLink.href = "http://github.com/"+val.repo.name+"commits"+val.payload.commits[i].sha
		commitLink.appendChild(document.createTextNode(val.payload.commits[i].sha.substring(0,7)))
		
		commits.appendChild(commitLink)
	    commits.appendChild(document.createTextNode(" "+val.payload.commits[i].message))
		commits.appendChild(document.createElement('br'))
	}
	return commits
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

function renderDownloadEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -220px"

	title = document.createTextNode(user.login + ' downloaded '+val.payload.download.name)

	desc = document.createTextNode(val.payload.download.description)
	url = val.payload.download.html_url
	content_type = val.payload.download.content_type
		
	item.appendChild(title)
	item.appendChild(document.createElement('br'))
	item.appendChild(desc)
}

function renderFollowEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -198px"

	user = document.createTextNode(user.login + ' followed')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
	
}

function renderForkEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -242px"

	user = document.createTextNode(user.login + ' forked')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

function renderGistEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -176px"

	user = document.createTextNode(user.login + ' created gist')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))	
}

function renderWatchEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -220px"

	user = document.createTextNode(user.login + ' watching')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

function renderIssueEvent(val,item,icon,user) 
{
	icon.style.backgroundPosition = "0px -88px"

	user = document.createTextNode(user.login + ' issue')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}

function renderIssueCommentEvent(val,item,icon,user)
{
	icon.style.backgroundPosition = "0px -66px"

	user = document.createTextNode(user.login + ' commented')	
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
}  



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
	//Append the description into a details seciton:
	detail = createDetail(user)
	detail.appendChild(document.createTextNode(val.payload.description))
	item.appendChild(detail)
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

