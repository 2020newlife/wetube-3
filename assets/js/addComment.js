import axios from 'axios';

const addCommentForm = document.getElementById('jsAddCommentForm');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = comment => {
  const div = document.createElement('div');
  div.className = 'commentBlock';
  const span = document.createElement('span');
  span.innerHTML = comment;
  const button = document.createElement('button');
  button.innerHTML = 'x';
  div.appendChild(span);
  div.appendChild(button);
  commentList.prepend(div);
  increaseNumber();
};

const sendComment = async (videoId, comment) => {
  const response = await axios({
    url: `/api/comment/add`,
    method: 'POST',
    data: {
      comment,
      videoId
    }
  });

  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input[name='comment']");
  const comment = commentInput.value;
  const videoID = addCommentForm.querySelector("input[name='videoId']").value;
  sendComment(videoID, comment);

  commentInput.value = '';
};

const handleDeleteComment = commentId => {
  console.log(commentId);
};

function initAddCommentForm() {
  addCommentForm.addEventListener('submit', handleSubmit);
}

if (addCommentForm) {
  initAddCommentForm();
}
