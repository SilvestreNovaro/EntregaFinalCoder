document.addEventListener("DOMContentLoaded", () => {
	fetchData();
	if (localStorage.getItem("carrito")) {
		carrito = JSON.parse(localStorage.getItem("carrito"));
		renderizarCarrito();
	}
});

const fetchData = async () => {
	try {
		const response = await fetch("data.json");
		const data = await response.json();
		renderizarProductos(data);
		detectarBtonoes(data);
	} catch (error) {
		console.log(error);
	}
};

let carrito = {};



const contenedorProductos = document.querySelector("#contenedor-productos");
const renderizarProductos = (data) => {
	const template = document.querySelector("#template-productos").content;
	const fragment = document.createDocumentFragment();
	data.forEach((producto) => {
		template.querySelector("img").setAttribute("src", producto.imagen);
		template.querySelector("h5").textContent = producto.nombre;
		template.querySelector("span").textContent = producto.precio;
		template.querySelector("button").dataset.id = producto.codigo;

		const clone = template.cloneNode(true);
		fragment.appendChild(clone);
	});
	contenedorProductos.appendChild(fragment);
};

const detectarBtonoes = (data) => {
	const botones = document.querySelectorAll(".card button");
	botones.forEach((btn) => {
		btn.addEventListener("click", () => {
			console.log(btn.dataset.id);
			const producto = data.find(
				(item) => item.codigo === parseInt(btn.dataset.id)
			);
			producto.cantidad = 1;
			if (carrito.hasOwnProperty(producto.codigo)) {
				producto.cantidad = carrito[producto.codigo].cantidad + 1;
			}
			carrito[producto.codigo] = { ...producto };
			console.log(carrito);
			renderizarCarrito();
		});
	});
};
const items = document.querySelector("#items");
const renderizarCarrito = (data) => {
	// Limpiar carrito coninner
	items.innerHTML = "";
	const template = document.querySelector("#template-carrito").content;
	const fragment = document.createDocumentFragment();
	Object.values(carrito).forEach((producto) => {
		template.querySelector("th").textContent = producto.codigo;
		template.querySelectorAll("td")[0].textContent = producto.nombre;
		template.querySelectorAll("td")[1].textContent = producto.cantidad;
		template.querySelectorAll("td")[3].textContent =
			producto.precio * producto.cantidad;

		// botones
		template.querySelector(".btn-info").dataset.id = producto.codigo;
		template.querySelector(".btn-danger").dataset.id = producto.codigo;

		const clone = template.cloneNode(true);
		fragment.appendChild(clone);
	});
	items.appendChild(fragment);

	renderizarFooter();
	accionarBotones();
	localStorage.setItem("carrito", JSON.stringify(carrito));
};

const footer = document.querySelector("#footer-carrito");
const renderizarFooter = () => {
	footer.innerHTML = "";
	const template = document.querySelector("#template-footer").content;
	const fragment = document.createDocumentFragment();
	// Sumas precio y cantidades totales
	const nCantidad = Object.values(carrito).reduce(
		(acum, { cantidad }) => acum + cantidad,
		0
	);
	const sumaPrecio = Object.values(carrito).reduce(
		(acum, { cantidad, precio }) => acum + cantidad * precio,
		0
	);
	template.querySelectorAll("td")[0].textContent = nCantidad;
	template.querySelector("span").textContent = sumaPrecio;
	const clone = template.cloneNode(true);
	fragment.appendChild(clone);

	footer.appendChild(fragment);

	const boton = document.querySelector("#vaciar-carrito");
	boton.addEventListener("click", () => {
		swal({
			title: "Esta seguro de vaciar su carrito?",
			text: "Una vez vaciado tendra que seleccionar sus productos de nuevo!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				swal("Carrito vaciado!", {
					icon: "success",
				});
				carrito = {};
				renderizarCarrito();
			} else {
				swal("Puede continuar comprando");
			}
		});
		// carrito = {};
		// renderizarCarrito();
	});
};

const accionarBotones = () => {
	const botonesAgregar = document.querySelectorAll("#items .btn-info");
	const botonesEliminar = document.querySelectorAll("#items .btn-danger");

	botonesAgregar.forEach((boton) => {
		boton.addEventListener("click", () => {
			carrito[boton.dataset.id];
			const producto = carrito[boton.dataset.id];
			producto.cantidad++;
			carrito[boton.dataset.id] = { ...producto };
			renderizarCarrito();
		});
	});
	botonesEliminar.forEach((boton) => {
		boton.addEventListener("click", () => {
			const producto = carrito[boton.dataset.id];
			producto.cantidad--;
			if (producto.cantidad === 0) {
				delete carrito[boton.dataset.id];
			} else {
				carrito[boton.dataset.id] = { ...producto };
			}
			renderizarCarrito();
		});
	});
};
