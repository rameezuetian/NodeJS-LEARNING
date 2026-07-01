function renderUsersList(users) {
    return `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
}

module.exports = {
    renderUsersList,
}
