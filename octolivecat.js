
$.getJSON('https://api.github.com/events?callback=?', function(data) {
  var items = []

  console.log(data)

  data = data.data //get the payload.

  $.each(data, function(key, val) {

	//Get the user/org who did something.
	user = val.actor
	if (user == null) { user = val.org }

	//Create a div for this entry.
	item = document.createElement('div')
	
	item.id = val.id
	item.style.backgroundImage= 'url("'+user.avatar_url+'")'
	
	user = document.createTextNode(user.login)
	item.appendChild(user)
	item.appendChild(document.createElement('br'))
	
	switch (val.type)
	{
		case 'FollowEvent':
		    renderFollowEvent(val,item,user)
		    break
		case 'PullRequestReviewCommentEvent':
			renderPullRequestCommentEvent(val,item,user)
			break
		case 'ForkEvent':
			renderForkEvent(val,item,user)
			break
		case 'GistEvent':
			renderGistEvent(val,item,user)
			break
		case 'WatchEvent':
			renderWatchEvent(val,item,user)
			break
		case 'IssuesEvent':
			renderIssueEvent(val,item,user)
			break
		case 'GollumEvent':
			renderGollumEvent(val,item,user)
			break
		case 'IssueCommentEvent':
			renderInsertCommentEvent(val,item,user)
			break
		case 'PushEvent':
			renderPushEvent(val,item,user)
			break
		case 'CreateEvent':
			renderCreateEvent(val,item,user)
			break
		case 'MemberEvent':
			renderMemeberEvent(val,item,user)
			break
		case 'DownloadEvent':
			renderDownloadEvent(val,item,user)
			break
		case 'PullRequestEvent':
			renderPullRequestEvent(val, item, user)
			break
		case 'PullRequestReviewCommentEvent':
			renderPullRequestReviewCommentEvent(val, item, user)
			break
		case 'CommitCommentEvent':
			renderCommitCommentEvent(val, item, user)
			break
		default:
			unknownEventText = document.createTextNode("An unsupported event occured: "+val.type)
			item.appendChild(unknownEventText)
			break
	}
	
	$('body').append(item)
  });
});

function renderCommitCommentEvent(val, item, user) {}

function renderPullRequestReviewCommentEvent(val, item, user) {}

function renderMemberEvent(val,item,user) {}

function renderDownloadEvent(val,item,user) {}

function renderFollowEvent(val,item,user) {}

function renderForkEvent(val,item,user) {}

function renderGistEvent(val,item,user) {}

function renderWatchEvent(val,item,user) {}

function renderIssueEvent(val,item,user) {}

function renderInsertCommentEvent(val,item,user) {}

function renderPushEvent(val,item,user) {}

function renderCreateEvent(val,item,user) {}

function renderGollumEvent(val,item,user) {}

function renderPullRequestEvent(val, item, user) {}

function renderPullRequestCommentEvent(val,item,user)
{
	console.log(user+' has a PullRequestCommentEvent')

	event = document.createTextNode(val.type+' to ')
	repo = document.createElement('a')
	
	repo.href = 'http://github.com/'+val.repo.name
	repoTitle = document.createTextNode(val.repo.name)
	repo.appendChild(repoTitle)

	
	item.appendChild(event)
	item.appendChild(repo)
	

}

