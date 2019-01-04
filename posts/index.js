$(document).ready(function(){
    $.ajax({
      url:'/entry/',
      type: 'GET',
      success: function(entries){
        for (var i = 0; i < entries.length; i++) {
          console.log(entries[i].id);
          const id = entries[i].id;
          var username = entries[i].username;
          var usernameDiv = document.createElement("div");
          var usernameNode = document.createTextNode(`${username} :`);
          usernameDiv.appendChild(usernameNode);
          usernameDiv.style.display = "inline-block";


          var upvotes = entries[i].upvote;
          var upvotesDiv = document.createElement("div");
          var upvotesNumber = document.createElement("div");
          var upvotesNode = document.createTextNode(`${upvotes}`);
          var upBtn = document.createElement("BUTTON");
          upBtn.setAttribute("id", `upvote${id}`);
          var upBtnTxt = document.createTextNode("UPVOTE");
          upBtn.appendChild(upBtnTxt);
          upvotesNumber.appendChild(upvotesNode);
          upvotesNumber.style.display="inline";
          upvotesDiv.appendChild(upBtn);
          upvotesDiv.appendChild(upvotesNumber);
          upvotesNumber.setAttribute("id",`upvoteTally${id}`);
          upvotesDiv.style.display = "inline-block";

          var putIdentifier = document.createElement("div");
          var putTxt = document.createTextNode(`${id}`);
          putIdentifier.appendChild(putTxt);
          putIdentifier.classList.add("putClass");
          putIdentifier.style.display="none";

          var downvotes = entries[i].downvote;
          var downvotesDiv = document.createElement("div");
          var downvotesNumber = document.createElement("div");
          var downvotesNode = document.createTextNode(`${downvotes}`);
          var downBtn = document.createElement("BUTTON");
          downBtn.setAttribute("id", `downvote${id}`);
          var downBtnTxt = document.createTextNode("DOWNVOTE");
          downBtn.appendChild(downBtnTxt);
          downvotesNumber.appendChild(downvotesNode);
          downvotesNumber.style.display="inline";
          downvotesDiv.appendChild(downBtn);
          downvotesDiv.appendChild(downvotesNumber);
          downvotesNumber.setAttribute("id",`downvoteTally${id}`);
          downvotesDiv.style.display = "inline-block";

          var description = entries[i].content;
          var descriptionDiv = document.createElement("div");
          var descriptionNode = document.createTextNode(`${description}`);
          descriptionDiv.appendChild(descriptionNode);

          var commentDiv = document.createElement("div");
          var commentForm = document.createElement("form");
          commentForm.setAttribute("id",`commentForm${id}`);
          console.log(commentForm.id);
          commentForm.method = 'POST';
          commentForm.enctype = "multipart/form-data";
          commentForm.action = `/comments/${id}?name=${0}`;
          commentForm.innerHTML=
          '<input type="textarea" name="newComment" placeholder="Type in comment here">'+
          '<input type="file" name="file">'+
          '<input type="submit" value="Post comment">'
          commentDiv.appendChild(commentForm);

          const comments = entries[i].comments;
          var allComments = document.createTextNode(`${comments}`);
          var commentsDiv = document.createElement("div");
          commentsDiv.setAttribute("id", `allComments${id}`);
          commentsDiv.appendChild(allComments);
          commentsDiv.style.display="block";

          var deletePostDiv = document.createElement("div");
          var deletePostBtn = document.createElement("BUTTON");
          deletePostBtn.setAttribute("id", `deletePost${id}`);
          var delBtnTxt = document.createTextNode("Delete Post");
          deletePostBtn.appendChild(delBtnTxt);
          deletePostDiv.appendChild(deletePostBtn);

          var info = document.createElement("div");
          info.classList.add("info");

          var media = document.createElement("div");
          media.classList.add("mediaClass");
          media.style.backgroundImage = `url(./images/${username}-${id}.png)`;

          var casing = document.createElement("div");
          casing.classList.add("casing");





          info.appendChild(putIdentifier);
          info.appendChild(usernameDiv);
          info.appendChild(upvotesDiv);
          info.appendChild(downvotesDiv);
          info.appendChild(descriptionDiv);
          info.appendChild(commentDiv);
          info.appendChild(commentsDiv);
          info.appendChild(deletePostDiv);

          casing.appendChild(media);
          casing.appendChild(info);

          casing.setAttribute("id", `casing${id}`);

          document.getElementById("sample").appendChild(casing);
          document.getElementById(`upvote${id}`).addEventListener("click",upvote);
          document.getElementById(`downvote${id}`).addEventListener("click",downvote);
          document.getElementById(`deletePost${id}`).addEventListener("click",deletePost);

          $(document).ready(function() {

               $(`#commentForm${id}`).submit(function() {

                  $(this).ajaxSubmit({

                      error: function(xhr) {
                  status('Error: ' + xhr.status);
                      },

                      success: function(entries) {
                        alert( "response sent" );
                        for (var i = 0; i < entries.length; i++) {
                          var comments = entries[i].comments;
                          const id = entries[i].id;
                          var allComments = document.createTextNode(`${comments}`);
                          $(`#allComments${id}`).empty();
                          document.getElementById(`allComments${id}`).appendChild(allComments);
                          console.log(entries);
                      }
              }});
                  //Very important line, it disable the page refresh.
              return false;
              });
          });
          //Submit comment
          //$(`#commentForm${id}`).submit(function(e){
          //  alert( "what now?" );
          //  e.preventDefault();
          //  console.log(`/comments/${id}`);
          //  $.ajax({
          //    url:`/comments/${id}`,
          //    enctype:'multipart/form-data',
          //    type:'post',
          //    data:$(`#commentForm${id}`).serialize(),
//              success:function(entries){
//                alert( "response sent" );
//                for (var i = 0; i < entries.length; i++) {
//                  var comments = entries[i].comments;
//                  const id = entries[i].id;
//                  var allComments = document.createTextNode(`${comments}`);
//                  $(`#allComments${id}`).empty();
//                  document.getElementById(`allComments${id}`).appendChild(allComments);
//                  console.log(entries);
//
//        }}
//    });
//});



        }

      console.log(entries);
    }


    });
});

function deletePost() {
var x = $(this).parent().siblings(".putClass")[0].innerHTML;
$(`#casing${x}`).remove();
console.log(x);
$.ajax({
  url: `/deletePost/${x}`,
  method: 'DELETE',
  success: function(entry){
console.log(entry);
  var id = entry.id;

  }

});

}


function upvote() {
var x = $(this).parent().siblings(".putClass")[0].innerHTML;
console.log(x);
$.ajax({
  url: `/upvote/${x}`,
  method: 'PUT',
  success: function(entry){
    var vo = entry.upvote;
    var id = entry.id;
    document.getElementById(`upvoteTally${id}`).innerHTML= `${vo}`
  console.log(entry);
  }

});

}

function downvote() {
var x = $(this).parent().siblings(".putClass")[0].innerHTML;
console.log(x);
$.ajax({
  url: `/downvote/${x}`,
  method: 'PUT',
  success: function(entry){
    var vo = entry.downvote;
    var id = entry.id;
    document.getElementById(`downvoteTally${id}`).innerHTML= `${vo}`

  console.log(entry);
  }

});

}
