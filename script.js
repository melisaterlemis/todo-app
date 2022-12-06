var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("todo-input");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//inputa girilen degerler veri tabanina kaydedildi
function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("input"); //input le değiş
  db.collection("todo-item").add({
    text: text.value,
    status: "active",
  });
  text.value = "";
}
//veritabanina eklenen degerleri aldik
function getItems() {
  db.collection("todo-item").onSnapshot((snapshot) => {
    console.log(snapshot);
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    generateItems(items);
  });
}

//verileri database ve ekrandan silme işlemi
function onClickItem(e) {
  db.collection("todo-item")
    .doc(e.id)
    .delete()
    .then(() => {
      console.log("basarili");
    })
    .catch((error) => {
      console.log("basarisiz", error);
    });
}

// veritabanindan gelen verileri olusturuyoruz ekranda veritabnini her guncelledeigimizde yeni ogeler uretitiyoruz
function generateItems(items) {
  let itemsHTML = "";
  items.forEach((item) => {
    itemsHTML += `
    <div class="todo-item"> 
            <div class="check">
              <div data-id="${item.id}" class="check-mark ${
      item.status == "completed" ? "checked" : ""
    }">
                <img src="./assets/icon-check.svg" />
              </div>
            </div>
            <button onclick="onClickItem(this)" data-id="${item.id}" id="${
      item.id
    }" class="btn"><i class="fa fa-trash"></i></button>
            <div class="todo-text ${
              item.status == "completed" ? "checked" : ""
            }">
            ${item.text}
            </div>
           
          </div>
    `;
    document.querySelector(".todo-items").innerHTML = itemsHTML;
    creatEventListeners();
  });
}

function creatEventListeners() {
  let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
  todoCheckMarks.forEach((chechMark) => {
    chechMark.addEventListener("click", function () {
      markCompleted(chechMark.dataset.id);
    });
  });
}
//isaretlenen checkleri guncellemesi
function markCompleted(id) {
  //veri tabanindan geliyor
  let item = db.collection("todo-item").doc(id);
  item.get().then(function (doc) {
    if (doc.exists) {
      //veritabnndan status aldik
      let status = doc.data().status;
      if (status == "active") {
        item.update({
          status: "completed",
        });
      } else if (status == "completed") {
        item.update({
          status: "active",
        });
      }
    }
  });
}
getItems();
