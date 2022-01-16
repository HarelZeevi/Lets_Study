// let username = "";
// let pass = 3232314324;

// class user {
//     constructor(username, pass) {
//         this.username = username;
//         this.pass = pass;
//     }
// }
// let signupuser = new user("hello", "233JFKJs");

// var trying = new XMLHttpRequest();
// trying.send()
async function updateStudent(data = {})
{
        const res = await fetch('http://localhost:1234/api/students',{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
        return res.json();
}

async function fetchRoom(lessonId){
  const url = 'http://localhost:1234/api/lessonRoom/' + lessonId; 
  const res = await fetch(url).then(result => result.json()).then(data => {
    return data;
})
  return res;
}

$(document).ready(function(){
  const room = fetchRoom(1).then(value => {
  const domain = 'meet.jit.si';
  const options = {
      roomName: value[0].room,
      width: 1520,
      height: 700,
      parentNode: document.querySelector('#meet')
  };
  const api = new JitsiMeetExternalAPI(domain, options);
});
});



function onSubmit()
{
    const userCredentials = {
        fullname: document.getElementById("fullname").value,
        id: document.getElementById("studentId").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        gender: document.getElementById("gender").value,
        pswd: document.getElementById("pswd").value,
        studentCode: document.getElementById("studentCode").value,
    };
    alert(userCredentials);
    updateStudent(userCredentials).then(data => {
    console.log(data).catch((error) => {
        console.error('Error:', error);
      });;
   });
};





