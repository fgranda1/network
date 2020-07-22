document.addEventListener('DOMContentLoaded', () => {

document.querySelectorAll('.likebutton').forEach(btn => {


let postId = btn.dataset.postid;


 function getlikes(){
   //enabling like button
   btn.classList.remove('btn-link');
   btn.classList.remove('disabled');
   //fetching
   fetch(`../api/likes/${postId}`).then(response => {

     if (response.status != 200) {
       console.log('Looks like there was a problem. Status Code: ' + response.status);
       return;
     }
     response.json().then(data => {
       // if (btn.dataset.liker in data['likers'])
       let likers = JSON.stringify(data['likers']).indexOf(btn.dataset.liker);
       ifLike(likers);
       ifNotLike(likers);

       btn.parentElement.querySelector('.likesCount').innerHTML = data['likes']['count'];
     });

   });



 }

//Getting likes on window load
 getlikes();

//if user liked the post
 function ifLike(value){

   if (value != -1){
     btn.parentElement.querySelector('.fa-heart').classList.remove('far');
     btn.parentElement.querySelector('.fa-heart').classList.add('fas');
     btn.onclick = () => {
       //giving server sometime to add the like and prevent errors
       btn.classList.add('btn-link');
       btn.classList.add('disabled');

       CSRFToken = document.querySelector('.hidden').firstChild.value;
       data = {'action': 'dislike'}
       fetch(`../api/liking/${postId}`, {
        method: "POST",
        headers: {
          'X-CSRFToken':CSRFToken,
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(data),
      });


       setTimeout(getlikes, 300);
       return false;


     }

   }

 }

//if user didnt liked the post
 function ifNotLike(value){

   if (value == -1){
     //giving server sometime to add the like and prevent errors
     btn.parentElement.querySelector('.fa-heart').classList.add('far');
     btn.parentElement.querySelector('.fa-heart').classList.remove('fas');

     btn.onclick = () => {

       btn.classList.add('btn-link');
       btn.classList.add('disabled');


       CSRFToken = document.querySelector('.hidden').firstChild.value;
       data = {'action': 'like'}
       fetch(`../api/liking/${postId}`, {
        method: "POST",
        headers: {
          'X-CSRFToken':CSRFToken,
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(data),
      });


       setTimeout(getlikes, 300);
       return false;

     }

   }

 }


})















})
