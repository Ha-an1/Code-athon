document.addEventListener("DOMContentLoaded", function() {
    const chatPopup = document.getElementById("chatPopup");
    const openChatBtn = document.getElementById("openChatBtn");
    const closeChatBtn = document.getElementById("closeChatBtn");
    const chatTooltip = document.getElementById("chatTooltip");

    openChatBtn.addEventListener("click", function() {
        chatPopup.style.display = "block";
        openChatBtn.style.display = "none"; // Hide the button
        chatTooltip.style.display = "none"; // Hide the tooltip
        setTimeout(() => {
            chatPopup.classList.add("show");
            document.getElementById("chat-body").scrollTop = document.getElementById("chat-body").scrollHeight;
            //appendMessage('bot', 'Welcome! How can I assist you today?');
        }, 10);
    });

    closeChatBtn.addEventListener("click", function() {
        chatPopup.classList.remove("show");
        setTimeout(() => {
            chatPopup.style.display = "none";
            openChatBtn.style.display = "block"; // Show the button again
        }, 300); // Matches the CSS transition duration
    });

    document.getElementById("sendBtn").addEventListener("click", function() {
        sendMessage1();
    });

    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage1();
        }
    });

    document.getElementById("scrollToTopBtn").addEventListener("click", function() {
        document.getElementById('chat-body').scrollTop = 0;
    });

    const policyLinks = {
        op1: "/guide#Code-of-Conduct",
        op2: "/guide#Time-Off-Policy",
        op3: "/guide#Remote-Work-Policy",
        op4: "/guide#Performance-Management-Policy",
        op5: "/guide#Intellectual-Property-Policy",
        op6: "/guide#Anti-Discrimination-and-Harassment-Policy",
        op7: "/guide#Health-and-Safety-Policy",
        op8: "/guide#IT-Security-Policy",
        op9: "/guide#Customer-Site-Visit-Policy",
        op10: "/guide#Bring-Your-Own-System-(BYOS)-Computer-Policy",
        op11: "/guide#Daily-Work-Shift-Policy",
        op12: "/guide#Annual-Appraisal-Policy",
        op13: "/guide#Notice-Period"
    };

    for (let id in policyLinks) {
        document.getElementById(id).addEventListener("click", function() {
            const message = `You can view the ${this.textContent} here: <a href="${policyLinks[id]}" target="_blank">${this.textContent}</a>`;
            appendMessage('bot', message);
        });
    }

    document.getElementById('runBtn').addEventListener('click', function() {
        fetch('http://127.0.0.1:5000/talk')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    appendMessage('user',data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    });

    const takeWord = data.message;
    const plsrespond = fetch('/capture', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({retkword: takeWord})
    });

    const ImData = plsrespond.json();
    if(ImData.error){
        appendMessage('bot','Error: '+ImData.error)
        appendMessage('bot',ImData.result)
    }



    async function sendMessage1() {
        const userInput = document.getElementById('user-input').value;
        if (!userInput) return;

        // Display user message
        appendMessage('user', userInput);

        // Send request to the backend
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: userInput })
        });

        const data = await response.json();
        if (data.error) {
            appendMessage('bot', 'Error: ' + data.error);
        } else {
            appendMessage('bot', data.result);
        }
        const speakWord = data.result;
        const respond = await fetch('/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({word: speakWord})
        });
    
        const token = await respond.json();
        if(token.error){
            appendMessage('bot','Error: ' + token.error);
        }else{
            appendMessage('bot', token.result);
        }

        // Clear input field
        document.getElementById('user-input').value = '';

        
    }



    function appendMessage(sender, message) {
        const chatBody = document.getElementById('chat-body');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        const avatarElement = document.createElement('div');
        avatarElement.classList.add('avatar');
        avatarElement.textContent = sender === 'user' ? 'U' : 'B';

        const textElement = document.createElement('div');
        textElement.classList.add('message');
        textElement.innerHTML = message;

        messageElement.appendChild(avatarElement);
        messageElement.appendChild(textElement);
        chatBody.appendChild(messageElement);

        // Scroll to the bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Show the tooltip after 2 seconds
    setTimeout(() => {
        chatTooltip.style.display = "block";
    }, 2000);
});

