import bot from './assets/bot.svg'
import user from './assets/user.svg'


window.onload = () => {
    const tab_switchers = document.querySelectorAll('[data-switcher]');

    for (let i = 0; i < tab_switchers.length; i++) {
        const tab_switcher = tab_switchers[i];
        const page_id = tab_switcher.dataset.tab;

        tab_switcher.addEventListener('click', () => {
            document.querySelector('.tabs .tab.is-active').classList.remove('is-active');
            tab_switcher.parentNode.classList.add('is-active');

            SwitchPage(page_id);
        });
    }
}

function SwitchPage (page_id) {
    console.log(page_id);

    const current_page = document.querySelector('.pages .page.is-active');
    current_page.classList.remove('is-active');

    const next_page = document.querySelector(`.pages .page[data-page="${page_id}"]`);
    next_page.classList.add('is-active');
}



const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('https://saeeamopenai.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 
        console.log(parsedData)
        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})



const api_url =
    "https://script.google.com/macros/s/AKfycbxyLFEAmw7-tFzLR9pSQQefY_jIORiAe7txlzxU9zSLTVWDQWtH3409yq1k9KZxbJnM/exec";

// Defining async function
async function classapi(url) {

    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();

    classdatashow(data);
    projectdatashow(data);
}

// Defining async function


// Calling that async function
classapi(api_url);


// Function to define innerHTML for HTML table
function classdatashow(data) {
    let tab =
        ``;


    // Loop to access all rows
    for (let r of data.content) {
        tab += `
    <div class="col-12 col-sm-8 col-md-6 col-lg-4">
                       
                  
    <div class="card">
                   
                <a href="${r[1]}" target="_blank" class="btn btn-primary">${r[0]}</a>
                      
                      
                </div> </div>`;
    }
    // Setting innerHTML as tab variable
    document.querySelector("#classdata").innerHTML = tab;
};

function projectdatashow(data) {
    let tab =
        ``;


    // Loop to access all rows
    for (let r of data.content) {
        tab += `
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
                           
                      
        <div class="card">
                       
                    <a href="${r[3]}" target="_blank" class="btn btn-primary">${r[2]}</a>
                          
                          
                    </div> </div>`;
    }
    // Setting innerHTML as tab variable
    document.querySelector("#projectdata").innerHTML = tab;
};



let forms = document.querySelector("#dataforms");
forms.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector("#sub").value = "Submiting..";
    let data = new FormData(forms);
    fetch('https://script.google.com/macros/s/AKfycbxyLFEAmw7-tFzLR9pSQQefY_jIORiAe7txlzxU9zSLTVWDQWtH3409yq1k9KZxbJnM/exec', {
            method: "POST",
            body: data
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
            document.querySelector("#sub").value = "Submit"
            form.reset();
        });
});













