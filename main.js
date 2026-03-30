function showDetails() {
    alert("Showing employee details...");
}

function editContact() {
    alert("Edit feature coming soon...");
}

function deleteContact() {
    let confirmDelete = confirm("Are you sure you want to delete?");
    
    if (confirmDelete) {
        alert("Contact deleted!");
    }
}