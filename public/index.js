function upvote() {
  $.ajax({
    url:'/entry/:id',
    type: 'PUT',
    success: function(newVoteTally){
    console.log(newVoteTally);
    }
  })

}
