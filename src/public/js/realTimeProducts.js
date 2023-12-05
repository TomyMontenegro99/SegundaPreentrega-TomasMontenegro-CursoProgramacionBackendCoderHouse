console.log("realTime js loaded");
const socket = io();

const form = document.getElementById("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = form.elements.title.value;
  const description = form.elements.description.value;
  const price = form.elements.price.value;
  const thumbnail = form.elements.thumbnail.value;
  const code = form.elements.code.value;
  const stock = form.elements.stock.value;
  const category = form.elements.category.value;

  const newProduct = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  };
  console.log(newProduct);
  socket.emit("new-product", newProduct);
  form.reset();
});

socket.on("refresh-products", (data) => {
  console.log("refresh-products", data);
  window.location.reload();
});

function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.location.reload();
    })
    .catch((err) => console.log(err));
}
