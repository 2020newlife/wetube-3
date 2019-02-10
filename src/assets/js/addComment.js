import axios from 'axios';

const addCommentForm = document.getElementById('jsAddCommentForm');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment, videoId, commentId) => {
  const div = document.createElement('div');
  div.className = 'commentBlock';
  const span = document.createElement('span');
  span.innerHTML = comment;
  const button = document.createElement('button');
  button.innerHTML = 'x';
  button.value = commentId;
  button.className = 'commentDelete';
  button.addEventListener('click', handleDeleteComment);
  div.appendChild(span);
  div.appendChild(button);
  commentList.prepend(div);
  increaseNumber();
};

const sendComment = async (videoId, comment) => {
  await axios({
    url: `/api/comment/add`,
    method: 'POST',
    data: {
      comment,
      videoId
    }
  }).then(response => {
    const { commentId } = response.data;
    addComment(comment, videoId, commentId);
  });
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input[name='comment']");
  const comment = commentInput.value;
  const videoID = addCommentForm.querySelector("input[name='videoId']").value;
  sendComment(videoID, comment);

  commentInput.value = '';
};

const handleDeleteComment = async event => {
  const commentId = event.target.value;

  const response = await axios({
    url: `/api/comment/delete`,
    method: 'POST',
    data: {
      commentId
    }
  });

  if (response.status === 200) {
    const commentDeleteButtonArray = document.getElementsByClassName('commentDelete');
    for (let i = 0; i < commentDeleteButtonArray.length; i += 1) {
      if (commentDeleteButtonArray[i].value === commentId) {
        commentDeleteButtonArray[i].parentElement.remove();
      }
    }
  }
};

function initAddCommentForm() {
  addCommentForm.addEventListener('submit', handleSubmit);

  const commentDeleteButtonArray = document.getElementsByClassName('commentDelete');
  for (let i = 0; i < commentDeleteButtonArray.length; i += 1) {
    commentDeleteButtonArray[i].addEventListener('click', handleDeleteComment);
  }
}

if (addCommentForm) {
  initAddCommentForm();
}
