const API = "https://backend-registro-mv7j.onrender.com";
let token = "";

// LOGIN
async function login() {
    const email = loginEmail.value;
    const password = loginPassword.value;

    const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.token) return alert("Error: " + (data.error || "Credenciales incorrectas"));

    token = data.token;

    loginCard.classList.add("oculto");
    panelCard.classList.remove("oculto");

    loadUsers();
}

// CERRAR SESIÓN
function logout() {
    token = "";
    panelCard.classList.add("oculto");
    loginCard.classList.remove("oculto");

    loginPassword.value = "";
}

// CARGAR USUARIOS
async function loadUsers() {
    const res = await fetch(API + "/users", {
        headers: { Authorization: "Bearer " + token }
    });

    const users = await res.json();
    const tbody = usersTableBody;

    tbody.innerHTML = "";

    users.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.full_name || "(Sin nombre)"}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>
                    <button class="btnSmall" onclick="fillEdit(${u.id}, '${u.full_name}', '${u.role}')">Editar</button>
                    <button class="btnSmall" onclick="deleteUser(${u.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// MOSTRAR/OCULTAR CREAR
function toggleCreate() {
    createCard.classList.toggle("oculto");
}

// RELLENAR EDITAR
function fillEdit(id, name, role) {
    editCard.classList.remove("oculto"); // mostrar formulario editar

    editId.value = id;
    editName.value = name;
    editRole.value = role;

    createCard.classList.add("oculto"); // ocultar crear si está abierto
}

// CREAR
async function createUser() {
    const body = {
        email: newEmail.value,
        password: newPassword.value,
        full_name: newName.value,
        role: newRole.value
    };

    await fetch(API + "/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify(body)
    });

    alert("Usuario creado");
    loadUsers();
    createCard.classList.add("oculto");
}

// EDITAR
async function editUser() {
    const body = {
        full_name: editName.value,
        role: editRole.value
    };

    await fetch(API + "/users/" + editId.value, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify(body)
    });

    alert("Usuario actualizado");
    loadUsers();
    editCard.classList.add("oculto");
}

// ELIMINAR
async function deleteUser(id) {
    if (!confirm("¿Seguro de eliminar este usuario?")) return;

    await fetch(API + "/users/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    });

    alert("Usuario eliminado");
    loadUsers();
}
