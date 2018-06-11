
// $( document ).ready(function() {
//     debugger;
//     if(localStorage.getItem('token')){
//       $('.regForm').hide();
//       $('.loginForm').hide();
//       loadPage();
//     }
// });

let tokenVal = null;
let postPage = 0;
let loginYet = false;
let myId = null;

<!-- Registration -->
$('.regForm').hide();
$('.showMore').hide();
$('.newPostBar').hide();
$('.all-posts-container').hide();
$('.logoutDiv').hide();

var interval = window.setInterval(refresh, 30000);


$('.reg-button').on('click', function(event){
  event.preventDefault();
  let firstname = $('.fname').val();
  let lastname = $('.lname').val();
  let emailVal = $('.email').val();
  let passwordVal = $('.password').val();
  registerUser(firstname, lastname, emailVal, passwordVal);
});

$('.regLogin').on('click', function(event){
  event.preventDefault();
  $('.regForm').hide();
  $('.loginForm').show();
});

$('.loginReg').on('click', function(event){
  event.preventDefault();
  $('.loginForm').hide();
  $('.regForm').show();
});

$('.loginButton').on('click', function(event){
  event.preventDefault();
  let emailVal = $('.emailLogin').val();
  let passwordVal = $('.passwordLogin').val();
  loginUser(emailVal, passwordVal);
});

$('.all-posts-container').on('click', '.likePost',function(event){
  console.log('New click');
  event.preventDefault();

  $(this).toggleClass('active');
  let postId = $(this).closest('.post-container').attr('id');
  likeContent(postId);
  // let postCont = $(this).closest('.post-container');
  // let page = Math.floor($('.post-container').index(postCont) / 10) + 1;
  // updatePost(postId, page);
});

$('.showMore').on('click',function(event){
  console.log('Showing more...');
  event.preventDefault();
  loadPage(postPage);
});

$('.newPost').on('click',function(event){
  event.preventDefault();
  console.log('posting...');
  makePost();
});

$('.all-posts-container').on('click', '.replies',function(event){
  event.preventDefault();
  console.log('gettingComments');
  let postId = $(this).closest('.post-container').attr('id');
  let commentSection = $(this).parent().siblings('.comments');
  showComments(postId, commentSection);
  commentSection.toggleClass('collapse');
});

$('.all-posts-container').on('click', '.makeComment',function(event){
  event.preventDefault();
  let postId = $(this).closest('.post-container').attr('id');
  let content = $(this).closest('.post-container').find('.commentBar').val();
  $(this).closest('.post-container').find('.commentBar').val('');
  console.log('Attempting to make comment');
  makeComment(postId, content);
  let repliesNum = $(this).siblings('.replies').text();
  let array = repliesNum.split(' ');
  let update = Number(array[1]) + 1;
  $(this).siblings('.replies').text('Replies ' + update);
});

$('.logout').on('click',function(event){
  event.preventDefault();
  logoutUser();
});

