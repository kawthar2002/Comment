let comments = [];

const deleteComment = (id) => {
  const filteredArray = comments.filter((comment) => comment.id !== id);
  comments = [...filteredArray];
};

let commentId = 1;
const commentIdAutoincrement = () => commentId++;

const formatTime = (date) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const oneDay = 1000 * 60 * 60 * 24;

  const today = now - start;
  const dayToFind = new Date(date) - start;

  const day = Math.floor(today / oneDay) - Math.floor(dayToFind / oneDay);

  switch (day) {
    case 0:
      return `Сегодня в ${Intl.DateTimeFormat('ru', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(date)}`;
    case 1:
      return `Вчера в ${Intl.DateTimeFormat('ru', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(date)}`;
    default:
      return Intl.DateTimeFormat('ru', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
  }
};

const commentName = document.getElementById('comment-name');
const commentBody = document.getElementById('comment-body');
const commentDate = document.getElementById('comment-date');

let formControl = document.querySelectorAll('.form-control');

loadComments();

const submitButton = document.querySelector('#comment-add');

const validate = () => {
  if (!commentBody.value && !commentBody.classList.contains('error')) {
    const errorMessage = document.createElement('span');
    errorMessage.innerText = 'Заполните это поле!';
    commentBody.classList.add('error');
    commentBody.parentElement.appendChild(errorMessage);
  }
  if (!commentName.value && !commentName.classList.contains('error')) {
    const errorMessage = document.createElement('span');
    errorMessage.innerText = 'Заполните это поле!';
    commentName.classList.add('error');
    commentName.parentElement.appendChild(errorMessage);
  }
};
const resetError = (event) => {
  if (event.target.value && event.target.classList.contains('error')) {
    event.target.classList.remove('error');
    event.target.parentElement.removeChild(
      event.target.parentElement.lastChild
    );
  }
};
commentName.addEventListener('input', resetError);
commentBody.addEventListener('input', resetError);

const submit = (event) => {
  event?.preventDefault();
  if (!commentName.value || !commentBody.value) {
    return validate();
  }
  const timestamp = Date.now();
  const comment = {
    id: commentIdAutoincrement(),
    name: commentName.value,
    body: commentBody.value,
    time: new Date(commentDate.value).getTime() || timestamp,
  };

  commentName.value = '';
  commentBody.value = '';
  commentDate.value = '';

  comments.push(comment);
  saveComments();
  showComments();
};
submit_form.addEventListener('keypress', (event) => {
  if (event.code === 'Enter' && !event.shiftKey) {
    submit(event);
  }
});
submitButton.addEventListener('click', submit);

function saveComments() {
  localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
  if (localStorage.getItem('comments')) {
    comments.push(...JSON.parse(localStorage.getItem('comments')));
    commentId = comments[comments.length - 1]?.id + 1 || commentId;
  }
  showComments();
}

function showComments() {
  let commentField = document.getElementById('comment-field');
  commentField.innerHTML = '';

  comments.forEach((item, idx, array) => {
    let out = '';

    const commentFieldInner = document.createElement('div');
    commentFieldInner.id = 'comment-field__inner';
    commentField.appendChild(commentFieldInner);

    let commentBlock = document.createElement('div');
    commentFieldInner.appendChild(commentBlock);
    commentBlock.classList.add('comment-field__body');

    let remove = document.createElement('button');
    commentFieldInner.appendChild(remove);
    remove.classList.add('remove');

    let like = document.createElement('button');
    commentFieldInner.appendChild(like);
    like.classList.add('like');

    out += `<p class="name" role="alert">${item.name}</p>`;
    out += `<p class="text" role="alert">${item.body}</p>`;
    out += `<p class="date">${formatTime(item.time)}</p>`;
    commentBlock.innerHTML = out;

    remove.onclick = () => {
      commentFieldInner.remove();
      deleteComment(item.id);
      localStorage.setItem('comments', JSON.stringify(comments));
    };

    like.addEventListener('click', () => {
      like.classList.toggle('liked');
    });
  });

  let formControl = document.querySelectorAll('.form-control');
  formControl.forEach((item) => {
    item.onfocus = function () {
      this.style.outline = 'none';
      this.classList.add('focused');
    };
    item.onblur = function () {
      this.classList.remove('focused');
    };
  });
}
