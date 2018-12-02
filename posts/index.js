setTimeout(function(){
    $.ajax({
      url:'/entry/',
      type: 'GET',
      success: function(entries){
        for (var i = 0; i < entries.length; i++) {
          console.log(entries[i].id);
          var id = entries[i].id;
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

          var comments = document.createElement("div");
          comments.innerHTML= '<form action="/comment/" method="post" enctype="multipart/form-data">'+
          '<input type="textarea" name="comment">'+
          '<input type="submit" value="Post comment">'+
          '</form>'

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
          info.appendChild(comments);

          casing.appendChild(media);
          casing.appendChild(info);

          document.getElementById("sample").appendChild(casing);
          document.getElementById(`upvote${id}`).addEventListener("click",upvote);
          document.getElementById(`downvote${id}`).addEventListener("click",downvote);

        }

      console.log(entries);
    }


    });
}, 10);

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