function logoutUser(){
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/users/logout',
    method: 'GET',
    data: {
      token: localStorage.getItem('token')
    },
    success: function(posts){
      console.log('Logout Success', posts);
      $('.regForm').hide();
      $('.showMore').hide();
      $('.newPostBar').hide();
      $('.all-posts-container').hide();
      $('.logoutDiv').hide();
      $('.loginForm').show();
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}



function updatePost(postId, postSet){
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts/' + postSet,
    method: 'GET',
    data: {
      token: localStorage.getItem('token')
    },
    success: function(posts){
      console.log('Page Loaded!', posts);
      posts.response.forEach(function(post){
        if(post._id === postId){
          debugger;
          let addition = update(post);
          let nextPost = $('#' + postId).next();
          $('#' + postId).remove();
          nextPost.before(addition);
        }
      });
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}

function update(post){
  let element = `<div class = "post-container col-xs-6 col-xs-offset-3" id = "` + post._id +`">
                  <div class = "userAndTime">
                    <p class = "username">`+ post.poster.name +`</p>
                    <p class = "date text-right">` + post.createdAt +`</p>
                  </div>
                  <div class = "post">` + post.content + `</div>
                  <div class = "post-info text-center">
                    <input  name="comment" placeholder="Enter your comment" class="form-control commentBar col-xs-3"  type="text">
                    <button type="submit" class="btn  btn-info makeComment">Comment</button>
                    <button type="submit" class="btn  btn-info replies">`+ `Replies ` + post.comments.length + `</button>
                    <button type="submit" class="btn  btn-info likePost">`+ post.likes.length + `   ` + `<span class="glyphicon glyphicon-thumbs-up"></button>
                  </div>
                  <div class = "comments collapse"></div>
                 </div>`;

   let idArray = [];
   post.likes.forEach(function(liker){
     idArray.push(liker.id);
   });
   debugger;
   if(idArray.indexOf(myId) !== -1){
       element = `<div class = "post-container col-xs-6 col-xs-offset-3" id = "` + post._id +`">
                       <div class = "userAndTime">
                         <p class = "username">`+ post.poster.name +`</p>
                         <p class = "date text-right">` + post.createdAt +`</p>
                       </div>
                       <div class = "post">` + post.content + `</div>
                       <div class = "post-info text-center">
                         <input  name="comment" placeholder="Enter your comment" class="form-control commentBar col-xs-3"  type="text">
                         <button type="submit" class="btn  btn-info makeComment">Comment</button>
                         <button type="submit" class="btn  btn-info replies">`+ `Replies ` + post.comments.length + `</button>
                         <button type="submit" class="btn  btn-info likePost active">`+ post.likes.length + `   ` + `<span class="glyphicon glyphicon-thumbs-up"></button>
                       </div>
                       <div class = "comments collapse"></div>
                      </div>`;
   };
   // let array = post.likes;
   // array.forEach(function(liker){
   //   if(liker.id.indexOf(myId) !== -1){
   //     element = `<div class = "post-container col-xs-6 col-xs-offset-3" id = "` + post._id +`">
   //                     <div class = "userAndTime">
   //                       <p class = "username">`+ post.poster.name +`</p>
   //                       <p class = "date text-right">` + post.createdAt +`</p>
   //                     </div>
   //                     <div class = "post">` + post.content + `</div>
   //                     <div class = "post-info text-center">
   //                       <input  name="comment" placeholder="Enter your comment" class="form-control commentBar col-xs-3"  type="text">
   //                       <button type="submit" class="btn  btn-info makeComment">Comment</button>
   //                       <button type="submit" class="btn  btn-info replies">`+ `Replies ` + post.comments.length + `</button>
   //                       <button type="submit" class="btn  btn-info likePost active">`+ post.likes.length + `   ` + `<span class="glyphicon glyphicon-thumbs-up"></button>
   //                     </div>
   //                     <div class = "comments collapse"></div>
   //                    </div>`;
   //   }
   // })
   return element;

}

function refresh(){
  if(loginYet === true){
    postPage = 1;
    $('.post-container').remove();
    loadPage(postPage);
  }
}

function makeComment(id, comContent){
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts/comments/' + id,
    method: 'POST',
    data: {
      token: localStorage.getItem('token'),
      content: comContent
    },
    success: function(resp){
      console.log('Comments Made!', resp);
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}


function showComments(id, commentSection){
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts/comments/' + id,
    method: 'GET',
    data: {
      token: localStorage.getItem('token')
    },
    success: function(resp){
      console.log('Comments Loaded', resp);
      updateComments(resp.response, commentSection);
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}

function updateComments(comments, commentSection){
  if(commentSection.children().length !== 0){
    return;
  }
  comments.forEach(function(comment){
    let element = `<div class = "comment">
                      <div class = "user">` + comment.poster.name +`</div>
                      <div class = "content">` + comment.content +`</div>
                   <div>`;
    commentSection.append(element);
  });
}

function makePost(){
  let postContent = $('.postBar').val();
  $('.postBar').val('');
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts',
    method: 'POST',
    data: {
      token: localStorage.getItem('token'),
      content: postContent
    },
    success: function(resp){
      console.log('New post is up', resp);
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}

function likeContent(id){
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts/likes/' + id,
    method: 'GET',
    data: {
      token: localStorage.getItem('token')
    },
    success: function(resp){
      console.log('Post Liked!', resp);
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}

function loadPage(postSet){
  console.log("Something is happening!");
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts/' + postSet,
    method: 'GET',
    data: {
      token: localStorage.getItem('token')
    },
    success: function(posts){
      console.log('Page Loaded!', posts);
      $('.showMore').show();
      $('.all-posts-container').show();
      $('.logoutDiv').show();
      addPosts(posts.response);
      postPage++;
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}


function addPosts(posts){
  if(!posts.length){
    $('.showMore').hide();
  }
  posts.forEach(function(post){
    let element = `<div class = "post-container col-xs-6 col-xs-offset-3" id = "` + post._id +`">
                    <div class = "userAndTime">
                      <p class = "username">`+ post.poster.name +`</p>
                      <p class = "date text-right">` + post.createdAt +`</p>
                    </div>
                    <div class = "post">` + post.content + `</div>
                    <div class = "post-info text-center">
                      <input  name="comment" placeholder="Enter your comment" class="form-control commentBar col-xs-3"  type="text">
                      <button type="submit" class="btn  btn-info makeComment">Comment</button>
                      <button type="submit" class="btn  btn-info replies">`+ `Replies ` + post.comments.length + `</button>
                      <button type="submit" class="btn  btn-info likePost">`+ post.likes.length + `   ` + `<span class="glyphicon glyphicon-thumbs-up"></button>
                    </div>
                    <div class = "comments collapse"></div>
                   </div>`;
    //debugger;
    let array = post.likes;
    array.forEach(function(liker){
      if(liker.id.indexOf(myId) !== -1){
        element = `<div class = "post-container col-xs-6 col-xs-offset-3" id = "` + post._id +`">
                        <div class = "userAndTime">
                          <p class = "username">`+ post.poster.name +`</p>
                          <p class = "date text-right">` + post.createdAt +`</p>
                        </div>
                        <div class = "post">` + post.content + `</div>
                        <div class = "post-info text-center">
                          <input  name="comment" placeholder="Enter your comment" class="form-control commentBar col-xs-3"  type="text">
                          <button type="submit" class="btn  btn-info makeComment">Comment</button>
                          <button type="submit" class="btn  btn-info replies">`+ `Replies ` + post.comments.length + `</button>
                          <button type="submit" class="btn  btn-info likePost active">`+ post.likes.length + `   ` + `<span class="glyphicon glyphicon-thumbs-up"></button>
                        </div>
                        <div class = "comments collapse"></div>
                       </div>`;
      }
    })
    $('.all-posts-container').append(element);
  });
}

function loginUser(emailVal, passwordVal){
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/users/login',
    method: 'POST',
    data: {
      email: emailVal,
      password: passwordVal
    },
    success: function(data){
      console.log('It works!', data);
      localStorage.setItem('token', data.response.token);
      tokenVal = data.response.token;
      $('.loginForm').hide();
      postPage++;
      loadPage(postPage);
      $('.newPostBar').show();
      loginYet = true;
      myId = data.response.id;
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}


function registerUser(firstname, lastname, emailVal, passwordVal){
  $.ajax({
    url: 'https://horizons-facebook.herokuapp.com/api/1.0/users/register',
    method: 'POST',
    data: {
      fname: firstname,
      lname: lastname,
      email: emailVal,
      password: passwordVal
    },
    success: function(response){
      console.log('It works!', response);
      $('.regForm').hide();
      $('.loginForm').show();
    },
    error: function(err){
      console.log('Uh oh!', err);
    }
  })
}
