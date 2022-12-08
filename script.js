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
//güncelleme işemi
function onClickEdit(item, a) {
  document.getElementById("myModal").style.display = "block";
  document.getElementById("textInput").value = item.title;
  document.getElementById("dateInput").value = item.date;
  document.getElementById("input").value = item.text;

  let aa = document.getElementsByClassName("editbtn");
  aa[0].addEventListener("click", function () {
    db.collection("todo-item")
      .doc(item.id)
      .update({
        title: document.getElementById("textInput").value,
        date: document.getElementById("dateInput").value,
        text: document.getElementById("input").value,
      });
  });
}

// veritabanindan gelen verileri olusturuyoruz ekranda veritabnini her guncelledeigimizde yeni ogeler uretitiyoruz
function generateItems(items) {
  let itemsHTML = "";
  items.forEach((item, index) => {
    itemsHTML += `
    <div class="todo-item""> 
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
    )}, this)' class="btn edit"><i class="fal fa-pencil-alt"></i></button>
            <div class="todo-text ${
              item.status == "completed" ? "checked" : ""
            }">
           <span id="titleId" class="title-class">${item.title}</span>
           <span id="dateId" class="date-class">${item.date}</span> 
           <span id="textId"class="text-class">${item.text}</span> 
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
