import { tweetsData } from "./data.js";
const tweetInput = document.getElementById("tweet-input");
const tweetBtn = document.getElementById("tweet-btn");
const feed = document.getElementById("feed");
let heartclass = "";

tweetBtn.addEventListener("click", function () {
  tweetsData.push(tweetInput.value);
  console.log(tweetsData);
});

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
</div>`;
  });

  return feedHtml;
}

function render(list) {
  feed.innerHTML = getFeedHtml(list);
}

render(tweetsData);

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
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
