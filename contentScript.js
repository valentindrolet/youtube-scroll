const ytdCommentsCommentsViewHeight = "280px";
const divSecondaryHeight = "900px";
var ytdPageManagerMarginTop, primaryDivPaddingTop, infoDivHeight, metaDivHeight, ytdCommentsHeaderHeight, ytdCommentsHeaderMargin, ytdCommentsHeight;
var ytdCommentsHeader, ytdComments;

function switchCommentsView() {
  const masthedContainerDiv = document.getElementById("masthead-container");
  const ytdPageManager = document.getElementsByTagName("ytd-page-manager");
  const primaryDiv = document.getElementById("primary");
  const infoDiv = document.evaluate("//div[@id='info']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const metaDiv = document.getElementById("meta");

  var ytdComments = document.evaluate("//ytd-comments[@id='comments']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  ytdCommentsObserver.observe(ytdComments, { childList: true, subtree: true });

  // Save default height, margin and padding
  ytdPageManagerMarginTop = ytdPageManager[0].style.marginTop;
  primaryDivPaddingTop = primaryDiv.style.paddingTop;
  infoDivHeight = infoDiv.style.height;
  metaDivHeight = metaDiv.style.height;

  // Hide top menu
  masthedContainerDiv.style.visibility = "collapse";
  ytdPageManager[0].style.marginTop = "0px";
  primaryDiv.style.paddingTop = "0px";

  // Hide infos, meta and comments unwanted elements
  infoDiv.style.visibility = "collapse";
  infoDiv.style.height = "0px";
  metaDiv.style.visibility = "collapse";
  metaDiv.style.height = "0px";

  // Quit comments view button
  var playerDiv = document.evaluate("//div[@id='primary-inner']/div[@id='player']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (playerDiv) {
    var aQuitCommentsView = document.createElement("a");
    aQuitCommentsView.className = "yt-simple-endpoint style-scope ytd-button-renderer";
    aQuitCommentsView.innerText = "Quit comments view";
    aQuitCommentsView.onclick = function () {
      // Show top menu
      masthedContainerDiv.style.visibility = "visible";
      ytdPageManager[0].style.marginTop = ytdPageManagerMarginTop;
      primaryDiv.style.paddingTop = primaryDivPaddingTop;

      // Show info, meta and comments elements
      infoDiv.style.visibility = "visible";
      infoDiv.style.height = infoDivHeight;
      metaDiv.style.visibility = "visible";
      metaDiv.style.height = metaDivHeight;

      switchCommentsSectionMode(false);
      document.getElementById("quit-comments-view").remove();
    }

    var ytdButtonRenderer = document.createElement("ytd-button-renderer");
    ytdButtonRenderer.id = 'quit-comments-view';
    ytdButtonRenderer.className = "style-scope ytd-menu-renderer";
    ytdButtonRenderer.setAttribute("is-icon-button", "");

    playerDiv.appendChild(ytdButtonRenderer);
    ytdButtonRenderer.appendChild(aQuitCommentsView);
  }
}

// Callback of ytd-comments mutation since this pannel is loaded only when needed
function ytdCommentsMutated(mutationsList) {
  // Hide comments section header
  ytdCommentsHeader = document.getElementsByTagName("ytd-comments-header-renderer");
  ytdComments = document.getElementsByTagName("ytd-comments");
  switchCommentsSectionMode(true);

  ytdCommentsObserver.disconnect();
}

function switchCommentsSectionMode(hide) {
  if (hide) {
    // Hide comments header section 
    if (ytdCommentsHeader) {
      ytdCommentsHeaderHeight = ytdCommentsHeader[0].style.height;
      ytdCommentsHeaderMargin = ytdCommentsHeader[0].style.margin;
      ytdCommentsHeader[0].style.visibility = "collapse";
      ytdCommentsHeader[0].style.height = "0px";
      ytdCommentsHeader[0].style.margin = "5px";
    }

    // Add comments section scroll
    if (ytdComments) {
      ytdCommentsHeight = ytdComments[0].style.height;
      ytdComments[0].style.overflowY = "scroll";
      ytdComments[0].style.height = ytdCommentsCommentsViewHeight;
    }
  }
  else {
    // Show comments header again
    if (ytdCommentsHeader) {
      ytdCommentsHeader[0].style.visibility = "visible";
      ytdCommentsHeader[0].style.height = ytdCommentsHeaderHeight;
      ytdCommentsHeader[0].style.margin = ytdCommentsHeaderMargin;
    }

    // Remove comments section scroll
    if (ytdComments) {
      ytdComments[0].style.overflowY = "hidden";
      ytdComments[0].style.height = ytdCommentsHeight;
    }
  }
}

const ytdCommentsObserver = new MutationObserver(ytdCommentsMutated);
var isCommentsView = false;
window.onload = function () {
  // Next video panel
  const divSecondary = document.getElementById("secondary");
  if (divSecondary) {
    divSecondary.style.height = divSecondaryHeight;
    divSecondary.style.overflowY = "scroll";
  }

  // Comments view button
  const ytdVideoPrimaryInfoRenderer = document.getElementsByTagName("ytd-video-primary-info-renderer");
  if (ytdVideoPrimaryInfoRenderer && ytdVideoPrimaryInfoRenderer.length > 0) {
    var aViewComments = document.createElement("a");
    aViewComments.className = "yt-simple-endpoint style-scope ytd-button-renderer";
    aViewComments.innerText = "Comments view";
    aViewComments.onclick = this.switchCommentsView;

    var ytdButtonRenderer = document.createElement("ytd-button-renderer");
    ytdButtonRenderer.className = "style-scope ytd-menu-renderer";
    ytdButtonRenderer.setAttribute("is-icon-button", "");

    ytdVideoPrimaryInfoRenderer[0].appendChild(ytdButtonRenderer);
    ytdButtonRenderer.appendChild(aViewComments);
  }
};