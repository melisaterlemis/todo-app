//inputa girilen degerler eri tabanına kaydedildi
function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");
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
            <div class="todo-text ${
              item.status == "completed" ? "checked" : ""
            }">
            ${item.text}
            </div>
          </div>
    `;
  });
  document.querySelector(".todo-items").innerHTML = itemsHTML;
  creatEventListeners();
}

function creatEventListeners() {
  let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
  todoCheckMarks.forEach((chechMark) => {
    chechMark.addEventListener("click", function () {
      markCompleted(chechMark.dataset.id);
    });
  });
}
//isaretlenen checkleri guncellemej
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
