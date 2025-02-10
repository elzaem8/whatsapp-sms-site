async function fetchNumbers() {
    let numbersRef = db.ref("numbers");
    
    numbersRef.once("value", (snapshot) => {
        let list = document.getElementById("numbers-list");
        list.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            let numberData = childSnapshot.val();
            let li = document.createElement("li");
            li.innerHTML = `<strong>${numberData.number}</strong><br>`;
            
            if (numberData.messages) {
                li.innerHTML += "<ul>";
                numberData.messages.slice(-5).forEach(msg => {
                    li.innerHTML += `<li>${msg}</li>`;
                });
                li.innerHTML += "</ul>";
            } else {
                li.innerHTML += "لا توجد رسائل مستلمة بعد.";
            }

            list.appendChild(li);
        });
    });
}
