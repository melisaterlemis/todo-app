var modal = document.getElementById("myModal");
var btn = document.getElementById("todo-input");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
};
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
const kaydet = document.getElementById("kaydet");
const edit = document.getElementById("edit");
edit.style.display = "none";
kaydet.style.display = "block";

//inputa girilen degerler veri tabanina kaydedildi
function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("input");
  let title = document.getElementById("textInput");
  let date = document.getElementById("dateInput");
  db.collection("todo-item").add({
    title: title.value,
    date: date.value,
    text: text.value,
    status: "active",
  });
  text.value = "";
  date.value = "";
  title.value = "";
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
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
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
function doEdit(e) {
  db.collection("todo-item")
    .doc(e.currentTarget.id)
    .update({
      title: document.getElementById("textInput").value,
      date: document.getElementById("dateInput").value,
      text: document.getElementById("input").value,
    });
  document.getElementById("textInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("input").value = "";
  if (e.currentTarget.condiction) {
    let aa = document.getElementsByClassName("editbtn");
    aa[0].removeEventListener("click", doEdit, true);
  }
}
//güncelleme işemi
function onClickEdit(item) {
  edit.style.display = "block";
  kaydet.style.display = "none";
  document.getElementById("myModal").style.display = "block";
  document.getElementById("textInput").value = item.title;
  document.getElementById("dateInput").value = item.date;
  document.getElementById("input").value = item.text;
  let aa = document.getElementsByClassName("editbtn");
  aa[0].removeEventListener("click", doEdit, true);

  aa[0].addEventListener("click", doEdit, true);
  aa[0].id = item.id;
  aa[0].condiction = true;
  let msg = document.getElementById("Text");
  msg.style.display = "none";
}
let popup = document.getElementById("popup");
function openPopup() {
  popup.classList.add("open-popup");
}
function closePopup() {
  popup.classList.remove("open-popup");
}
// veritabanindan gelen verileri olusturuyoruz ekranda veritabnini her guncelledeigimizde yeni ogeler uretitiyoruz
function generateItems(items) {
  let itemsHTML = "";
  items.forEach((item, index) => {
    itemsHTML += `
    <div id="todoItem" class="todo-item""> 
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
    <button onclick='onClickEdit(${JSON.stringify(
      item
    )})' class="btn edit"><i class="fal fa-pencil-alt"></i></button>
            <div class="todo-text ${
              item.status == "completed" ? "checked" : ""
            }">
           <span id="titleId" class="title-class">${item.title}</span>
           <span id="dateId" class="date-class">${item.date}</span> 
           <span id="textId"class="text-class">${item.text}</span> 
            </div>
            <div class="statu ${
              item.status == "active" ? "statu-active" : "statu-complated"
            }">Plan: ${item.status}</div>
          </div>
    `;
    document.querySelector(".todo-items").innerHTML = itemsHTML;
    creatEventListeners();
    kaydet.style.display = "block";
    edit.style.display = "none";
    setTimeout(() => {
      modal.style.display = "none";
    }, 1000);
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
function allList() {
  let todos = document.querySelector(".todo-items");
  let arrTodo = todos.getElementsByClassName("todo-item");
  let arrStatu = todos.getElementsByClassName("statu");

  for (let i = 0; i < arrStatu.length; i++) {
    arrStatu[i].innerHTML == "Plan: completed"
      ? arrTodo[i].classList.remove("gizle")
      : arrTodo[i].classList.remove("gizle");
  }
}
function activeList() {
  let todos = document.querySelector(".todo-items");
  let arrTodo = todos.getElementsByClassName("todo-item");
  let arrStatu = todos.getElementsByClassName("statu");

  for (let i = 0; i < arrStatu.length; i++) {
    arrStatu[i].innerHTML == "Plan: completed"
      ? arrTodo[i].classList.add("gizle")
      : arrTodo[i].classList.remove("gizle");
  }
}

function completed() {
  let todos = document.querySelector(".todo-items");
  let arrTodo = todos.getElementsByClassName("todo-item");
  let arrStatu = todos.getElementsByClassName("statu");

  for (let i = 0; i < arrStatu.length; i++) {
    arrStatu[i].innerHTML == "Plan: active"
      ? arrTodo[i].classList.add("gizle")
      : arrTodo[i].classList.remove("gizle");
  }
}

function clearAll() {
  db.collection("todo-item")
    .get()
    .then((res) => {
      res.docs.forEach((element) => {
        element.ref.delete();
      });
      document.getElementById("todoItem").parentElement.remove();
    });
}

getItems();
