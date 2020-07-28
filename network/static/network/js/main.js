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

//Editing
document.querySelectorAll('.post').forEach(pst => {
  if(pst.dataset.postauthor == pst.dataset.user){
    //creating button
   const link = document.createElement('a');
   link.setAttribute('href', '');
   link.setAttribute('class', 'edit-btn');
   link.classList.add('btn-link')
   link.setAttribute('data-postid', pst.dataset.postid)
   link.innerHTML = '<i class="fas fa-edit"></i>';
   pst.querySelector('.edit').append(link)

   //Edit action

   pst.querySelector('.edit-btn').onclick = () => {

     pst.querySelector('.edit-btn').classList.toggle('disabled');

     const form = document.createElement('form')
     const textarea = document.createElement('textarea')
     const btn = document.createElement('button')
     textarea.setAttribute('class', 'form-control');
     textarea.classList.add('edit_post');
     textarea.setAttribute('rows', '3');
     textarea.required = true;
     textarea.innerHTML = pst.querySelector('.card-text').innerText;

     btn.classList.add('btn');
     btn.classList.add('btn-primary');
     btn.classList.add('mt-2');
     btn.classList.add('savebtn');

     btn.innerText = 'Save';

     pst.querySelector('.card-text').innerHTML = '';
     pst.querySelector('.card-text').append(textarea);
     pst.querySelector('.card-text').append(btn);

     //Updating
     pst.querySelector('.savebtn').onclick = () => {
        // disable edit btn
      pst.querySelector('.edit-btn').classList.toggle('disabled');
      // keeping edited text
      pst.querySelector('.card-text').innerHTML = pst.querySelector('.edit_post').value;
      //sending update request to server
      const postId = pst.dataset.postid;
      const message = pst.querySelector('.card-text').innerText;
      CSRFToken = document.querySelector('.hidden').firstChild.value;
      data = {'postid': postId, 'message': message}

      fetch(`../api/update_post/`, {
       method: "POST",
       headers: {
         'X-CSRFToken':CSRFToken,
         "X-Requested-With": "XMLHttpRequest"
       },
       body: JSON.stringify(data),
     });

     }


     return false;
   }

  }
})

















})
