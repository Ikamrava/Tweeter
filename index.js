import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

function getFeedHtml(array) {
  let feedHtml = "";

  array.forEach((tweet) => {
    let likeiconClass = "";
    if (tweet.isLiked) {
      likeiconClass = "liked";
    }

    let retweetsiconClass = "";
    if (tweet.isRetweeted) {
      retweetsiconClass = "retweeted";
    }
    let repliesHtml = "";
    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${reply.handle}</p>
                    <p class="tweet-text">${reply.tweetText}</p>
                </div>
            </div>
        </div> `;
      });
    }

    feedHtml += `
    <div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">

                <span class="tweet-detail">
                ${tweet.replies.length}
                <i class="fa-regular fa-comment-dots" data-reply= "${tweet.uuid}"></i>
                </span>

                <span class="tweet-detail" ">
                ${tweet.likes}
                <i class="fa-solid fa-heart ${likeiconClass}" data-like = "${tweet.uuid}"></i>
                </span>

                <span class="tweet-detail">
                ${tweet.retweets} 
                <i class="fa-solid fa-retweet ${retweetsiconClass}" data-retweet = "${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>

    <div id="replies-${tweet.uuid}" class="hidden">
    ${repliesHtml}
        
    </div>   
</div>`;
  });

  return feedHtml;
}

function render(list) {
  document.getElementById("feed").innerHTML = getFeedHtml(list);
}

render(tweetsData);

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplieClicks(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (!targetTweetObj.isLiked) {
    targetTweetObj.likes++;
    targetTweetObj.isLiked = true;
  } else {
    targetTweetObj.likes--;
    targetTweetObj.isLiked = false;
  }

  render(tweetsData);
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (!targetTweetObj.isRetweeted) {
    targetTweetObj.retweets++;
  } else {
    targetTweetObj.retweets--;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render(tweetsData);
}

function handleReplieClicks(tweetId) {
  document.getElementById(`replies-${tweetId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    tweetsData.unshift({
      tweetText: tweetInput.value,
      uuid: uuidv4(),
      handle: ``,
      profilePic: ``,
      likes: 0,
      retweets: 0,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render(tweetsData);
    tweetInput.value = "";
  }
}
