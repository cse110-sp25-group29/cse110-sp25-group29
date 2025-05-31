document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-theme');

      toggleBtn.textContent = body.classList.contains('dark-theme') ? '🔆' : '🌙';
    });

    yourCardFeature();
    uploadFeature();
    
});

function uploadFeature() {
    const uploadBtn = document.querySelector('#upload-button');
    
    uploadBtn.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.id = "overlay";
        const dialogBox = document.createElement('div');
        const rect = uploadBtn.getBoundingClientRect();
        dialogBox.style.left = `${rect.left}px`;
        dialogBox.style.top = `${rect.top - dialogBox.offsetHeight - 10}px`;
        dialogBox.id = "dialogBox";
        // dialogBox.innerText = 'Drag and drop a file here';

        const dropZone = document.createElement('div');
        dropZone.id = "dropZone";
        dropZone.innerText = 'Drag and drop a file here';
        dropZone.ondrop = (e) => {
            console.log("drop" + e);
                e.preventDefault();
                const files = e.dataTransfer.files;
                handleFiles(files);
                dropZone.innerText = dropZone.innerText + '\n' + files[0].name;

        };

        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.style.backgroundColor = '#e0f7fa';
        };

        dropZone.ondragleave = () => {
            dropZone.style.backgroundColor = '#f9f9f9';
        };

        // File input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.marginTop = '10px';
        fileInput.onchange = (e) => {
            const files = e.target.files;
            handleFiles(files);
        };

        dialogBox.appendChild(dropZone);
        dialogBox.appendChild(fileInput);
        overlay.appendChild(dialogBox);
        // document.body.appendChild(dialogBox);
        document.body.appendChild(overlay);

        // if (e.target == dialogBox) {
        //     document.body.removeChild(dialogBox);
        // }
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    });

}

function handleFiles(files) {
    alert(`You uploaded: ${files[0].name}`);
}

function yourCardFeature() {
    const yourCardBtn = document.querySelector('#your-card-button');

    yourCardBtn.addEventListener('click', () => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = "overlay";

        const right = document.createElement('div');
        right.id = "right-col";

        const left = document.createElement('div');
        left.id = "left-col";

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'Close';
        closeBtn.id = 'closeBtn';

        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = 'Edit';

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'delete';

        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = 'Download';

        // Create popup
        const popup = document.createElement('div');
        popup.id = "popup";



        // Close handler
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Optional: clicking outside popup also closes it
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Add content
        popup.innerHTML += `<h2>Your Card</h2><p>Some other content goes here.</p>`;
        overlay.appendChild(left);
        overlay.appendChild(popup);
        overlay.appendChild(right);
        left.appendChild(downloadBtn);
        left.appendChild(deleteBtn);
        left.appendChild(editBtn);
        right.appendChild(closeBtn);
        document.body.appendChild(overlay);
    });

}