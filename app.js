const API = "https://backend-registro-mv7j.onrender.com";
let token = "";

// LOGIN
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.token) return alert("Error: " + (data.error || "Credenciales incorrectas"));

    token = data.token;

    document.getElementById("loginCard").classList.add("oculto");
    document.getElementById("panelCard").classList.remove("oculto");

    loadUsers();
}


// CARGAR USUARIOS
async function loadUsers() {
    const res = await fetch(API + "/users", {
        headers: { Authorization: "Bearer " + token }
    });

    const users = await res.json();
    const tbody = document.getElementById("usersTableBody");

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

// RELLENAR CAMPOS PARA EDITAR
function fillEdit(id, name, role) {
    editId.value = id;
    editName.value = name;
    editRole.value = role;
}

// CREAR USUARIO
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
}

// EDITAR USUARIO
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
}

// ELIMINAR USUARIO
async function deleteUser(id) {
    if (!confirm("¿Seguro de eliminar este usuario?")) return;

    await fetch(API + "/users/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    });

    alert("Usuario eliminado");
    loadUsers();
}
