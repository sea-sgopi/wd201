const today = new Date();
const minAge = 18;
const maxAge = 55;

const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

const dobInput = document.getElementById('dob');
dobInput.setAttribute('min', minDate.toISOString().split('T')[0]);
dobInput.setAttribute('max', maxDate.toISOString().split('T')[0]);

//  load items

const retriveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    if(entries) {
        entries = JSON.parse(entries);
    } 
    else{
        entries = []
    }
    return entries;
}

const displayEntries = () => {
    const entries = retriveEntries();
    let tableEntries = entries.map((entry) => {
        const nameCell = `<td>${entry.name}</td>`;
        const emailCell = `<td>${entry.email}</td>`;
        const passwordCell = `<td>${entry.password}</td>`;
        const dobCell = `<td>${entry.dob}</td>`;
        const acceptTermsCell = `<td>${entry.acceptTerms}</td>`;

        const row = `<tr>${nameCell} ${emailCell} ${passwordCell} ${dobCell} ${acceptTermsCell}</tr>`;
        return row;
    }).join("\n");

    const table = `
    <table style="border-collapse: collapse; width: 100%;" border="1";>
        <thead>
            <tr style="background-color: #333; color: white;">
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Dob</th>
                <th>Accepted Terms?</th>
            </tr>
        <tbody>
            ${tableEntries}
        </tbody>
    </table>`;

    let details = document.getElementById("user-entries");
    details.innerHTML = table;
}

displayEntries();

// store elements

let userEntries =  retriveEntries();
let userForm = document.getElementById("user-form")
const saveUserForm = (event) => {
    event.preventDefault();
    console.log(":skbksb");
    const name = document.getElementById("name").value;
    const email= document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptTerms = document.getElementById("acceptTerms").checked;

    const entry = {
        name, email, password,dob,acceptTerms
    };

    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));

    displayEntries();
}
userForm.addEventListener("submit", saveUserForm);

