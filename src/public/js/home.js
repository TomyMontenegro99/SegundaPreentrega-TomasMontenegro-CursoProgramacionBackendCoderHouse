console.log("home.js loaded");

async function deleteProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    // Recargar la página
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}