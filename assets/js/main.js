(function () {
  var cfg = window.SITIO || {};

  // Links de WhatsApp: se arman con el número y mensaje de config.js
  // Los que tienen data-wa-tema arman el mensaje con el servicio ("Hola, quisiera consultar por Derecho Laboral.")
  if (cfg.whatsapp) {
    document.querySelectorAll("a[data-wa]").forEach(function (a) {
      var tema = a.getAttribute("data-wa-tema");
      var texto = tema ? "Hola, quisiera hacer una consulta sobre " + tema + "." : (cfg.mensajeWhatsapp || "");
      var num = a.getAttribute("data-wa-num") || cfg.whatsapp; // data-wa-num: otro número (Dra. Gaspar)
      a.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(texto);
    });
  }

  // Menú desplegable
  var menuBoton = document.querySelector(".menu__boton");
  var menuLista = document.getElementById("menu-lista");
  if (menuBoton && menuLista) {
    var abrir = function (si) {
      menuBoton.setAttribute("aria-expanded", si ? "true" : "false");
      menuLista.hidden = !si;
    };
    menuBoton.addEventListener("click", function () {
      abrir(menuLista.hidden);
    });
    menuLista.addEventListener("click", function (e) {
      if (e.target.closest("a")) abrir(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menuLista.hidden) { abrir(false); menuBoton.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!menuLista.hidden && !e.target.closest(".menu")) abrir(false);
    });
  }

  // Año del pie
  var anio = document.querySelector("[data-anio]");
  if (anio) anio.textContent = new Date().getFullYear();

  // Formulario
  var form = document.getElementById("form-contacto");
  if (!form) return;
  var estado = form.querySelector(".form__estado");
  var boton = form.querySelector("button[type=submit]");

  var mensajes = {
    nombre: "Escriba su nombre.",
    telefono: "Déjenos un teléfono o WhatsApp para poder responderle.",
    email: "Revise el mail, parece que tiene un error.",
    consulta: "Cuéntenos brevemente su consulta."
  };

  function marcar(campo, texto) {
    var id = campo.id + "-error";
    var previo = document.getElementById(id);
    if (previo) previo.remove();
    if (texto) {
      var p = document.createElement("p");
      p.className = "error"; p.id = id; p.textContent = texto;
      campo.insertAdjacentElement("afterend", p);
      campo.setAttribute("aria-invalid", "true");
      campo.setAttribute("aria-describedby", id);
    } else {
      campo.removeAttribute("aria-invalid");
      campo.removeAttribute("aria-describedby");
    }
  }

  function validar() {
    var primero = null;
    ["nombre", "telefono", "email", "consulta"].forEach(function (n) {
      var c = form.elements[n];
      var valor = c.value.trim();
      var mal = (c.required && !valor) ||
        (n === "telefono" && valor && valor.replace(/\D/g, "").length < 8) ||
        (n === "email" && valor && !c.checkValidity());
      marcar(c, mal ? mensajes[n] : "");
      if (mal && !primero) primero = c;
    });
    if (primero) primero.focus();
    return !primero;
  }

  function mostrar(texto, ok) {
    estado.textContent = texto;
    estado.className = "form__estado " + (ok ? "ok" : "mal");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validar()) return;
    if (form.elements._gotcha.value) return; // bot

    if (!cfg.formulario) {
      mostrar("El formulario todavía no está conectado. Mientras tanto, escríbanos por WhatsApp.", false);
      return;
    }

    boton.disabled = true;
    boton.textContent = "Enviando…";
    fetch(cfg.formulario, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      mostrar("¡Gracias! Recibimos su consulta y le vamos a responder a la brevedad.", true);
    }).catch(function () {
      mostrar("No se pudo enviar. Pruebe de nuevo o escríbanos por WhatsApp al 11 2280-3341.", false);
    }).finally(function () {
      boton.disabled = false;
      boton.textContent = "Enviar consulta";
    });
  });
})();
